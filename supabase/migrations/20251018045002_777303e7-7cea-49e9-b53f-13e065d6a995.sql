-- Fix Function Search Path Mutable security issue
-- Set search_path for handle_users_view_update function

CREATE OR REPLACE FUNCTION public.handle_users_view_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    UPDATE public.users 
    SET 
      token_balance = NEW.token_balance,
      updated_at = now()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$function$;