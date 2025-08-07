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
      console.warn(`Gemini key ${currentKeyIndex + 1} failed:`, err.message);
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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, try to get an unused question from the database
    const { data: storedQuestions, error: dbError } = await supabase
      .from('technical_questions')
      .select('*')
      .eq('topic', topic)
      .eq('used', false)
      .limit(1);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    let question: string;

    if (storedQuestions && storedQuestions.length > 0) {
      // Use stored question and mark it as used
      const selectedQuestion = storedQuestions[0];
      question = selectedQuestion.question;

      // Mark question as used
      await supabase
        .from('technical_questions')
        .update({ used: true })
        .eq('id', selectedQuestion.id);

      console.log(`Using stored question for topic: ${topic}`);
    } else {
      // Check if we need to reset questions for this topic
      const { data: allTopicQuestions } = await supabase
        .from('technical_questions')
        .select('id')
        .eq('topic', topic);

      if (allTopicQuestions && allTopicQuestions.length > 0) {
        // Topic exists but all questions are used - reset them
        await supabase.rpc('reset_topic_questions', { topic_name: topic });
        
        // Try again to get a question
        const { data: resetQuestions } = await supabase
          .from('technical_questions')
          .select('*')
          .eq('topic', topic)
          .eq('used', false)
          .limit(1);

        if (resetQuestions && resetQuestions.length > 0) {
          const selectedQuestion = resetQuestions[0];
          question = selectedQuestion.question;

          await supabase
            .from('technical_questions')
            .update({ used: true })
            .eq('id', selectedQuestion.id);

          console.log(`Using reset question for topic: ${topic}`);
        } else {
          // Fallback to Gemini
          question = await generateQuestionWithGemini(topic);
          console.log(`Generated question with Gemini for topic: ${topic}`);
        }
      } else {
        // No questions exist for this topic - use Gemini
        question = await generateQuestionWithGemini(topic);
        console.log(`Generated question with Gemini for new topic: ${topic}`);
      }
    }

    return new Response(JSON.stringify({ question }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});