import type { UniqueIdentifier } from "@dnd-kit/core";

export type ColumnDef = {
  id: UniqueIdentifier;
  title: string;
};

export type Item = {
  id: UniqueIdentifier;
  title: string;
  columnId: UniqueIdentifier;
};

export const MOCK_ITEMS: Item[] = [
  // column-1: "Открыт"
  { id: "task-1", title: "Создать шаблон проекта", columnId: "column-1" },
  {
    id: "task-2",
    title: "Собрать требования от клиента",
    columnId: "column-1",
  },
  { id: "task-3", title: "Проанализировать конкурентов", columnId: "column-1" },
  {
    id: "task-16",
    title: "Определить целевую аудиторию",
    columnId: "column-1",
  },
  { id: "task-17", title: "Создать черновик UI макета", columnId: "column-1" },
  {
    id: "task-18",
    title: "Определить технологический стек",
    columnId: "column-1",
  },
  { id: "task-19", title: "Созвон с командой", columnId: "column-1" },
  { id: "task-20", title: "Подготовить презентацию", columnId: "column-1" },
  { id: "task-21", title: "Оценить сроки реализации", columnId: "column-1" },
  {
    id: "task-22",
    title: "Составить техническое задание",
    columnId: "column-1",
  },

  // column-2: "В работе"
  { id: "task-4", title: "Реализовать авторизацию", columnId: "column-2" },
  { id: "task-5", title: "Настроить роутинг", columnId: "column-2" },
  { id: "task-6", title: "Сверстать главную страницу", columnId: "column-2" },
  { id: "task-7", title: "Подключить API новостей", columnId: "column-2" },
  {
    id: "task-8",
    title: "Разработать компонент фильтра",
    columnId: "column-2",
  },
  { id: "task-23", title: "Интеграция с базой данных", columnId: "column-2" },
  { id: "task-24", title: "Добавить адаптивность", columnId: "column-2" },
  { id: "task-25", title: "Обработка ошибок на фронте", columnId: "column-2" },
  { id: "task-26", title: "Добавить логирование", columnId: "column-2" },
  { id: "task-27", title: "Реализовать загрузку файлов", columnId: "column-2" },

  // column-3: "Требуется информация"
  { id: "task-9", title: "Получить доступ к Figma", columnId: "column-3" },
  {
    id: "task-10",
    title: "Уточнить формат данных от backend",
    columnId: "column-3",
  },
  {
    id: "task-28",
    title: "Запросить данные для графиков",
    columnId: "column-3",
  },
  {
    id: "task-29",
    title: "Уточнить структуру пользователей",
    columnId: "column-3",
  },
  {
    id: "task-30",
    title: "Запросить контент у копирайтера",
    columnId: "column-3",
  },
  {
    id: "task-31",
    title: "Проверить доступ к API платёжки",
    columnId: "column-3",
  },
  {
    id: "task-32",
    title: "Получить ключи для интеграции",
    columnId: "column-3",
  },
  {
    id: "task-33",
    title: "Согласовать требования по безопасности",
    columnId: "column-3",
  },
  { id: "task-34", title: "Запросить UI-гайдлайн", columnId: "column-3" },
  {
    id: "task-35",
    title: "Уточнить часовой пояс пользователей",
    columnId: "column-3",
  },

  // column-4: "Ревью"
  {
    id: "task-11",
    title: "Код ревью компонента карточки товара",
    columnId: "column-4",
  },
  { id: "task-36", title: "Ревью компонента фильтра", columnId: "column-4" },
  {
    id: "task-37",
    title: "Проверка безопасности авторизации",
    columnId: "column-4",
  },
  {
    id: "task-38",
    title: "Ревью стилей для мобильной версии",
    columnId: "column-4",
  },
  { id: "task-39", title: "Проверка логики регистрации", columnId: "column-4" },
  {
    id: "task-40",
    title: "Проверка оптимизации загрузки",
    columnId: "column-4",
  },
  { id: "task-41", title: "Обратная связь от команды", columnId: "column-4" },
  { id: "task-42", title: "Проверка навигации", columnId: "column-4" },
  {
    id: "task-43",
    title: "Проверка работоспособности фильтра",
    columnId: "column-4",
  },
  { id: "task-44", title: "Анализ потенциальных багов", columnId: "column-4" },

  // column-5: "Можно тестировать"
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
  {
    id: "task-45",
    title: "Тест: авторизация с неверными данными",
    columnId: "column-5",
  },
  { id: "task-46", title: "Тест: кроссбраузерность", columnId: "column-5" },
  { id: "task-47", title: "Тест: валидация формы", columnId: "column-5" },
  { id: "task-48", title: "Тест: скорость загрузки", columnId: "column-5" },
  { id: "task-49", title: "Тест: навигация по сайту", columnId: "column-5" },
  {
    id: "task-50",
    title: "Тест: отклик на мобильных устройствах",
    columnId: "column-5",
  },
];

export const MOCK_COLUMNS: ColumnDef[] = [
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
