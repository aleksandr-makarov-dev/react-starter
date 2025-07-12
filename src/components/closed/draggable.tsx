import type { DraggableAttributes, UniqueIdentifier } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";

export type DraggableProps = {
  id: UniqueIdentifier;
  children: (args: {
    setNodeRef: (node: HTMLElement | null) => void;
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
    style: CSSProperties | undefined;
    isDragging: boolean;
  }) => React.ReactNode;
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

  return children({ setNodeRef, attributes, listeners, style, isDragging });
}
