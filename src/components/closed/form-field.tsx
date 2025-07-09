import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField as FormFieldRoot,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";

export type FormFieldProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  label?: string;
  helperText?: string;
  optional?: boolean;
  optionalText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (field: any) => React.ReactNode;
};

export function FormField<TFormValues extends FieldValues>({
  name,
  control,
  label,
  helperText,
  optional = false,
  optionalText = "(Optional)",
  render,
}: FormFieldProps<TFormValues>) {
  return (
    <FormFieldRoot
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="gap-0.5 mb-0.5">
              {label} {optional && optionalText}
            </FormLabel>
          )}
          <FormControl>{render(field)}</FormControl>
          {helperText && <FormDescription>{helperText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
