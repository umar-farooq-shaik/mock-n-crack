import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gemini API keys for rotation
const GEMINI_KEYS = [
  Deno.env.get('GEMINI_KEY_1'),
  Deno.env.get('GEMINI_KEY_2'),
  Deno.env.get('GEMINI_KEY_3'),
  Deno.env.get('GEMINI_KEY_4'),
  Deno.env.get('GEMINI_KEY_5'),
  Deno.env.get('GEMINI_KEY_6'),
  Deno.env.get('GEMINI_KEY_7'),
  Deno.env.get('GEMINI_KEY_8'),
  Deno.env.get('GEMINI_KEY_9'),
  Deno.env.get('GEMINI_KEY_10'),
].filter(Boolean); // Remove null/undefined keys

let currentKeyIndex = 0;

// Environment detection for tiered logging
const isDev = Deno.env.get('ENVIRONMENT') === 'development';

function normalizeText(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isSimilar(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const min = 12;
  return (a.length >= min && b.length >= min) && (a.includes(b) || b.includes(a));
}

function isSimilarToAny(candidate: string, existing: Set<string>): boolean {
  for (const x of existing) {
    if (isSimilar(candidate, x)) return true;
  }
  return false;
}

async function generateQuestionWithGemini(topic: string): Promise<string> {
  console.log('Generating question with Gemini for topic:', topic);
  
  // Only log sensitive key information in development
  if (isDev) {
    console.log('Available Gemini keys:', GEMINI_KEYS.length);
  }
  
  if (GEMINI_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured');
  }

  const prompt = `You are a senior technical interviewer.

Ask one clear, short, voice-friendly interview question based on the topic: "${topic}".

❌ Do not ask follow-up questions.
❌ Do not add explanations.
✅ Only one short, plain-text question (<20 words).

Examples:
- What is JSX in React?
- How does async/await work in JavaScript?
- What is normalization in a database?`;

  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const key = GEMINI_KEYS[currentKeyIndex];
    
    // Only log key rotation details in development
    if (isDev) {
      console.log(`Trying Gemini key ${currentKeyIndex + 1}/${GEMINI_KEYS.length}`);
    }
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error ${response.status}:`, errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        console.log('Question generated successfully');
        return text.trim();
      }
      throw new Error('No content generated');
    } catch (err) {
      console.error(`Key ${currentKeyIndex + 1} failed:`, err.message);
      currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
    }
  }

  console.error('All Gemini keys exhausted');
  throw new Error("All Gemini keys failed.");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();

    // Input validation for topic
    if (!topic || typeof topic !== 'string') {
      console.error('Invalid topic parameter:', topic);
      return new Response(
        JSON.stringify({ 
          error: 'Topic is required and must be a string',
          code: 'INVALID_INPUT'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitize and validate topic length
    const sanitizedTopic = topic.trim();
    if (sanitizedTopic.length === 0) {
      console.error('Empty topic parameter');
      return new Response(
        JSON.stringify({ 
          error: 'Topic cannot be empty',
          code: 'INVALID_INPUT'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (sanitizedTopic.length > 200) {
      console.error('Topic too long:', sanitizedTopic.length);
      return new Response(
        JSON.stringify({ 
          error: 'Topic must be less than 200 characters',
          code: 'INVALID_INPUT'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check for malicious patterns (basic prompt injection prevention)
    const suspiciousPatterns = [
      /ignore\s+(previous|all)\s+instructions/i,
      /system\s*:/i,
      /\[INST\]/i,
      /<\|.*?\|>/,
      /###\s*System/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitizedTopic)) {
        console.error('Suspicious input detected:', sanitizedTopic);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid topic format',
            code: 'INVALID_INPUT'
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Initialize Supabase clients and authenticate request
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Client with service role for privileged DB operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Client with user context for auth
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Check user's current token balance BEFORE deducting
    const { data: userData, error: userError2 } = await supabase
      .from('users')
      .select('token_balance')
      .eq('user_id', user.id)
      .single();

    if (userError2 || !userData) {
      throw new Error('User not found');
    }

    if (userData.token_balance < 1) {
      throw new Error('Insufficient tokens. You need at least 1 token to generate a question.');
    }

    let question: string;
    let questionGenerated = false;

    // First, try to get an unused question from the database
    const { data: storedQuestions, error: dbError } = await supabase
      .from('technical_questions')
      .select('*')
      .eq('topic', sanitizedTopic)
      .eq('used', false)
      .limit(1);

    if (dbError) {
      console.error('Error fetching stored questions:', dbError.message);
    }

    if (storedQuestions && storedQuestions.length > 0) {
      // Mark the question as used
      await supabase
        .from('technical_questions')
        .update({ used: true })
        .eq('id', storedQuestions[0].id);

      question = storedQuestions[0].question;
      questionGenerated = true;
      console.log('Using stored question from database');
    } else {
      // No stored questions available, generate with Gemini
      try {
        question = await generateQuestionWithGemini(sanitizedTopic);
        
        // Store the generated question for future use
        await supabase
          .from('technical_questions')
          .insert({
            topic: sanitizedTopic,
            question,
            used: true
          });
        
        questionGenerated = true;
        console.log('Generated new question and stored in database');
      } catch (geminiError) {
        console.error('Gemini generation failed:', geminiError.message);
        // If Gemini fails, try to reset and reuse existing questions
        try {
          const { data: resetResult, error: resetError } = await supabase.rpc('reset_topic_questions', {
            topic_name: sanitizedTopic
          });

          if (!resetError && resetResult > 0) {
            // Get a reset question
            const { data: resetQuestions } = await supabase
              .from('technical_questions')
              .eq('topic', sanitizedTopic)
              .eq('used', false)
              .limit(1);

            if (resetQuestions && resetQuestions.length > 0) {
              await supabase
                .from('technical_questions')
                .update({ used: true })
                .eq('id', resetQuestions[0].id);

              question = resetQuestions[0].question;
              questionGenerated = true;
              console.log('Using reset question after Gemini failure');
            } else {
              throw new Error('No questions available after reset');
            }
          } else {
            throw new Error('Failed to reset questions');
          }
        } catch (resetError) {
          console.error('Reset attempt failed, trying final Gemini fallback:', resetError.message);
          // Final fallback: generate a new question with Gemini
          question = await generateQuestionWithGemini(sanitizedTopic);
          
          // Store for future use
          await supabase
            .from('technical_questions')
            .insert({
              topic: sanitizedTopic,
              question,
              used: true
            });
          
          questionGenerated = true;
          // Silent success - no console logging
        }
      }
    }

    // Only deduct tokens AFTER successfully generating/getting a question
    if (questionGenerated && question) {
      const { data: newBalance, error: debitError } = await supabaseAuth.rpc('update_user_tokens', {
        user_uuid: user.id,
        token_change: -1,
      });

      if (debitError) {
        console.error('Token debit error:', debitError.message);
        throw new Error('Token debit failed');
      }
      
      console.log('Question generated and tokens deducted successfully');

      // Return the question with updated token balance
      return new Response(JSON.stringify({ 
        question,
        newBalance,
        tokensUsed: 1
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Failed to generate question');
    }

  } catch (error) {
    // Log detailed errors only in development
    if (isDev) {
      console.error('Edge function error:', error.message, error.stack);
    } else {
      console.error('Edge function error:', 'Internal error');
    }
    
    // Return generic error to clients in production
    return new Response(JSON.stringify({ 
      error: isDev ? error.message : 'Service temporarily unavailable' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});