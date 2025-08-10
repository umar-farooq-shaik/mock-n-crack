-- Add explicit deny-all RLS policies on audit table to satisfy linter and clarify intent
CREATE POLICY "No select on token_balance_changes"
ON public.token_balance_changes
FOR SELECT
USING (false);

CREATE POLICY "No insert on token_balance_changes"
ON public.token_balance_changes
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No update on token_balance_changes"
ON public.token_balance_changes
FOR UPDATE
USING (false);

CREATE POLICY "No delete on token_balance_changes"
ON public.token_balance_changes
FOR DELETE
USING (false);