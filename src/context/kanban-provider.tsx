import {
  type UniqueIdentifier,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  DndContext,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type KanbanItemBase = { id: string; columnId: string };

type KanbanContextType<T extends KanbanItemBase> = {
  groups: { [key: string]: T[] };
  activeItem: T | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KanbanContext = createContext<KanbanContextType<any> | null>(null);

export type KanbanProviderProps<T extends KanbanItemBase> = {
  columns: string[];
  data: T[];
  children: React.ReactNode;
};

export function KanbanProvider<T extends KanbanItemBase>({
  columns = [],
  data = [],
  children,
}: KanbanProviderProps<T>) {
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
    const grouped = columns.reduce((acc, columnId) => {
      acc[columnId] = data.filter((item) => item.columnId === columnId);
      return acc;
    }, {} as Record<string, T[]>);

    setGroups(grouped);
  }, [columns, data]);

  const findContainer = (id: UniqueIdentifier) => {
    if (id in groups) {
      return id;
    }
    return Object.keys(groups).find((key: string) =>
      groups[key].map((item) => item.id).includes(id.toString())
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

      const activeIndex = activeItems.map((items) => items.id).indexOf(id);
      const overIndex = overItems
        .map((items) => items.id)
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
          ...prev[activeContainer].filter((items) => items.id !== active.id),
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
      .map((item) => item.id)
      .indexOf(id);
    const overIndex = groups[overContainer]
      .map((item) => item.id)
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
    return list.find((item) => item.id === activeId) || null;
  }, [activeId, groups]);

  return (
    <KanbanContext.Provider value={{ groups: groups, activeItem: activeItem }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </KanbanContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useKanban<T extends KanbanItemBase>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = useContext<KanbanContextType<any> | null>(KanbanContext);

  if (!context) {
    throw new Error("useKanban must be used within a KanbanContext");
  }

  return context as KanbanContextType<T>;
}
