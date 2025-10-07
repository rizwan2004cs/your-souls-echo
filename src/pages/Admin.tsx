import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ConversationLog {
  id: string;
  user_id: string | null;
  emotional_input: string;
  verse_response: string;
  translation: string;
  detected_mode: string;
  language: string;
  created_at: string;
  user_email?: string;
}

const Admin = () => {
  const [logs, setLogs] = useState<ConversationLog[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetchLogs();
  }, []);

  const checkAdminAndFetchLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in");
        navigate("/");
        return;
      }

      // Check if user has admin role
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (roleError || !roles) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);

      // Fetch all conversation history with user emails
      const { data: logsData, error: logsError } = await supabase
        .from("conversation_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (logsError) throw logsError;

      // Fetch user emails for non-anonymous conversations
      const logsWithEmails = await Promise.all(
        (logsData || []).map(async (log) => {
          if (log.user_id) {
            const { data: { user: userData } } = await supabase.auth.admin.getUserById(log.user_id);
            return { ...log, user_email: userData?.email };
          }
          return { ...log, user_email: undefined };
        })
      );

      setLogs(logsWithEmails);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      // Fetch all conversation history
      const { data: logsData, error: logsError } = await supabase
        .from("conversation_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (logsError) throw logsError;

      // Fetch user emails for non-anonymous conversations
      const logsWithEmails = await Promise.all(
        (logsData || []).map(async (log) => {
          if (log.user_id) {
            const { data: { user: userData } } = await supabase.auth.admin.getUserById(log.user_id);
            return { ...log, user_email: userData?.email };
          }
          return { ...log, user_email: undefined };
        })
      );

      setLogs(logsWithEmails);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
    toast.success("Conversations refreshed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">VerseYou Admin</h1>
              <p className="text-xs text-muted-foreground">Conversation logs</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              All Conversations ({logs.length})
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {logs.map((log) => (
              <Card key={log.id} className="p-6 bg-card border-border">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.user_id ? (
                          <>User: {log.user_email || `${log.user_id.substring(0, 8)}...`}</>
                        ) : (
                          <span className="text-orange-500">Anonymous User</span>
                        )}
                        {" | "}Language: {log.language} | Mode: {log.detected_mode}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Input:</p>
                      <p className="text-sm text-foreground/80 italic">{log.emotional_input}</p>
                    </div>

                    <div className="border-l-4 border-primary/40 pl-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Generated Verse:</p>
                      <p className="text-foreground font-serif leading-relaxed whitespace-pre-line">
                        {log.verse_response}
                      </p>
                      {log.translation && (
                        <p className="text-sm text-muted-foreground italic mt-2">
                          {log.translation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {logs.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No conversations yet</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;