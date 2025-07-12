import {
  type UniqueIdentifier,
  useSensors,
  useSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  closestCorners,
  DndContext,
  type CollisionDetection,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  MouseSensor,
  TouchSensor,
  type DroppableContainer,
  type KeyboardCoordinateGetter,
  KeyboardCode,
  MeasuringStrategy,
  DragOverlay,
  type DropAnimation,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useMemo, useState, useRef, useCallback } from "react";
import { KanbanColumn, Kanban as KanbanRoot } from "../ui/kanban";
import { createPortal } from "react-dom";
import { Droppable } from "./droppable";
import { Draggable } from "./draggable";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { GripVerticalIcon } from "lucide-react";

export const TRASH_ID = "void";
const PLACEHOLDER_ID = "placeholder";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.5" } },
  }),
};

export type KanbanProps<
  T extends { id: UniqueIdentifier },
  U extends { id: UniqueIdentifier; columnId: UniqueIdentifier }
> = {
  columns: T[];
  data: U[];
  renderColumnHeader: (column: T & { count: number }) => React.ReactNode;
  renderItem: (item: U) => React.ReactNode;
  onItemDropEnd?: (args: {
    itemId: UniqueIdentifier;
    columnId: UniqueIdentifier;
    index: number;
  }) => void;
  onColumnDropEnd?: (args: {
    columnId: UniqueIdentifier;
    index: number;
  }) => void;
};

export function Kanban<
  T extends { id: UniqueIdentifier },
  U extends { id: UniqueIdentifier; columnId: UniqueIdentifier }
