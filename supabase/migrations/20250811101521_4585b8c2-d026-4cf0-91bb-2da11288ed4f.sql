-- Secure user_tokens_view by enforcing per-user filtering and limiting privileges
BEGIN;

-- Recreate the view so it only exposes the requesting user's data
DROP VIEW IF EXISTS public.user_tokens_view;

CREATE VIEW public.user_tokens_view
WITH (security_barrier = true) AS
SELECT 
  u.user_id,
  u.email,
  u.token_balance,
  u.updated_at
FROM public.users u
WHERE u.user_id = auth.uid();

-- Ensure only authenticated clients can read the view, block anon
REVOKE ALL ON TABLE public.user_tokens_view FROM anon;
GRANT SELECT ON TABLE public.user_tokens_view TO authenticated;

COMMIT;