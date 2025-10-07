import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hindi_urdu">Hindi-Urdu Mix (Roman)</SelectItem>
          <SelectItem value="roman_urdu">Roman Urdu</SelectItem>
          <SelectItem value="tamil">Tamil (Roman)</SelectItem>
          <SelectItem value="telugu">Telugu (Roman)</SelectItem>
          <SelectItem value="bengali">Bengali (Roman)</SelectItem>
          <SelectItem value="punjabi">Punjabi (Roman)</SelectItem>
          <SelectItem value="marathi">Marathi (Roman)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};