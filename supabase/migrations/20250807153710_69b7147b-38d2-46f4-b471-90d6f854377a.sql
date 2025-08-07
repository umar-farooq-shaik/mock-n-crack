-- Fix remaining function security warnings by updating existing functions

-- Fix search path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix search path for reset_topic_questions function  
CREATE OR REPLACE FUNCTION public.reset_topic_questions(topic_name text)
RETURNS integer
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.technical_questions 
  SET used = false 
  WHERE topic = topic_name AND used = true;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;