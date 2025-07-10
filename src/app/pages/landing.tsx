import { FormField } from "@/components/closed/form-field";
import { Form } from "@/components/closed/form";
import { FormDialog } from "@/components/closed/form-dialog";
import {
  Kanban,
  KanbanCard,
  KanbanColumn,
  type ColumnDef,
} from "@/components/closed/kanban";
import { MultiSelect } from "@/components/closed/multi-select";
import { Select } from "@/components/closed/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/hooks/use-dialog";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

function LandingPage() {
  const { t } = useTranslation("App");

  const dialog = useDialog<{ listId: string }>();

  function handleFormSubmit(value: z.infer<typeof schema>) {
    console.log("Form value:", value);
  }

  function handleOpenDialog(listId: string) {
    dialog.open({ listId: listId });
  }

  return (
    <div className="h-screen flex flex-1 p-2">
      <Kanban
        columns={columns}
        data={data}
        groupKey="listId"
        render={(group) => (
          <KanbanColumn
            key={group.id}
            title={group.title}
            items={group.items}
            render={(item) => (
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
            )}
            actions={
              <React.Fragment>
                <Button
                  variant="soft"
                  color="gray"
                  size="icon"
                  onClick={() => handleOpenDialog(group.id)}
                >
                  <PlusIcon />
                </Button>
              </React.Fragment>
            }
          />
        )}
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

const schema = z.object({
  name: z.string().min(1).max(50),
  listId: z.string().min(1),
  labels: z.array(z.string()),
});

const columns: ColumnDef[] = [
  {
    id: "column-1",
    title: "Открыт",
  },
  {
    id: "column-2",
    title: "В работе",
  },
  {
    id: "column-3",
    title: "Требуется информация",
  },
  {
    id: "column-4",
    title: "Ревью",
  },
  {
    id: "column-5",
    title: "Можно тестировать",
  },
];

const data: { id: string; title: string; listId: string }[] = [
  // column-1: Открыт (3 задачи)
  { id: "task-1", title: "Создать шаблон проекта", listId: "column-1" },
  { id: "task-2", title: "Собрать требования от клиента", listId: "column-1" },
  { id: "task-3", title: "Проанализировать конкурентов", listId: "column-1" },

  // column-2: В работе (5 задач)
  { id: "task-4", title: "Реализовать авторизацию", listId: "column-2" },
  { id: "task-5", title: "Настроить роутинг", listId: "column-2" },
  { id: "task-6", title: "Сверстать главную страницу", listId: "column-2" },
  { id: "task-7", title: "Подключить API новостей", listId: "column-2" },
  { id: "task-8", title: "Разработать компонент фильтра", listId: "column-2" },

  // column-3: Требуется информация (2 задачи)
  { id: "task-9", title: "Получить доступ к Figma", listId: "column-3" },
  {
    id: "task-10",
    title: "Уточнить формат данных от backend",
    listId: "column-3",
  },

  // column-4: Ревью (1 задача)
  {
    id: "task-11",
    title: "Код ревью компонента карточки товара",
    listId: "column-4",
  },

  // column-5: Можно тестировать (4 задачи)
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
