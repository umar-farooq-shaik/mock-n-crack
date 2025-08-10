-- 1) Harden update_user_tokens: enforce self-only updates using JWT, keep SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_user_tokens(user_uuid uuid, token_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  jwt jsonb;
  requester uuid;
  new_balance integer;
BEGIN
  BEGIN
    jwt := COALESCE(current_setting('request.jwt.claims', true)::jsonb, '{}'::jsonb);
    requester := NULLIF(jwt->>'sub', '')::uuid;
  EXCEPTION WHEN others THEN
    requester := NULL;
  END;

  IF requester IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF requester <> user_uuid THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

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
$function$;

-- 2) Secure audit function to work with RLS and ensure stable search_path
CREATE OR REPLACE FUNCTION public.log_token_balance_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  actor text;
  source_desc text := TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME || '.' || TG_OP;
BEGIN
  -- Try to capture the JWT claims context; fallback to DB role
  BEGIN
    actor := COALESCE(current_setting('request.jwt.claims', true), current_user);
  EXCEPTION WHEN others THEN
    actor := current_user;
  END;

  IF (TG_OP = 'UPDATE') AND (NEW.token_balance IS DISTINCT FROM OLD.token_balance) THEN
    INSERT INTO public.token_balance_changes(
      user_id, email, old_balance, new_balance, changed_by, change_source, created_at
    )
    VALUES (
      COALESCE(NEW.user_id, OLD.user_id),
      COALESCE(NEW.email, OLD.email),
      OLD.token_balance,
      NEW.token_balance,
      actor,
      source_desc,
      now()
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- 3) Attach trigger to users table to log token balance changes (idempotent)
DROP TRIGGER IF EXISTS log_token_balance_changes ON public.users;
CREATE TRIGGER log_token_balance_changes
AFTER UPDATE ON public.users
FOR EACH ROW
WHEN (OLD.token_balance IS DISTINCT FROM NEW.token_balance)
EXECUTE FUNCTION public.log_token_balance_change();

-- 4) Enable and harden RLS on audit table (no policies means no access)
ALTER TABLE public.token_balance_changes ENABLE ROW LEVEL SECURITY;
-- Optional: explicitly revoke public access by not adding policies.

-- 5) Remove overly permissive UPDATE policy on technical_questions
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'technical_questions' 
      AND policyname = 'Technical questions can be updated publicly'
  ) THEN
    EXECUTE 'DROP POLICY "Technical questions can be updated publicly" ON public.technical_questions';
  END IF;
END $$;