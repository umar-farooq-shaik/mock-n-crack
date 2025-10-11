-- Drop unused SECURITY DEFINER token functions that pose security risk
DROP FUNCTION IF EXISTS public.update_token_balance_bypass_rls(uuid, integer);
DROP FUNCTION IF EXISTS public.update_token_balance_direct(uuid, integer);
DROP FUNCTION IF EXISTS public.update_token_balance_secure(uuid, integer);

-- Restrict technical_questions to service-role-only access
-- Drop permissive policies that allow all authenticated users
DROP POLICY IF EXISTS "Authenticated users can read questions" ON public.technical_questions;
DROP POLICY IF EXISTS "Authenticated users can update questions" ON public.technical_questions;
DROP POLICY IF EXISTS "Users can view questions" ON public.technical_questions;

-- Keep only service role access (this policy already exists, but ensuring it's the only one)
-- Service role policy already exists: "Service role can manage all questions"