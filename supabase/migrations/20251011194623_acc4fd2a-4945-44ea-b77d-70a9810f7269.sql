-- Fix critical security issues

-- 1. Harden update_user_tokens to reject positive token changes
CREATE OR REPLACE FUNCTION public.update_user_tokens(user_uuid uuid, token_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance integer;
  requester uuid;
BEGIN
  -- Get authenticated user
  requester := auth.uid();
  
  IF requester IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Not authenticated';
  END IF;

  -- Block positive token changes from clients
  IF token_change > 0 THEN
    RAISE EXCEPTION 'Cannot add tokens through this function';
  END IF;
  
  -- Only allow if user is updating their own balance
  IF requester::text != user_uuid::text THEN
    RAISE EXCEPTION 'Forbidden: Can only update own tokens';
  END IF;
  
  -- Update token balance
  UPDATE public.users
  SET token_balance = GREATEST(0, token_balance + token_change),
      updated_at = now()
  WHERE user_id = user_uuid
  RETURNING token_balance INTO new_balance;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  IF new_balance = 0 AND (token_balance + token_change) < 0 THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;
  
  RETURN new_balance;
END;
$$;

-- 2. Drop insecure views that bypass RLS
DROP VIEW IF EXISTS public.users_editable CASCADE;
DROP VIEW IF EXISTS public.user_tokens_view CASCADE;

-- 3. Verify RLS is enabled on all sensitive tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_balance_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_questions ENABLE ROW LEVEL SECURITY;