import { useMemo } from "react";
import { Badge, badgeVariants } from "../ui/badge";
import type { VariantProps } from "class-variance-authority";
import { AvatarGroup, type AvatarDef } from "./avatar-group";
import { formatDate } from "@/utils/format-date";

export type ColumnDef = {
  id: string;
  title: string;
};

export type GroupDef<T> = {
  id: string;
  title: string;
  items: T[];
};

export type KanbanProps<T> = {
  columns?: ColumnDef[] | undefined;
  data?: T[] | undefined;
  groupKey: keyof T;
  render: (group: GroupDef<T>, index: number) => React.ReactNode;
};

export function Kanban<T>({
  columns = [],
  data = [],
  groupKey,
  render,
}: KanbanProps<T>) {
  const groups = useMemo(() => {
    const grouped = new Map<string, T[]>();

    for (const item of data) {
      const key = item[groupKey] as string;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    }

    return columns.map((column) => ({
      id: column.id,
      title: column.title,
      items: grouped.get(column.id) ?? [],
    }));
  }, [columns, data, groupKey]);

  return (
    <div className="flex flex-row gap-2 flex-1 overflow-x-auto overflow-y-hidden h-full">
      {groups.map((group, index) => render(group, index))}
    </div>
  );
}

export type KanbanColumnProps<T> = {
  title: string;
  items?: T[];
  actions?: React.ReactNode;
  render: (item: T, index: number) => React.ReactNode;
};

export function KanbanColumn<T>({
  title,
  items = [],
  actions,
  render,
}: KanbanColumnProps<T>) {
  return (
    <div className="w-80 shrink-0 bg-accent rounded flex flex-col h-full">
      <div className="p-2 pb-1 flex flex-row items-center">
        <p className="text-sm font-medium flex-1 flex flex-row gap-2">
          <span>{title}</span>
          <span className="text-muted-foreground">{items.length}</span>
        </p>
        <div className="flex flex-row gap-1">{actions}</div>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 p-2 pt-1 overflow-y-auto">
        {items.map((item, index) => render(item, index))}
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
  id: string;
  title: string;
  dueDate?: Date | undefined | null;
  badges?: BadgeDef[];
  users?: AvatarDef[];
};

export function KanbanCard({
  id,
  title,
  dueDate,
  users,
  badges,
}: KanbanCardProps) {
  return (
    <div className="bg-background border flex flex-col gap-2 p-2 rounded shrink-0">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row gap-2 items-center flex-1">
          {users && <AvatarGroup avatars={users} />}
          <p className="text-sm font-medium text-muted-foreground">{id}</p>
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
