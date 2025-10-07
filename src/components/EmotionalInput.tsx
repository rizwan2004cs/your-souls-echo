import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface EmotionalInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export const EmotionalInput = ({ onSubmit, isLoading }: EmotionalInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
      setInput("");
    }
  };

  return (
    <div className="w-full space-y-4">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Share what you're feeling... your words will be held gently"
        className="min-h-[120px] resize-none bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 transition-all"
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) {
            handleSubmit();
          }
        }}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Crafting verse...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Receive Verse
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
