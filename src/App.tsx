import { useState } from "react";
import { Select } from "./components/closed/select";
import { Button } from "./components/ui/button";
import { MultiSelect } from "./components/closed/multi-select";
import { Input } from "./components/ui/input";
import { useDialog } from "./hooks/use-dialog";
import { FormDialog } from "./components/closed/form-dialog";
import { Form } from "./components/closed/form";
import { FormField } from "./components/closed/form-field";
import React from "react";
import z from "zod";
import {
  Kanban,
  KanbanCard,
  KanbanColumn,
  type ColumnDef,
} from "./components/closed/kanban";
import { PlusIcon } from "lucide-react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

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

export function App() {
  const { t } = useTranslation("App");

  const dialog = useDialog<{ listId: string }>();

  const [value, setValue] = useState<string>("nuxt.js");

  const [value2, setValue2] = useState<string[]>(["nuxt.js", "remix"]);

  function handleLog() {
    console.log("Current value:", value);
  }

  function handleLog2() {
    console.log("Current value2:", value2);
  }

  function handleFormSubmit(value: z.infer<typeof schema>) {
    console.log("Form value:", value);
  }

  function handleOpenDialog(listId: string) {
    dialog.open({ listId: listId });
  }

  return (
    // <div className="p-4 max-w-sm flex flex-col gap-2">
    //   <div className="flex flex-row gap-2">
    //     <Select
    //       placeholder="Выберите фреймворк"
    //       label="Фреймвокри"
    //       value={value}
    //       options={frameworks}
    //       onChange={setValue}
    //     />
    //     <Button onClick={handleLog}>Log</Button>
    //   </div>

    //   <div className="flex flex-row gap-2">
    //     <MultiSelect
    //       placeholder="Выберите фреймворки"
    //       label="Фреймворки"
    //       value={value2}
    //       options={frameworks}
    //       onChange={setValue2}
    //     />
    //     <Button onClick={handleLog2}>Log</Button>
    //   </div>
    //   <Button onClick={() => handleOpenDialog("LST0001")}>
    //     Открыть диалог
    //   </Button>
    //   <Input placeholder="Поиск..." />
    //   <Input variant="soft" placeholder="Поиск..." />
    //   <Checkbox />
    //   <RadioGroup>
    //     <RadioGroupItem value="124">Hello!</RadioGroupItem>
    //   </RadioGroup>
    //   {dialog.state.isOpen && (
    //     <FormDialog
    //       title="Создание объекта"
    //       description="Создание объекта очень трудоемкая операция."
    //       open={dialog.state.isOpen}
    //       onOpenChange={() => dialog.close()}
    //       submitButton={
    //         <Button type="submit" form="create-form">
    //           Создать объект
    //         </Button>
    //       }
    //       cancelButtonLabel="Отмена"
    //     >
    //       <Form
    //         id="create-form"
    //         schema={schema}
    //         onSubmit={handleFormSubmit}
    //         options={{
    //           defaultValues: {
    //             name: "",
    //             listId: dialog.state.data.listId,
    //           },
    //         }}
    //       >
    //         {({ control }) => (
    //           <React.Fragment>
    //             <FormField
    //               control={control}
    //               name="name"
    //               label="Название"
    //               render={(field) => <Input {...field} />}
    //             />
    //             <FormField
    //               control={control}
    //               name="listId"
    //               label="Список"
    //               render={(field) => (
    //                 <Select
    //                   className="w-full"
    //                   placeholder="Выберите список"
    //                   label="Доступные списки"
    //                   options={[
    //                     {
    //                       label: "LST0001",
    //                       value: "LST0001",
    //                     },
    //                     {
    //                       label: "LST0002",
    //                       value: "LST0002",
    //                     },
    //                     {
    //                       label: "LST0003",
    //                       value: "LST0003",
    //                     },
    //                   ]}
    //                   {...field}
    //                 />
    //               )}
    //             />
    //             <FormField
    //               control={control}
    //               name="labels"
    //               label="Метки"
    //               render={(field) => (
    //                 <MultiSelect
    //                   className="w-full"
    //                   placeholder="Выберите метки"
    //                   label="Доступные метки"
    //                   options={frameworks}
    //                   {...field}
    //                 />
    //               )}
    //             />
    //           </React.Fragment>
    //         )}
    //       </Form>
    //     </FormDialog>
    //   )}
    // </div>

    <div className="h-screen flex flex-1 p-4"></div>
  );
}

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
