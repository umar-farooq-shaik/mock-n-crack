import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://iyljwzhuvcsmcpstbyqq.supabase.ciyljwzhuvcsmcpsto,https://lovable.dev,http://localhost:8080,http://localhost:3000',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const sampleQuestions = [
      // ReactJS Questions
      { topic: 'reactjs', question: 'What is JSX and how does it work in React?' },
      { topic: 'reactjs', question: 'Explain the difference between state and props in React.' },
      { topic: 'reactjs', question: 'What are React hooks and why were they introduced?' },
      { topic: 'reactjs', question: 'How does the virtual DOM work in React?' },
      { topic: 'reactjs', question: 'What is the useEffect hook used for?' },
      { topic: 'reactjs', question: 'Explain the concept of component lifecycle in React.' },
      { topic: 'reactjs', question: 'What is Context API and when would you use it?' },
      { topic: 'reactjs', question: 'How do you handle forms in React?' },
      
      // JavaScript Questions
      { topic: 'javascript', question: 'Explain closures in JavaScript with an example.' },
      { topic: 'javascript', question: 'What is the difference between let, const, and var?' },
      { topic: 'javascript', question: 'How does asynchronous JavaScript work?' },
      { topic: 'javascript', question: 'What is the event loop in JavaScript?' },
      { topic: 'javascript', question: 'Explain prototypal inheritance in JavaScript.' },
      { topic: 'javascript', question: 'What are promises and how do they work?' },
      { topic: 'javascript', question: 'What is the this keyword in JavaScript?' },
      
      // Python Questions
      { topic: 'python', question: 'What are Python decorators and how do you use them?' },
      { topic: 'python', question: 'Explain the difference between lists and tuples in Python.' },
      { topic: 'python', question: 'What is the Global Interpreter Lock (GIL) in Python?' },
      { topic: 'python', question: 'How do you handle exceptions in Python?' },
      { topic: 'python', question: 'What are Python generators and when would you use them?' },
      
      // Database Questions
      { topic: 'database', question: 'What is normalization in database design?' },
      { topic: 'database', question: 'Explain the difference between SQL and NoSQL databases.' },
      { topic: 'database', question: 'What are database indexes and when should you use them?' },
      { topic: 'database', question: 'What is ACID in database transactions?' },
      { topic: 'database', question: 'How do you handle database deadlocks?' },
      
      // System Design Questions
      { topic: 'system design', question: 'How would you design a URL shortening service like bit.ly?' },
      { topic: 'system design', question: 'Explain the concept of load balancing.' },
      { topic: 'system design', question: 'What is caching and what are different caching strategies?' },
      { topic: 'system design', question: 'How would you design a chat application?' },
      { topic: 'system design', question: 'What is database sharding?' }
    ];

    // Insert questions into database
    const { data, error } = await supabaseClient
      .from('technical_questions')
      .insert(sampleQuestions);

    if (error) {
      // Silent error handling - no console logging
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Sample questions seeded successfully',
      count: sampleQuestions.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Silent error handling - no console logging
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});