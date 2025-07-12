import { cn } from "@/utils/cn";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type DraggableProps = {
  id: UniqueIdentifier;
  children: React.ReactNode;
};

export function Draggable({ id, children }: DraggableProps) {
  const {
    setNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn({
        "opacity-50": isDragging,
      })}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
