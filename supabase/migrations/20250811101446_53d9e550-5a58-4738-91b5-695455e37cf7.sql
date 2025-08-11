-- Secure user_tokens_view by enforcing per-user access and enabling RLS on underlying table
BEGIN;

-- 1) Ensure RLS is enabled on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2) Add SELECT policy to allow users to read only their own row (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can select own row'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Users can select own row"
      ON public.users
      FOR SELECT
      USING (auth.uid() = user_id);
    $$;
  END IF;
END $$;

-- 3) Recreate the view to filter by the current authenticated user
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

-- 4) Lock down privileges: only authenticated clients may select; block anon
REVOKE ALL ON TABLE public.user_tokens_view FROM anon;
GRANT SELECT ON TABLE public.user_tokens_view TO authenticated;

COMMIT;