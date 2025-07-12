import {
  type UniqueIdentifier,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  closestCorners,
  DndContext,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { KanbanRoot } from "../ui/kanban";

export type ColumnDef = {
  id: string;
  title: string;
};

export type KanbanProps<T> = {
  columns: ColumnDef[];
  data: T[];
  getId: (item: T) => string;
  getColumnId: (item: T) => string;
  children: (args: {
    columns: ColumnDef[];
    groups: { [key: string]: T[] };
    activeItem: T | null;
  }) => React.ReactNode;
};

export function Kanban<T>({
  columns = [],
  data = [],
  getId,
  getColumnId,
  children,
}: KanbanProps<T>) {
  const [groups, setGroups] = useState<{ [key: string]: T[] }>({});

  // DND
  // Source: https://github.com/kodaishiotsuki/dndkit-sample

  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const grouped = columns.reduce((acc, column) => {
      acc[column.id] = data.filter((item) => getColumnId(item) === column.id);
      return acc;
    }, {} as Record<string, T[]>);

    setGroups(grouped);
  }, [columns, data, getColumnId]);

  const findContainer = (id: UniqueIdentifier) => {
    if (id in groups) {
      return id;
    }
    return Object.keys(groups).find((key: string) =>
      groups[key].map((item) => getId(item)).includes(id.toString())
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();

    setActiveId(id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id;

    if (!overId) return;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(over?.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setGroups((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.map((item) => getId(item)).indexOf(id);
      const overIndex = overItems
        .map((item) => getId(item))
        .indexOf(overId.toString());

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastGroup = over && overIndex === overItems.length - 1;

        const modifier = isBelowLastGroup ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => getId(item) !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          groups[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id;

    if (!overId) return;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(over?.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = groups[activeContainer]
      .map((item) => getId(item))
      .indexOf(id);
    const overIndex = groups[overContainer]
      .map((item) => getId(item))
      .indexOf(overId.toString());

    if (activeIndex !== overIndex) {
      setGroups((groups) => ({
        ...groups,
        [overContainer]: arrayMove(
          groups[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }
    setActiveId(undefined);
  };

  const activeItem = useMemo(() => {
    if (!activeId) return null;

    const list = Object.values(groups).flat();
    return list.find((item) => getId(item) === activeId) || null;
  }, [activeId, getId, groups]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <KanbanRoot>{children({ columns, groups, activeItem })}</KanbanRoot>
    </DndContext>
  );
}
