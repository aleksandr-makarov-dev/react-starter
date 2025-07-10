"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/utils/cn";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  placeholder: string;
  label: string;
  value?: string;
  options?: SelectOption[];
  className?: string;
  onChange?: (value: string) => void;
};

export function Select({
  placeholder,
  label,
  value,
  options = [],
  className,
  onChange,
}: SelectProps) {
  const activeOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [value, options]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("justify-between w-[200px]", className)}
          variant="soft"
          color="gray"
        >
          {activeOption ? activeOption.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="start">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
