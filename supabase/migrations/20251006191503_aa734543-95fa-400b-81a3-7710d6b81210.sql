-- Create table for emotional modes
CREATE TABLE public.emotional_modes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  response_style TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for verses
CREATE TABLE public.verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  emotional_input TEXT NOT NULL,
  mode_id UUID REFERENCES public.emotional_modes(id),
  verse_response TEXT NOT NULL,
  language TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_private BOOLEAN DEFAULT false
);

-- Create table for user profiles (optional, for tracking emotional journeys)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emotional_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for emotional_modes (public read)
CREATE POLICY "Anyone can view emotional modes"
ON public.emotional_modes
FOR SELECT
USING (true);

-- RLS Policies for verses
CREATE POLICY "Users can view their own verses"
ON public.verses
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create verses"
ON public.verses
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own verses"
ON public.verses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own verses"
ON public.verses
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Insert default emotional modes
INSERT INTO public.emotional_modes (name, trigger, response_style) VALUES
('Safeguard Mode', 'Grief, trauma, loss', 'Gentle, non-assumptive, soft metaphors'),
('PulseVerse', 'Solitude, stillness', 'Minimalist, ambient, affirming'),
('DreamVerse', 'Surreal, subconscious input', 'Nonlinear, metaphor-rich, intuitive'),
('Echo Mode', 'Recurring emotion', 'Recursive, memory-threaded'),
('Cultural Echo', 'Language-specific input', 'Emotionally adapted across cultures'),
('Fading Echo', 'Memory loss, disorientation', 'Anchoring, familiar, non-corrective'),
('Release Mode', 'Letting go, emotional closure', 'Soft detachment, permission to move on'),
('Private Verse Mode', 'Intimate, one-time verse', 'Ephemeral, sacred tone');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();