/* eslint-disable @typescript-eslint/no-explicit-any */
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
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { KanbanCard, KanbanColumn, KanbanRoot } from "../ui/kanban";
import { createPortal, unstable_batchedUpdates } from "react-dom";
import { Droppable } from "./droppable";
import { Draggable } from "./draggable";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { EllipsisVerticalIcon, GripVerticalIcon, PlusIcon } from "lucide-react";

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

export const TRASH_ID = "void";
const PLACEHOLDER_ID = "placeholder";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export type KanbanProps = {
  children: (args: { groups: Items }) => React.ReactNode;
};

export function Kanban() {
  const [items, setItems] = useState<Items>({
    A: createRange(3, (index) => `A${index + 1}`),
    B: createRange(5, (index) => `B${index + 1}`),
    C: createRange(6, (index) => `C${index + 1}`),
    D: createRange(10, (index) => `D${index + 1}`),
  });

  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[]
  );

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
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
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );

  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    setClonedItems(items);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    const overId = over?.id;

    if (overId == null || overId === TRASH_ID || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer];
        const overItems = items[overContainer];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);

        let newIndex: number;

        if (overId in items) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        recentlyMovedToNewContainer.current = true;

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length
            ),
          ],
        };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id in items && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);

        return arrayMove(containers, activeIndex, overIndex);
      });
    }

    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    if (overId === TRASH_ID) {
      setItems((items) => ({
        ...items,
        [activeContainer]: items[activeContainer].filter(
          (id) => id !== activeId
        ),
      }));
      setActiveId(null);
      return;
    }

    if (overId === PLACEHOLDER_ID) {
      const newContainerId = getNextContainerId();

      unstable_batchedUpdates(() => {
        setContainers((containers) => [...containers, newContainerId]);
        setItems((items) => ({
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (id) => id !== activeId
          ),
          [newContainerId]: [active.id],
        }));
        setActiveId(null);
      });
      return;
    }

    const overContainer = findContainer(overId);

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(overId);

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    setActiveId(null);
  };

  function getNextContainerId() {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={onDragCancel}
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
                  const containerItems = items[containerId];
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
                                <p className="text-sm font-medium flex-1 flex flex-row gap-2">
                                  <span>Контейнер {containerId}</span>
                                  <span className="text-muted-foreground">
                                    {count}
                                  </span>
                                </p>
                                <div className="flex flex-row gap-1 items-center">
                                  <Button
                                    variant="soft"
                                    color="gray"
                                    size="icon"
                                  >
                                    <PlusIcon />
                                  </Button>
                                  <Button
                                    variant="soft"
                                    color="gray"
                                    size="icon"
                                  >
                                    <EllipsisVerticalIcon />
                                  </Button>
                                </div>
                              </React.Fragment>
                            }
                          >
                            <SortableContext
                              items={containerItems}
                              strategy={verticalListSortingStrategy}
                            >
                              {containerItems.map((value) => (
                                <Draggable key={value} id={value}>
                                  {({
                                    setNodeRef,
                                    attributes,
                                    isDragging,
                                    listeners,
                                    style,
                                  }) => (
                                    <KanbanCard
                                      ref={setNodeRef}
                                      id={value.toString()}
                                      style={style}
                                      className={cn({
                                        "opacity-50": isDragging,
                                      })}
                                      title={`Задача ${value}`}
                                      {...attributes}
                                      {...listeners}
                                    />
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
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            containers.includes(activeId) ? (
              <KanbanColumn
                id={activeId.toString()}
                className="ring-2 ring-offset-1 ring-primary cursor-grabbing"
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
                    <p className="text-sm font-medium flex-1 flex flex-row gap-2">
                      <span>Контейнер {activeId}</span>
                      <span className="text-muted-foreground">
                        {items[activeId]?.length}
                      </span>
                    </p>
                    <div className="flex flex-row gap-1 items-center">
                      <Button variant="soft" color="gray" size="icon">
                        <PlusIcon />
                      </Button>
                      <Button variant="soft" color="gray" size="icon">
                        <EllipsisVerticalIcon />
                      </Button>
                    </div>
                  </React.Fragment>
                }
              >
                {items[activeId].map((value) => (
                  <KanbanCard
                    key={value}
                    id={value.toString()}
                    title={`Задача ${value}`}
                  />
                ))}
              </KanbanColumn>
            ) : (
              <KanbanCard
                id={activeId.toString()}
                className="ring-2 ring-offset-1 ring-primary cursor-grabbing"
                title={`Задача ${activeId}`}
              />
            )
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

// HELPERS

const defaultInitializer = (index: number) => index;

function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

//

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
