-- Secure user_tokens_view and harden RPC privileges
BEGIN;

-- Recreate user_tokens_view with invoker privileges so RLS applies to the querying user
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

-- Restrict view access: no public/anon, allow only authenticated to SELECT
REVOKE ALL ON TABLE public.user_tokens_view FROM PUBLIC;
REVOKE ALL ON TABLE public.user_tokens_view FROM anon;
GRANT SELECT ON TABLE public.user_tokens_view TO authenticated;

-- Harden RPC: update_user_tokens should not be callable by anon/public
REVOKE ALL ON FUNCTION public.update_user_tokens(uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_user_tokens(uuid, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.update_user_tokens(uuid, integer) TO authenticated;

COMMIT;