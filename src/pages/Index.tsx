import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EmotionalInput } from "@/components/EmotionalInput";
import { ModeSelector } from "@/components/ModeSelector";
import { VerseDisplay } from "@/components/VerseDisplay";
import { VerseHistoryCard } from "@/components/VerseHistoryCard";
import { AuthDialog } from "@/components/AuthDialog";
import { LanguageSelector } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Heart, Sparkles, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmotionalMode {
  id: string;
  name: string;
  trigger: string;
  response_style: string;
}

interface VerseItem {
  verse: string;
  translation: string;
  detectedMode: string;
  emotionalInput: string;
  createdAt: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<EmotionalMode | null>(null);
  const [sessionVerses, setSessionVerses] = useState<VerseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("hindi_urdu");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("verseYou_language");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      
      if (data.user) {
        // Check admin role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        if (roles) {
          setIsAdmin(true);
        }

        // Get user's language preference
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("preferred_language")
          .eq("user_id", data.user.id)
          .maybeSingle();
        
        if (prefs?.preferred_language) {
          setSelectedLanguage(prefs.preferred_language);
        }
      }
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem("verseYou_language", language);

    // Save to user preferences if logged in
    if (user) {
      const { data: existing } = await supabase
        .from("user_preferences")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_preferences")
          .update({ preferred_language: language })
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("user_preferences")
          .insert({ user_id: user.id, preferred_language: language });
      }
    }
  };

  const handleGenerateVerse = async (input: string) => {
    setIsLoading(true);

    try {
      // Get conversation history for context
      let conversationHistory = [];
      if (user) {
        const { data: history } = await supabase
          .from("conversation_history")
          .select("emotional_input, verse_response")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        
        conversationHistory = history || [];
      }

      const { data, error } = await supabase.functions.invoke("generate-verse", {
        body: {
          emotionalInput: input,
          sTags: ["S"],
          language: selectedLanguage,
          conversationHistory,
          userId: user?.id || null,
        },
      });

      if (error) throw error;
      
      if (data?.verse) {
        // Add new verse to session history
        const newVerse: VerseItem = {
          verse: data.verse,
          translation: data.translation || "",
          detectedMode: data.detectedMode || "",
          emotionalInput: input,
          createdAt: new Date().toISOString(),
        };
        
        setSessionVerses(prev => [newVerse, ...prev]);
        
        // Save to conversation history if logged in
        if (user) {
          await supabase.from("conversation_history").insert({
            user_id: user.id,
            emotional_input: input,
            verse_response: data.verse,
            translation: data.translation || "",
            detected_mode: data.detectedMode || "",
            language: selectedLanguage,
          });
        }
        
        // Find and set the mode
        const { data: modes } = await supabase
          .from("emotional_modes")
          .select("*")
          .eq("name", data.detectedMode)
          .maybeSingle();
        
        if (modes) {
          setSelectedMode(modes);
        }
      } else {
        throw new Error("No verse generated");
      }
    } catch (error: any) {
      console.error("Error generating verse:", error);
      toast.error(error.message || "Could not generate verse. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">VerseYou</h1>
              <p className="text-xs text-muted-foreground">Your poetic companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground">
            Share your emotions,
            <br />
            <span className="text-primary">receive poetry</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            VerseYou holds your feelings gently and responds with emotionally resonant verses.
            No advice, no analysis—just poetic reflection.
          </p>
        </section>

        {/* Input Section */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-end mb-4">
            <LanguageSelector value={selectedLanguage} onChange={handleLanguageChange} />
          </div>
          <EmotionalInput onSubmit={handleGenerateVerse} isLoading={isLoading} />
        </section>

        {/* Latest Verse Display - Large */}
        {sessionVerses.length > 0 && (
          <section className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <VerseDisplay
              verse={sessionVerses[0].verse}
              translation={sessionVerses[0].translation}
              detectedMode={sessionVerses[0].detectedMode}
              emotionalInput={sessionVerses[0].emotionalInput}
              modeId={selectedMode?.id || ""}
            />
          </section>
        )}

        {/* Previous Verses - Mini Cards */}
        {sessionVerses.length > 1 && (
          <section className="max-w-5xl mx-auto space-y-4">
            <h3 className="text-lg font-medium text-muted-foreground text-center mb-6">
              Previous in this session
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionVerses.slice(1).map((item, index) => (
                <VerseHistoryCard
                  key={`verse-${sessionVerses.length - index}`}
                  verse={item.verse}
                  translation={item.translation}
                  emotionalInput={item.emotionalInput}
                  detectedMode={item.detectedMode}
                  createdAt={item.createdAt}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer Info */}
        {!user && (
          <section className="text-center py-12 space-y-4">
            <p className="text-muted-foreground text-sm">
              Sign in to save verses to your emotional journey
            </p>
            <Button variant="outline" onClick={() => setAuthOpen(true)}>
              Create Free Account
            </Button>
          </section>
        )}
      </main>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default Index;
