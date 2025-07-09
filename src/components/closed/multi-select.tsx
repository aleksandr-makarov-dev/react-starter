"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

export type MultiSelectProps = {
  placeholder: string;
  label: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: SelectOption[];
  className?: string;
};

export function MultiSelect({
  placeholder,
  label,
  value = [],
  options = [],
  className,
  onChange,
}: MultiSelectProps) {
  const activeOptions = React.useMemo(
    () => options.filter((option) => value?.includes(option.value)),
    [value, options]
  );

  function handleCheckChange(checkedValue: string, checked: boolean) {
    onChange?.(
      checked
        ? [...value, checkedValue]
        : value?.filter((option) => option !== checkedValue)
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("justify-between w-[200px]", className)}
          variant="soft"
          color="gray"
        >
          <span className="truncate">
            {activeOptions && activeOptions.length > 0
              ? activeOptions.map((option) => option.label).join(", ")
              : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="start">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            onSelect={(e) => e.preventDefault()}
            key={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) =>
              handleCheckChange(option.value, checked)
            }
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
