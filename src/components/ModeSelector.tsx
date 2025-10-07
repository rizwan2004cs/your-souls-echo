import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmotionalMode {
  id: string;
  name: string;
  trigger: string;
  response_style: string;
}

interface ModeSelectorProps {
  selectedMode: EmotionalMode | null;
  onSelectMode: (mode: EmotionalMode) => void;
}

export const ModeSelector = ({ selectedMode, onSelectMode }: ModeSelectorProps) => {
  const [modes, setModes] = useState<EmotionalMode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModes();
  }, []);

  const fetchModes = async () => {
    try {
      const { data, error } = await supabase
        .from("emotional_modes")
        .select("*")
        .order("name");

      if (error) throw error;
      setModes(data || []);
      
      // Select first mode by default
      if (data && data.length > 0 && !selectedMode) {
        onSelectMode(data[0]);
      }
    } catch (error) {
      console.error("Error fetching modes:", error);
      toast.error("Could not load emotional modes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Loading modes...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Choose your emotional resonance:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((mode) => (
          <Card
            key={mode.id}
            onClick={() => onSelectMode(mode)}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedMode?.id === mode.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="space-y-2">
              <h4 className="font-medium text-foreground text-sm">{mode.name}</h4>
              <Badge variant="secondary" className="text-xs">
                {mode.trigger}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
