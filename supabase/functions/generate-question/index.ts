import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://iyljwzhuvcsmcpstbyqq.supabase.co,https://lovable.dev,http://localhost:8080,http://localhost:3000',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
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

async function generateQuestionWithGemini(topic: string): Promise<string> {
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
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        return text.trim();
      }
      throw new Error('No content generated');
    } catch (err) {
      // Silent error handling - no console logging
      currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
    }
  }

  throw new Error("All Gemini keys failed.");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    
    if (!topic) {
      throw new Error('Topic is required');
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
      .eq('topic', topic)
      .eq('used', false)
      .limit(1);

    if (dbError) {
      // Silent error handling - no console logging
    }

    if (storedQuestions && storedQuestions.length > 0) {
      // Mark the question as used
      await supabase
        .from('technical_questions')
        .update({ used: true })
        .eq('id', storedQuestions[0].id);

      question = storedQuestions[0].question;
      questionGenerated = true;
      // Silent success - no console logging
    } else {
      // No stored questions available, generate with Gemini
      try {
        question = await generateQuestionWithGemini(topic);
        
        // Store the generated question for future use
        await supabase
          .from('technical_questions')
          .insert({
            topic,
            question,
            used: true
          });
        
        questionGenerated = true;
        // Silent success - no console logging
      } catch (geminiError) {
        // If Gemini fails, try to reset and reuse existing questions
        try {
          const { data: resetResult, error: resetError } = await supabase.rpc('reset_topic_questions', {
            topic_name: topic
          });

          if (!resetError && resetResult > 0) {
            // Get a reset question
            const { data: resetQuestions } = await supabase
              .from('technical_questions')
              .eq('topic', topic)
              .eq('used', false)
              .limit(1);

            if (resetQuestions && resetQuestions.length > 0) {
              await supabase
                .from('technical_questions')
                .update({ used: true })
                .eq('id', resetQuestions[0].id);

              question = resetQuestions[0].question;
              questionGenerated = true;
              // Silent success - no console logging
            } else {
              throw new Error('No questions available after reset');
            }
          } else {
            throw new Error('Failed to reset questions');
          }
        } catch (resetError) {
          // Final fallback: generate a new question with Gemini
          question = await generateQuestionWithGemini(topic);
          
          // Store for future use
          await supabase
            .from('technical_questions')
            .insert({
              topic,
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
      const { data: newBalance, error: debitError } = await supabase.rpc('update_user_tokens', {
        user_uuid: user.id,
        token_change: -1,
      });

      if (debitError) {
        // Silent error handling - no console logging
        throw new Error('Token debit failed');
      }

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
    // Silent error handling - no console logging
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});