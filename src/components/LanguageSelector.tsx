import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Languages className="w-4 h-4 text-muted-foreground" />
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hindi_urdu">Hindi-Urdu Mix (Roman)</SelectItem>
            <SelectItem value="roman_urdu">Roman Urdu</SelectItem>
            <SelectItem value="urdu_native">Urdu (اُردُو - Native script)</SelectItem>
            <SelectItem value="tamil">Tamil (Roman)</SelectItem>
            <SelectItem value="telugu_roman">Telugu (Roman)</SelectItem>
            <SelectItem value="telugu_native">Telugu (తెలుగు - Native script)</SelectItem>
            <SelectItem value="bengali">Bengali (Roman)</SelectItem>
            <SelectItem value="punjabi">Punjabi (Roman)</SelectItem>
            <SelectItem value="marathi">Marathi (Roman)</SelectItem>
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger>
            <span className="text-xs text-muted-foreground underline cursor-help">?</span>
          </TooltipTrigger>
          <TooltipContent>
            Native-script options return poetry in the language's script (e.g., اردو, తెలుగు). Roman options return transliteration in Latin letters.
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};