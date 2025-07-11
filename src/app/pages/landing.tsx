import { FormField } from "@/components/closed/form-field";
import { Form } from "@/components/closed/form";
import { FormDialog } from "@/components/closed/form-dialog";
import { KanbanRoot, KanbanCard, KanbanColumn } from "@/components/ui/kanban";
import { MultiSelect } from "@/components/closed/multi-select";
import { Select } from "@/components/closed/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/hooks/use-dialog";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/utils/cn";

function LandingPage() {
  const { t } = useTranslation("App");

  const [columns] = useState<ColumnDef<Item>[]>(MOCK_COLUMNS);

  const [groups, setGroups] = useState<{ [key: string]: Item[] }>(MOCK_GROUPS);

  const dialog = useDialog<{ listId: string }>();

  // DND
  // Source: https://github.com/kodaishiotsuki/dndkit-sample

  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      const activeGroups = prev[activeContainer];
      const overGroups = prev[overContainer];

      const activeIndex = activeGroups.map((group) => group.id).indexOf(id);
      const overIndex = overGroups
        .map((group) => group.id)
        .indexOf(overId.toString());

      let newIndex;
      if (overId in prev) {
        newIndex = overGroups.length + 1;
      } else {
        const isBelowLastGroup = over && overIndex === overGroups.length - 1;

        const modifier = isBelowLastGroup ? 1 : 0;

        newIndex =
          overIndex >= 0 ? overIndex + modifier : overGroups.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((group) => group.id !== active.id),
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
      .map((group) => group.id)
      .indexOf(id);
    const overIndex = groups[overContainer]
      .map((group) => group.id)
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

  //

  function handleFormSubmit(value: z.infer<typeof schema>) {
    console.log("Form value:", value);
  }

  function handleOpenDialog(listId: string) {
    dialog.open({ listId: listId });
  }

  return (
    <div className="h-screen flex flex-1 p-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <KanbanRoot>
          {columns.map((column) => {
            const items = groups[column.id];

            return (
              <Droppable key={column.id} id={column.id}>
                <KanbanColumn
                  title={column.title}
                  count={column.count}
                  actions={
                    <React.Fragment>
                      <Button
                        variant="soft"
                        color="gray"
                        size="icon"
                        onClick={() => handleOpenDialog(column.id)}
                      >
                        <PlusIcon />
                      </Button>
                    </React.Fragment>
                  }
                >
                  <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((item) => (
                      <Draggable key={item.id} id={item.id}>
                        <KanbanCard
                          id={item.id}
                          title={item.title}
                          dueDate={dayjs().add(4, "day").toDate()}
                          badges={[
                            {
                              label: "Бэкенд",
                              color: "blue",
                            },
                            {
                              label: "Фронтенд",
                              color: "green",
                            },
                            {
                              label: "Высокий",
                              color: "orange",
                            },
                            {
                              label: "5 Файлов",
                              color: "gray",
                            },
                            {
                              label: "10 Сообщений",
                              color: "gray",
                            },
                            {
                              label: "2 Подзадачи",
                              color: "gray",
                            },
                          ]}
                          users={[
                            {
                              image: "https://github.com/leerob.png",
                              alt: "@leerob",
                              fallback: "LR",
                            },
                            {
                              image: "https://github.com/evilrabbit.png",
                              alt: "@evilrabbit",
                              fallback: "ER",
                            },
                            {
                              image: "https://github.com/evilrabbit.png",
                              alt: "@evilrabbit",
                              fallback: "ER",
                            },
                          ]}
                        />
                      </Draggable>
                    ))}
                  </SortableContext>
                </KanbanColumn>
              </Droppable>
            );
          })}
        </KanbanRoot>
        <DragOverlay>
          {activeItem ? (
            <div className="cursor-grab ring-2 ring-offset-1 ring-primary rounded">
              <KanbanCard
                id={activeItem.id}
                title={activeItem.title}
                dueDate={dayjs().add(4, "day").toDate()}
                badges={[
                  {
                    label: "Бэкенд",
                    color: "blue",
                  },
                  {
                    label: "Фронтенд",
                    color: "green",
                  },
                  {
                    label: "Высокий",
                    color: "orange",
                  },
                  {
                    label: "5 Файлов",
                    color: "gray",
                  },
                  {
                    label: "10 Сообщений",
                    color: "gray",
                  },
                  {
                    label: "2 Подзадачи",
                    color: "gray",
                  },
                ]}
                users={[
                  {
                    image: "https://github.com/leerob.png",
                    alt: "@leerob",
                    fallback: "LR",
                  },
                  {
                    image: "https://github.com/evilrabbit.png",
                    alt: "@evilrabbit",
                    fallback: "ER",
                  },
                  {
                    image: "https://github.com/evilrabbit.png",
                    alt: "@evilrabbit",
                    fallback: "ER",
                  },
                ]}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <FormDialog
        title="Создание объекта"
        description="Создание объекта очень трудоемкая операция."
        open={dialog.state.isOpen}
        onOpenChange={() => dialog.close()}
        submitButton={
          <Button type="submit" form="create-form">
            {t("add_action")}
          </Button>
        }
        cancelButtonLabel="Отмена"
      >
        <Form
          id="create-form"
          schema={schema}
          onSubmit={handleFormSubmit}
          options={{
            defaultValues: {
              name: "",
              listId: dialog.state.data?.listId,
            },
          }}
        >
          {({ control }) => (
            <React.Fragment>
              <FormField
                control={control}
                name="name"
                label="Название"
                render={(field) => <Input {...field} />}
              />
              <FormField
                control={control}
                name="listId"
                label="Список"
                render={(field) => (
                  <Select
                    className="w-full"
                    placeholder="Выберите список"
                    label="Доступные списки"
                    options={columns.map((column) => ({
                      label: column.title,
                      value: column.id,
                    }))}
                    {...field}
                  />
                )}
              />
              <FormField
                control={control}
                name="labels"
                label="Метки"
                render={(field) => (
                  <MultiSelect
                    className="w-full"
                    placeholder="Выберите метки"
                    label="Доступные метки"
                    options={frameworks}
                    {...field}
                  />
                )}
              />
            </React.Fragment>
          )}
        </Form>
      </FormDialog>
    </div>
  );
}

type DroppableProps = {
  id: string;
  children: React.ReactNode;
};

export function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id: id });

  return <div ref={setNodeRef}>{children}</div>;
}

