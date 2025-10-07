-- Make user_id nullable to support anonymous users
ALTER TABLE public.conversation_history 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy to allow anonymous insertions
DROP POLICY IF EXISTS "Users can insert their own conversation history" ON public.conversation_history;

CREATE POLICY "Users can insert conversation history"
ON public.conversation_history
FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND auth.uid() IS NULL)
);

-- Update RLS policy for viewing to include anonymous conversations
DROP POLICY IF EXISTS "Users can view their own conversation history" ON public.conversation_history;

CREATE POLICY "Users can view conversation history"
ON public.conversation_history
FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);