import { useDroppable } from "@dnd-kit/core";

export type DroppableProps = {
  id: string;
  children: (args: {
    setNodeRef: (element: HTMLElement | null) => void;
    isOver: boolean;
  }) => React.ReactNode;
};

export function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({ id: id });

  return children({ setNodeRef, isOver });
}
