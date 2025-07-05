import { Label } from "../ui/label";
import {
  RadioGroup as RadioGroupRoot,
  RadioGroupItem,
} from "../ui/radio-group";

export type RadioGroupOption = {
  label: string;
  value: string;
};

export type RadioGroupProps = {
  options: RadioGroupOption[];
  value?: string | undefined | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export function RadioGroup({
  value,
  defaultValue,
  options,
  onChange,
}: RadioGroupProps) {
  return (
    <RadioGroupRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
    >
      {options.map(({ label, value }) => (
        <Label key={value}>
          <RadioGroupItem value={value} /> {label}
        </Label>
      ))}
    </RadioGroupRoot>
  );
}
