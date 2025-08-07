-- First ensure the users table exists with proper structure for Google auth
-- Check if we need to modify the existing users table to support Google auth
-- Add avatar_url column if it doesn't exist and ensure proper indexes

-- Add Google-specific columns and ensure proper token initialization
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS google_id text UNIQUE,
ADD COLUMN IF NOT EXISTS last_sign_in_at timestamp with time zone DEFAULT now();

-- Create index for Google ID lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id) WHERE google_id IS NOT NULL;

-- Create function to handle Google auth user creation/update
CREATE OR REPLACE FUNCTION public.handle_google_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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

-- Create trigger for Google auth user creation
DROP TRIGGER IF EXISTS on_auth_user_created_google ON auth.users;
CREATE TRIGGER on_auth_user_created_google
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (NEW.raw_user_meta_data IS NOT NULL)
  EXECUTE FUNCTION public.handle_google_auth_user();

-- Function to safely update user tokens
CREATE OR REPLACE FUNCTION public.update_user_tokens(user_uuid uuid, token_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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