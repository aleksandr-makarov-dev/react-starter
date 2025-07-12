import { FormField } from "@/components/closed/form-field";
import { Form } from "@/components/closed/form";
import { FormDialog } from "@/components/closed/form-dialog";
import { MultiSelect } from "@/components/closed/multi-select";
import { Select } from "@/components/closed/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/hooks/use-dialog";
import React from "react";
import { useTranslation } from "react-i18next";
import z from "zod";
import { MOCK_COLUMNS, MOCK_ITEMS } from "@/data";
import { KanbanCard, KanbanColumn } from "@/components/ui/kanban";
import { DragOverlay } from "@dnd-kit/core";
import { Droppable } from "@/components/closed/droppable";
import { Draggable } from "@/components/closed/draggable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Kanban } from "@/components/closed/kanban";
import { cn } from "@/utils/cn";

function LandingPage() {
  const { t } = useTranslation("App");

  const dialog = useDialog<{ listId: string }>();

  //

  function handleFormSubmit(value: z.infer<typeof schema>) {
    console.log("Form value:", value);
  }

  function handleOpenDialog(listId: string) {
    dialog.open({ listId: listId });
  }

  return (
    <div className="h-screen flex flex-1 p-2">
      <Kanban
        columns={MOCK_COLUMNS}
        data={MOCK_ITEMS}
        getId={(item) => item.id}
        getColumnId={(item) => item.columnId}
      >
        {({ columns, groups, activeItem }) => (
          <React.Fragment>
            {columns.map((column) => {
              const items = groups[column.id] ?? [];

              return (
                <Droppable id={column.id}>
                  {({ setNodeRef }) => (
                    <KanbanColumn
                      key={column.id}
                      ref={setNodeRef}
                      title={column.title}
                      count={items.length}
                    >
                      <SortableContext
                        items={items.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {items.map((item) => (
                          <Draggable id={item.id}>
                            {({
                              setNodeRef,
                              attributes,
                              listeners,
                              style,
                              isDragging,
                            }) => (
                              <KanbanCard
                                ref={setNodeRef}
                                style={style}
                                className={cn({ "opacity-50": isDragging })}
                                id={item.id}
                                title={item.title}
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
              );
            })}
            <DragOverlay>
              {activeItem && (
                <div className="ring-primary ring-2 ring-offset-1 rounded cursor-grab">
                  <KanbanCard id={activeItem.id} title={activeItem.title} />
                </div>
              )}
            </DragOverlay>
          </React.Fragment>
        )}
      </Kanban>
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
                    options={MOCK_COLUMNS.map((column) => ({
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

const schema = z.object({
  name: z.string().min(1).max(50),
  listId: z.string().min(1),
  labels: z.array(z.string()),
});

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
