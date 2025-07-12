export type ColumnDef<T> = {
  id: string;
  title: string;
  count: number;
  items: T[];
};

export type Item = { id: string; title: string; columnId: string };

export const MOCK_ITEMS: Item[] = [
  { id: "task-1", title: "Создать шаблон проекта", columnId: "column-1" },
  {
    id: "task-2",
    title: "Собрать требования от клиента",
    columnId: "column-1",
  },
  {
    id: "task-3",
    title: "Проанализировать конкурентов",
    columnId: "column-1",
  },
  { id: "task-4", title: "Реализовать авторизацию", columnId: "column-2" },
  { id: "task-5", title: "Настроить роутинг", columnId: "column-2" },
  { id: "task-6", title: "Сверстать главную страницу", columnId: "column-2" },
  { id: "task-7", title: "Подключить API новостей", columnId: "column-2" },
  {
    id: "task-8",
    title: "Разработать компонент фильтра",
    columnId: "column-2",
  },
  { id: "task-9", title: "Получить доступ к Figma", columnId: "column-3" },
  {
    id: "task-10",
    title: "Уточнить формат данных от backend",
    columnId: "column-3",
  },
  {
    id: "task-11",
    title: "Код ревью компонента карточки товара",
    columnId: "column-4",
  },
  {
    id: "task-12",
    title: "Тест: регистрация нового пользователя",
    columnId: "column-5",
  },
  {
    id: "task-13",
    title: "Тест: переключение темной темы",
    columnId: "column-5",
  },
  {
    id: "task-14",
    title: "Тест: фильтрация по категориям",
    columnId: "column-5",
  },
  { id: "task-15", title: "Тест: responsive в Safari", columnId: "column-5" },
];

export const MOCK_COLUMNS: ColumnDef<Item>[] = [
  {
    id: "column-1",
    title: "Открыт",
    count: 3,
    items: [
      { id: "task-1", title: "Создать шаблон проекта", columnId: "column-1" },
      {
        id: "task-2",
        title: "Собрать требования от клиента",
        columnId: "column-1",
      },
      {
        id: "task-3",
        title: "Проанализировать конкурентов",
        columnId: "column-1",
      },
    ],
  },
  {
    id: "column-2",
    title: "В работе",
    count: 5,
    items: [
      { id: "task-4", title: "Реализовать авторизацию", columnId: "column-2" },
      { id: "task-5", title: "Настроить роутинг", columnId: "column-2" },
      {
        id: "task-6",
        title: "Сверстать главную страницу",
        columnId: "column-2",
      },
      { id: "task-7", title: "Подключить API новостей", columnId: "column-2" },
      {
        id: "task-8",
        title: "Разработать компонент фильтра",
        columnId: "column-2",
      },
    ],
  },
  {
    id: "column-3",
    title: "Требуется информация",
    count: 2,
    items: [
      { id: "task-9", title: "Получить доступ к Figma", columnId: "column-3" },
      {
        id: "task-10",
        title: "Уточнить формат данных от backend",
        columnId: "column-3",
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
        columnId: "column-4",
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
        columnId: "column-5",
      },
      {
        id: "task-13",
        title: "Тест: переключение темной темы",
        columnId: "column-5",
      },
      {
        id: "task-14",
        title: "Тест: фильтрация по категориям",
        columnId: "column-5",
      },
      {
        id: "task-15",
        title: "Тест: responsive в Safari",
        columnId: "column-5",
      },
    ],
  },
];
