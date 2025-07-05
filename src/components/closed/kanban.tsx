import { useMemo, type HTMLAttributes, type Ref } from "react";
import {
  KanbanColumnContent,
  KanbanColumnHeader,
  KanbanColumnRoot,
  KanbanRoot,
} from "../ui/kanban";
import { cn } from "@/lib/utils";

export type GroupDef<T> = {
  id: string;
  title: string;
  items: T[];
};

export type ColumnDef = {
  id: string;
  title: string;
};

export type KanbanProps<T> = {
  columns: ColumnDef[];
  data?: T[];
  groupKey: keyof T;
  render: (item: GroupDef<T>, index: number) => React.ReactNode;
  ref?: Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

export function Kanban<T>({
  columns,
  data = [],
  className,
  groupKey,
  render,
  ...props
}: KanbanProps<T>) {
  const groups: GroupDef<T>[] = useMemo(
    () =>
      columns.map((column) => ({
        id: column.id,
        title: column.title,
        items: data.filter((item) => item[groupKey] === column.id),
      })),
    [columns, data]
  );

  return (
    <KanbanRoot className={cn(className)} {...props}>
      {groups.map((group, index) => render(group, index))}
    </KanbanRoot>
  );
}

export type KanbanColumnProps<T> = {
  id: string | number;
  items: T[];
  header?: React.ReactNode;
  actions?: React.ReactNode;
  render: (item: T, index: number) => React.ReactNode;
  ref?: Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

export function KanbanColumn<T>({
  id,
  items,
  header,
  actions,
  render,
  ...props
}: KanbanColumnProps<T>) {
  return (
    <KanbanColumnRoot className="w-80" {...props}>
      <KanbanColumnHeader className="flex flex-row items-center">
        <div className="flex-1">{header}</div>
        <div className="flex flex-row gap-1">{actions}</div>
      </KanbanColumnHeader>
      <KanbanColumnContent>
        {items.map((item, index) => render(item, index))}
      </KanbanColumnContent>
    </KanbanColumnRoot>
  );
}
