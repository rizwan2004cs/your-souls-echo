import { Card } from "@/components/ui/card";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface VerseDisplayProps {
  verse: string | null;
  translation?: string;
  detectedMode?: string;
  emotionalInput: string;
  modeId: string;
}

export const VerseDisplay = ({ verse, translation, detectedMode, emotionalInput, modeId }: VerseDisplayProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSaveVerse = async () => {
    if (!verse || !user) {
      toast.error("Please sign in to save verses");
      return;
    }

    try {
      const { error } = await supabase.from("verses").insert({
        user_id: user.id,
        emotional_input: emotionalInput,
        mode_id: modeId || null,
        verse_response: verse,
        language: "multi",
        tags: [],
        is_private: false,
      });

      if (error) {
        console.error("Save error:", error);
        throw error;
      }
      
      setIsSaved(true);
      toast.success("Verse saved to your journey");
    } catch (error: any) {
      console.error("Error saving verse:", error);
      toast.error(error.message || "Could not save verse");
    }
  };

  if (!verse) return null;

  return (
    <Card className="p-8 bg-gradient-to-br from-card to-muted/30 border-border shadow-lg backdrop-blur-sm">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="prose prose-lg">
              <p className="text-foreground/80 text-sm italic leading-relaxed">
                {emotionalInput}
              </p>
            </div>
            <div className="border-l-4 border-primary/40 pl-6 py-2 space-y-4">
              {/* Original verse in Urdu/Hindi - Large font */}
              <p className="text-foreground font-serif text-2xl md:text-3xl leading-relaxed whitespace-pre-line">
                {verse}
              </p>
              
              {/* English Translation - Smaller font (3x smaller than original) */}
              {translation && (
                <div className="pt-3 border-t border-border/20">
                  <p className="text-muted-foreground text-sm italic leading-relaxed opacity-80">
                    {translation}
                  </p>
                </div>
              )}
              
              {detectedMode && (
                <p className="text-muted-foreground/60 text-xs pt-2">
                  <span className="font-medium">Mode:</span> {detectedMode}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveVerse}
              disabled={isSaved}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {isSaved ? (
                <>
                  <Bookmark className="w-4 h-4 mr-2 fill-current" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save to Journey
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