type DraggableProps = {
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

//

const schema = z.object({
  name: z.string().min(1).max(50),
  listId: z.string().min(1),
  labels: z.array(z.string()),
});

type ColumnDef<T> = {
  id: string;
  title: string;
  count: number;
  items: T[];
};

type Item = { id: string; title: string; listId: string };

const MOCK_GROUPS: { [key: string]: Item[] } = {
  "column-1": [
    { id: "task-1", title: "Создать шаблон проекта", listId: "column-1" },
    {
      id: "task-2",
      title: "Собрать требования от клиента",
      listId: "column-1",
    },
    {
      id: "task-3",
      title: "Проанализировать конкурентов",
      listId: "column-1",
    },
  ],
  "column-2": [
    { id: "task-4", title: "Реализовать авторизацию", listId: "column-2" },
    { id: "task-5", title: "Настроить роутинг", listId: "column-2" },
    { id: "task-6", title: "Сверстать главную страницу", listId: "column-2" },
    { id: "task-7", title: "Подключить API новостей", listId: "column-2" },
    {
      id: "task-8",
      title: "Разработать компонент фильтра",
      listId: "column-2",
    },
  ],
  "column-3": [
    { id: "task-9", title: "Получить доступ к Figma", listId: "column-3" },
    {
      id: "task-10",
      title: "Уточнить формат данных от backend",
      listId: "column-3",
    },
  ],
  "column-4": [
    {
      id: "task-11",
      title: "Код ревью компонента карточки товара",
      listId: "column-4",
    },
  ],
  "column-5": [
    {
      id: "task-12",
      title: "Тест: регистрация нового пользователя",
      listId: "column-5",
    },
    {
      id: "task-13",
      title: "Тест: переключение темной темы",
      listId: "column-5",
    },
    {
      id: "task-14",
      title: "Тест: фильтрация по категориям",
      listId: "column-5",
    },
    { id: "task-15", title: "Тест: responsive в Safari", listId: "column-5" },
  ],
};

const MOCK_COLUMNS: ColumnDef<Item>[] = [
  {
    id: "column-1",
    title: "Открыт",
    count: 3,
    items: [
      { id: "task-1", title: "Создать шаблон проекта", listId: "column-1" },
      {
        id: "task-2",
        title: "Собрать требования от клиента",
        listId: "column-1",
      },
      {
        id: "task-3",
        title: "Проанализировать конкурентов",
        listId: "column-1",
      },
    ],
  },
  {
    id: "column-2",
    title: "В работе",
    count: 5,
    items: [
      { id: "task-4", title: "Реализовать авторизацию", listId: "column-2" },
      { id: "task-5", title: "Настроить роутинг", listId: "column-2" },
      { id: "task-6", title: "Сверстать главную страницу", listId: "column-2" },
      { id: "task-7", title: "Подключить API новостей", listId: "column-2" },
      {
        id: "task-8",
        title: "Разработать компонент фильтра",
        listId: "column-2",
      },
    ],
  },
  {
    id: "column-3",
    title: "Требуется информация",
    count: 2,
    items: [
      { id: "task-9", title: "Получить доступ к Figma", listId: "column-3" },
      {
        id: "task-10",
        title: "Уточнить формат данных от backend",
        listId: "column-3",
      },
    ],
  },
  {
    id: "column-4",
    title: "Ревью",
    count: 1,
    items: [
      {
        id: "task-11",
        title: "Код ревью компонента карточки товара",
        listId: "column-4",
      },
    ],
  },
  {
    id: "column-5",
    title: "Можно тестировать",
    count: 4,
    items: [
      {
        id: "task-12",
        title: "Тест: регистрация нового пользователя",
        listId: "column-5",
      },
      {
        id: "task-13",
        title: "Тест: переключение темной темы",
        listId: "column-5",
      },
      {
        id: "task-14",
        title: "Тест: фильтрация по категориям",
        listId: "column-5",
      },
      { id: "task-15", title: "Тест: responsive в Safari", listId: "column-5" },
    ],
  },
];

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default LandingPage;
