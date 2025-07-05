import { Checkbox as CheckboxRoot } from "@/components/ui/checkbox";
import { Label } from "../ui/label";

export type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
};

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Label>
        <CheckboxRoot checked={checked} onCheckedChange={onChange} /> {label}
      </Label>
    </div>
  );
}
