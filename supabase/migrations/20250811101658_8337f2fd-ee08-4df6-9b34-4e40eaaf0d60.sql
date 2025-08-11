-- Fix: Ensure views run with invoker privileges so RLS applies to the querying user
BEGIN;

-- Recreate user_tokens_view with security_invoker enabled
DROP VIEW IF EXISTS public.user_tokens_view;

CREATE VIEW public.user_tokens_view
WITH (security_invoker = true, security_barrier = true) AS
SELECT 
  u.user_id,
  u.email,
  u.token_balance,
  u.updated_at
FROM public.users u
WHERE u.user_id = auth.uid();

-- Ensure only authenticated clients can read the view
REVOKE ALL ON TABLE public.user_tokens_view FROM anon;
GRANT SELECT ON TABLE public.user_tokens_view TO authenticated;

COMMIT;