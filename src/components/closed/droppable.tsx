import { useDroppable } from "@dnd-kit/core";

export type DroppableProps = {
  id: string;
  children: React.ReactNode;
};

export function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id: id });

  return <div ref={setNodeRef}>{children}</div>;
}
