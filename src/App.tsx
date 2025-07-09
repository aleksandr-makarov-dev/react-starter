import { useState } from "react";
import { Select } from "./components/closed/select";
import { Button } from "./components/ui/button";
import { MultiSelect } from "./components/closed/multi-select";
import { Input } from "./components/ui/input";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Checkbox } from "./components/ui/checkbox";
import { useDialog } from "./hooks/use-dialog";
import { FormDialog } from "./components/closed/form-dialog";
import { Form } from "./components/closed/form";
import { FormField } from "./components/closed/form-field";
import React from "react";
import z from "zod";

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

  function handleOpenDialog() {
    dialog.open({ listId: "LST0001" });
  }

  return (
    <div className="p-4 max-w-sm flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Select
          placeholder="Выберите фреймворк"
          label="Фреймвокри"
          value={value}
          options={frameworks}
          onChange={setValue}
        />
        <Button onClick={handleLog}>Log</Button>
      </div>

      <div className="flex flex-row gap-2">
        <MultiSelect
          placeholder="Выберите фреймворки"
          label="Фреймворки"
          value={value2}
          options={frameworks}
          onChange={setValue2}
        />
        <Button onClick={handleLog2}>Log</Button>
      </div>
      <Button onClick={handleOpenDialog}>Открыть диалог</Button>
      <Input placeholder="Поиск..." />
      <Input variant="soft" placeholder="Поиск..." />
      <Checkbox />
      <RadioGroup>
        <RadioGroupItem value="124">Hello!</RadioGroupItem>
      </RadioGroup>
      {dialog.state.isOpen && (
        <FormDialog
          title="Создание объекта"
          description="Создание объекта очень трудоемкая операция."
          open={dialog.state.isOpen}
          onOpenChange={() => dialog.close()}
          submitButton={
            <Button type="submit" form="create-form">
              Создать объект
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
                listId: dialog.state.data.listId,
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
                      options={[
                        {
                          label: "LST0001",
                          value: "LST0001",
                        },
                        {
                          label: "LST0002",
                          value: "LST0002",
                        },
                        {
                          label: "LST0003",
                          value: "LST0003",
                        },
                      ]}
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
      )}
    </div>
  );
}
