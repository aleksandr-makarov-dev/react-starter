import { Badge, badgeVariants } from "./badge";
import type { VariantProps } from "class-variance-authority";
import { AvatarGroup, type AvatarDef } from "../closed/avatar-group";
import { formatDate } from "@/utils/format-date";
import type { HtmlHTMLAttributes, Ref } from "react";
import { cn } from "@/utils/cn";

export type KanbanProps = {
  children: React.ReactNode;
};

export function Kanban({ children }: KanbanProps) {
  return (
    <div className="flex flex-row gap-2 flex-1 overflow-x-auto overflow-y-hidden h-full relative">
      {children}
    </div>
  );
}

export type KanbanColumnProps = {
  header?: React.ReactNode;
  children?: React.ReactNode;
  ref?: Ref<HTMLDivElement>;
} & HtmlHTMLAttributes<HTMLDivElement>;

export function KanbanColumn({
  header,
  children,
  className,
  ...props
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "w-80 shrink-0 bg-accent rounded flex flex-col h-full",
        className
      )}
      {...props}
    >
      <div className="p-2 flex flex-row items-center gap-2">{header}</div>
      <div className="flex flex-col gap-1.5 flex-1 p-2 pt-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export type UserDef = {
  image?: string;
  alt?: string;
  fallback?: string;
};

export type BadgeDef = {
  label: string;
  color: VariantProps<typeof badgeVariants>["color"];
};

export type KanbanCardProps = {
  title: string;
  dueDate?: Date | undefined | null;
  badges?: BadgeDef[];
  users?: AvatarDef[];
  ref?: Ref<HTMLDivElement>;
} & HtmlHTMLAttributes<HTMLDivElement>;

export function KanbanCard({
  title,
  dueDate,
  users,
  badges,
  className,
  ...props
}: KanbanCardProps) {
  return (
    <div
      className={cn(
        "bg-background border flex flex-col gap-2 p-2 rounded shrink-0",
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row gap-2 items-center flex-1">
          {users && <AvatarGroup avatars={users} limit={3} />}
        </div>
        {dueDate && (
          <Badge variant="soft" color="gray">
            {formatDate(dueDate)}
          </Badge>
        )}
      </div>
      <div>
        <p className="text-sm break-words">{title}</p>
      </div>
      {badges && (
        <div className="flex flex-row gap-1 flex-wrap">
          {badges.map((badge) => (
            <Badge
              key={badge.label}
              variant="soft"
              color={badge.color ?? "gray"}
            >
              {badge.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
