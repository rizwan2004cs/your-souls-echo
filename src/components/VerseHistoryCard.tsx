import { Card } from "@/components/ui/card";
import { useState } from "react";

interface VerseHistoryCardProps {
  verse: string;
  translation?: string;
  emotionalInput: string;
  detectedMode?: string;
  createdAt: string;
}

export const VerseHistoryCard = ({ 
  verse, 
  translation, 
  emotionalInput, 
  detectedMode,
  createdAt 
}: VerseHistoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`
        p-6 bg-gradient-to-br from-card to-muted/20 border-border 
        cursor-pointer transition-all duration-300 ease-in-out
        ${isHovered ? 'scale-110 shadow-2xl z-10' : 'scale-100 shadow-md hover:shadow-lg'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-3">
        <p className="text-muted-foreground text-xs italic line-clamp-1">
          {emotionalInput}
        </p>
        
        <div className="border-l-2 border-primary/30 pl-4 space-y-2">
          <p className={`
            text-foreground font-serif leading-relaxed whitespace-pre-line transition-all duration-300
            ${isHovered ? 'text-lg line-clamp-none' : 'text-sm line-clamp-3'}
          `}>
            {verse}
          </p>
          
          {translation && isHovered && (
            <p className="text-muted-foreground text-xs italic pt-2 border-t border-border/20 animate-in fade-in duration-300">
              {translation}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground/60 pt-2">
          {detectedMode && <span>{detectedMode}</span>}
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
};
