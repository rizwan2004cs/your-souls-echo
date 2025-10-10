import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music } from "lucide-react";

interface ToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ToneSelector = ({ value, onChange }: ToneSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Music className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="conversational">Conversational</SelectItem>
          <SelectItem value="classical">Classical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
