-- Fix restrictive SELECT policies so admins see all rows and users see their own + anonymous
begin;

-- conversation_history: drop existing SELECT policies and create a single permissive one
DROP POLICY IF EXISTS "Admins can view all conversation history" ON public.conversation_history;
DROP POLICY IF EXISTS "Users can view conversation history" ON public.conversation_history;

CREATE POLICY "Select conversation history (admin all, user own + anon)"
ON public.conversation_history
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR auth.uid() = user_id
  OR user_id IS NULL
);

-- profiles: allow admins to view all profiles for name display in Admin panel
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Recreate user view own policy (keep existing behavior)
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Add admin visibility policy
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

commit;