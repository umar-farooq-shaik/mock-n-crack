-- Fix update_user_tokens to handle insufficient tokens check correctly and avoid ambiguous references
CREATE OR REPLACE FUNCTION public.update_user_tokens(user_uuid uuid, token_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester uuid;
  current_balance integer;
  new_balance integer;
BEGIN
  -- Ensure authenticated request
  requester := auth.uid();
  IF requester IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Not authenticated';
  END IF;

  -- Disallow positive changes from clients
  IF token_change > 0 THEN
    RAISE EXCEPTION 'Cannot add tokens through this function';
  END IF;
  
  -- Only allow self-updates
  IF requester::text <> user_uuid::text THEN
    RAISE EXCEPTION 'Forbidden: Can only update own tokens';
  END IF;

  -- Fetch current balance first
  SELECT token_balance INTO current_balance
  FROM public.users
  WHERE user_id = user_uuid;

  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Validate sufficient tokens BEFORE updating
  IF current_balance + token_change < 0 THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;

  -- Perform the update
  UPDATE public.users
  SET token_balance = current_balance + token_change,
      updated_at = now()
  WHERE user_id = user_uuid
  RETURNING token_balance INTO new_balance;

  RETURN new_balance;
END;
$$;