>({
  columns,
  data,
  renderColumnHeader,
  renderItem,
  onColumnDropEnd,
  onItemDropEnd,
}: KanbanProps<T, U>) {
  const initialItems = useMemo(() => {
    return columns.reduce((acc, col) => {
      acc[col.id] = data.filter((item) => item.columnId === col.id);
      return acc;
    }, {} as Record<UniqueIdentifier, U[]>);
  }, [columns, data]);

  const [items, setItems] =
    useState<Record<UniqueIdentifier, U[]>>(initialItems);
  const [containers, setContainers] = useState<UniqueIdentifier[]>(
    columns.map((col) => col.id)
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const [clonedItems, setClonedItems] = useState<Record<
    UniqueIdentifier,
    U[]
  > | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  const allItemsFlat = useMemo(() => Object.values(items).flat(), [items]);

  const findContainer = (
    id: UniqueIdentifier
  ): UniqueIdentifier | undefined => {
    if (id in items) return id;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(items).find(([_, list]) =>
      list.some((item) => item.id === id)
    )?.[0];
  };

  const getNextContainerId = (): string => {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];
    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  };

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id);
    setClonedItems(items);
  };

  const handleDragCancel = (): void => {
    if (clonedItems) setItems(clonedItems);
    setActiveId(null);
    setClonedItems(null);
  };

  const handleDragOver = (event: DragOverEvent): void => {
    const { active, over } = event;
    const overId = over?.id;
    if (!overId || overId === TRASH_ID || active.id in items) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    const activeIndex = items[activeContainer].findIndex(
      (i) => i.id === active.id
    );
    if (activeIndex === -1) return;

    const overIndex = items[overContainer].findIndex((i) => i.id === overId);
    const isBelow =
      active.rect.current?.translated?.top && over?.rect
        ? active.rect.current.translated.top > over.rect.top + over.rect.height
        : false;

    const newIndex =
      overIndex >= 0
        ? overIndex + (isBelow ? 1 : 0)
        : items[overContainer].length;
    recentlyMovedToNewContainer.current = true;

    setItems((prev): Record<UniqueIdentifier, U[]> => {
      const activeItem = prev[activeContainer][activeIndex];
      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter(
          (item) => item.id !== active.id
        ),
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          activeItem,
          ...prev[overContainer].slice(newIndex),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    const isContainer = active.id in items;

    if (isContainer && over?.id) {
      const activeIndex = containers.indexOf(active.id);
      const overIndex = containers.indexOf(over.id);

      if (activeIndex !== overIndex) {
        onColumnDropEnd?.({ columnId: String(active.id), index: overIndex });
        setContainers(arrayMove(containers, activeIndex, overIndex));
      }
    }

    if (!isContainer) {
      const activeContainer = findContainer(active.id);
      if (!activeContainer) return setActiveId(null);

      const overId = over?.id;
      if (!overId) return setActiveId(null);

      if (overId === TRASH_ID) {
        setItems((prev) => ({
          ...prev,
          [activeContainer]: prev[activeContainer].filter(
            (item) => item.id !== active.id
          ),
        }));
        setActiveId(null);
        return;
      }

      if (overId === PLACEHOLDER_ID) {
        const newContainerId = getNextContainerId();
        const movedItem = items[activeContainer].find(
          (item) => item.id === active.id
        );
        if (!movedItem) return;

        setContainers((prev) => [...prev, newContainerId]);
        setItems((prev) => ({
          ...prev,
          [activeContainer]: prev[activeContainer].filter(
            (item) => item.id !== active.id
          ),
          [newContainerId]: [movedItem],
        }));
        setActiveId(null);
        return;
      }

      const overContainer = findContainer(overId);
      if (overContainer) {
        const activeIndex = items[activeContainer].findIndex(
          (item) => item.id === active.id
        );
        const overIndex = items[overContainer].findIndex(
          (item) => item.id === overId
        );
        if (activeIndex !== overIndex) {
          setItems((prev) => ({
            ...prev,
            [overContainer]: arrayMove(
              prev[overContainer],
              activeIndex,
              overIndex
            ),
          }));
        }

        onItemDropEnd?.({
          itemId: active.id.toString(),
          columnId: overContainer,
          index: overIndex,
        });
      }
    }

    setActiveId(null);
  };

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections;
        }

        if (overId in items) {
          const containerItems = items[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.map((item) => item.id).includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the overId may become null. We manually set the cached lastOverId
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous overId will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );

  const activeItem:
    | { type: "column"; column: T; items: U[] }
    | { type: "item"; item: U }
    | undefined = useMemo(() => {
    if (!activeId) return undefined;

    if (containers.includes(activeId)) {
      const column = columns.find((col) => col.id === activeId);
      if (!column) return undefined;

      const itemsInColumn = items[activeId] ?? [];
      return {
        type: "column",
        column,
        items: itemsInColumn,
      };
    }

    const item = allItemsFlat.find((item) => item.id === activeId);
    return item ? { type: "item", item } : undefined;
  }, [activeId, columns, containers, items, allItemsFlat]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.BeforeDragging } }}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <KanbanRoot>
        {
          <SortableContext
            items={[...containers, PLACEHOLDER_ID]}
            strategy={horizontalListSortingStrategy}
          >
            {containers.map((containerId) => (
              <Draggable key={containerId} id={containerId}>
                {({
                  setNodeRef,
                  attributes,
                  isDragging,
                  listeners,
                  style,
                  setActivatorNodeRef,
                }) => {
                  const column = columns.find(
                    (column) => column.id === containerId
                  );

                  if (!column) return null;

                  const containerItems = items[containerId] ?? [];
                  const count = containerItems.length;

                  return (
                    <div
                      ref={setNodeRef}
                      style={style}
                      className={cn({ "opacity-50": isDragging })}
                      {...attributes}
                    >
                      <Droppable id={containerId}>
                        {({ setNodeRef }) => (
                          <KanbanColumn
                            ref={setNodeRef}
                            id={containerId.toString()}
                            header={
                              <React.Fragment>
                                <Button
                                  ref={setActivatorNodeRef}
                                  className="hover:cursor-grab"
                                  variant="soft"
                                  color="gray"
                                  size="icon"
                                  {...listeners}
                                >
                                  <GripVerticalIcon />
                                </Button>
                                {renderColumnHeader({
                                  ...column,
                                  count: count,
                                })}
                              </React.Fragment>
                            }
                          >
                            <SortableContext
                              items={containerItems}
                              strategy={verticalListSortingStrategy}
                            >
                              {containerItems.map((item) => (
                                <Draggable key={item.id} id={item.id}>
                                  {({
                                    setNodeRef,
                                    attributes,
                                    isDragging,
                                    listeners,
                                    style,
                                  }) => (
                                    <div
                                      ref={setNodeRef}
                                      style={style}
                                      className={cn({
                                        "opacity-50": isDragging,
                                      })}
                                      {...attributes}
                                      {...listeners}
                                    >
                                      {renderItem(item)}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </SortableContext>
                          </KanbanColumn>
                        )}
                      </Droppable>
                    </div>
                  );
                }}
              </Draggable>
            ))}
          </SortableContext>
        }
      </KanbanRoot>

      {activeItem &&
        createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeItem?.type === "column" ? (
              <KanbanColumn
                className="ring-primary ring-2 ring-offset-1 cursor-grabbing"
                header={
                  <React.Fragment>
                    <Button
                      className="hover:cursor-grabbing"
                      variant="soft"
                      color="gray"
                      size="icon"
                    >
                      <GripVerticalIcon />
                    </Button>
                    {renderColumnHeader({
                      ...activeItem.column,
                      count: activeItem.items.length,
                    })}
                  </React.Fragment>
                }
              >
                {activeItem.items.map((item) => renderItem(item))}
              </KanbanColumn>
            ) : activeItem?.type === "item" ? (
              <div className="ring-primary ring-2 ring-offset-2 cursor-grabbing rounded">
                {renderItem(activeItem.item)}
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

const directions: string[] = [
  KeyboardCode.Down,
  KeyboardCode.Right,
  KeyboardCode.Up,
  KeyboardCode.Left,
];

const coordinateGetter: KeyboardCoordinateGetter = (
  event,
  { context: { active, droppableRects, droppableContainers, collisionRect } }
) => {
  if (directions.includes(event.code)) {
    event.preventDefault();

    if (!active || !collisionRect) {
      return;
    }

    const filteredContainers: DroppableContainer[] = [];

    droppableContainers.getEnabled().forEach((entry) => {
      if (!entry || entry?.disabled) {
        return;
      }

      const rect = droppableRects.get(entry.id);

      if (!rect) {
        return;
      }

      const data = entry.data.current;

      if (data) {
        const { type, children } = data;

        if (type === "container" && children?.length > 0) {
          if (active.data.current?.type !== "container") {
            return;
          }
        }
      }

      switch (event.code) {
        case KeyboardCode.Down:
          if (collisionRect.top < rect.top) {
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Up:
          if (collisionRect.top > rect.top) {
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Left:
          if (collisionRect.left >= rect.left + rect.width) {
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Right:
          if (collisionRect.left + collisionRect.width <= rect.left) {
            filteredContainers.push(entry);
          }
          break;
      }
    });

    const collisions = closestCorners({
      active,
      collisionRect: collisionRect,
      droppableRects,
      droppableContainers: filteredContainers,
      pointerCoordinates: null,
    });
    const closestId = getFirstCollision(collisions, "id");

    if (closestId != null) {
      const newDroppable = droppableContainers.get(closestId);
      const newNode = newDroppable?.node.current;
      const newRect = newDroppable?.rect.current;

      if (newNode && newRect) {
        if (newDroppable.id === "placeholder") {
          return {
            x: newRect.left + (newRect.width - collisionRect.width) / 2,
            y: newRect.top + (newRect.height - collisionRect.height) / 2,
          };
        }

        if (newDroppable.data.current?.type === "container") {
          return {
            x: newRect.left + 20,
            y: newRect.top + 74,
          };
        }

        return {
          x: newRect.left,
          y: newRect.top,
        };
      }
    }
  }

  return undefined;
};
