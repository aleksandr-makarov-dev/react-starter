import React from "react";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (newValue: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function Select({
  id,
  name,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
}: SelectProps) {
  const renderedOptions = React.useMemo(
    () =>
      options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      )),
    [options]
  );

  return (
    <SelectRoot
      name={name}
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        className={cn("w-[180px]", className)}
        aria-label={placeholder}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{renderedOptions}</SelectContent>
    </SelectRoot>
  );
}

export function createOptions(options: SelectOption[]) {
  return options;
}
