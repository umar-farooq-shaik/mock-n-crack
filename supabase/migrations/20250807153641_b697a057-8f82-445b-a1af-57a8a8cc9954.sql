-- Fix security linter warnings by setting proper search_path for functions

-- Fix function search path for handle_google_auth_user
CREATE OR REPLACE FUNCTION public.handle_google_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  -- Insert or update user profile based on Google auth
  INSERT INTO public.users (
    user_id,
    email,
    name,
    avatar_url,
    google_id,
    token_balance,
    last_sign_in_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'sub',
    1000, -- Initial token balance for new users
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    last_sign_in_at = now(),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    name = COALESCE(EXCLUDED.name, public.users.name);
  
  RETURN NEW;
END;
$$;

-- Fix function search path for update_user_tokens
CREATE OR REPLACE FUNCTION public.update_user_tokens(user_uuid uuid, token_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
DECLARE
  new_balance integer;
BEGIN
  UPDATE public.users 
  SET 
    token_balance = GREATEST(0, token_balance + token_change),
    updated_at = now()
  WHERE user_id = user_uuid
  RETURNING token_balance INTO new_balance;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  RETURN new_balance;
END;
$$;