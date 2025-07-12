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
import { Kanban } from "@/components/closed/kanban";
import { EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import { KanbanCard, type BadgeDef } from "@/components/ui/kanban";
import dayjs from "dayjs";

const badges: BadgeDef[] = [
  { label: "Фронтенд", color: "blue" },
  { label: "Бэкенд", color: "green" },
  { label: "10 Файлов", color: "gray" },
  { label: "5 Сообщений", color: "gray" },
  { label: "10 Подзадач", color: "gray" },
];

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
        renderColumnHeader={({ id, title, count }) => (
          <React.Fragment>
            <p className="text-sm font-medium flex-1 flex flex-row gap-2">
              <span>{title}</span>
              <span className="text-muted-foreground">{count}</span>
            </p>
            <div className="flex flex-row gap-1 items-center">
              <Button
                variant="soft"
                color="gray"
                size="icon"
                onClick={() => handleOpenDialog(id.toString())}
              >
                <PlusIcon />
              </Button>
              <Button variant="soft" color="gray" size="icon">
                <EllipsisVerticalIcon />
              </Button>
            </div>
          </React.Fragment>
        )}
        renderItem={({ id, title }) => (
          <KanbanCard
            id={id.toString()}
            title={title}
            dueDate={dayjs().toDate()}
            users={[
              { fallback: "AN" },
              { fallback: "BN" },
              { fallback: "CN" },
              { fallback: "DN" },
            ]}
            badges={badges}
          />
        )}
        onColumnDropEnd={({ columnId, index }) =>
          console.log(`Список=${columnId}; Индекс=${index}`)
        }
        onItemDropEnd={({ columnId, index, itemId }) =>
          console.log(`Элемент=${itemId}; Список=${columnId}; Индекс=${index}`)
        }
      />
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
