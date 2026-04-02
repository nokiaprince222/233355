export type VacancyType = "Подработка" | "Стажировка" | "Исследовательский проект" | "Ассистент преподавателя";
export type WorkFormat = "Кампус" | "Гибрид";

export type Vacancy = {
  id: string;
  title: string;
  department: string;
  type: VacancyType;
  format: WorkFormat;
  location: string;
  hoursPerWeek: string;
  pay: string;
  deadline: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
};

export type ApplicationStatus =
  | "Черновик"
  | "Отправлено"
  | "Просмотрено"
  | "В рассмотрении"
  | "Запрошены материалы"
  | "Собеседование"
  | "Принято"
  | "Отказ";

export type PortfolioProject = {
  id: string;
  title: string;
  role: string;
  period: string;
  skills: string[];
  summary: string;
  links: { label: string; url: string }[];
  files: { name: string; size: string }[];
  visibility: "Виден работодателям кампуса" | "Только по ссылке";
};

export type Application = {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  department: string;
  createdAt: string;
  status: ApplicationStatus;
  timeline: { at: string; title: string; details?: string }[];
};

export const vacancies: Vacancy[] = [
  {
    id: "v1",
    title: "Ассистент преподавателя (Программирование)",
    department: "Кафедра ИТ",
    type: "Ассистент преподавателя",
    format: "Кампус",
    location: "Корпус A, 3 этаж",
    hoursPerWeek: "10–15 ч/нед",
    pay: "900 ₽/час",
    deadline: "20 марта",
    tags: ["JavaScript", "Коммуникация", "Без опыта"],
    description:
      "Помощь преподавателю на практических занятиях: проверка домашних заданий, ответы на вопросы студентов, сопровождение лабораторных.",
    responsibilities: [
      "Проверка домашних заданий и выдача обратной связи",
      "Помощь студентам на практиках",
      "Подготовка материалов (по шаблону)",
    ],
    requirements: [
      "Базовые знания JS/TS",
      "Ответственность и пунктуальность",
      "Готовность 2–3 раза в неделю быть в кампусе",
    ],
  },
  {
    id: "v2",
    title: "Стажёр-аналитик в административный отдел",
    department: "Деканат",
    type: "Стажировка",
    format: "Гибрид",
    location: "Корпус B",
    hoursPerWeek: "20 ч/нед",
    pay: "25 000 ₽/мес",
    deadline: "5 апреля",
    tags: ["Excel", "Документы", "Внимательность"],
    description:
      "Поддержка процессов деканата: отчётность, сводные таблицы, коммуникация со студентами по регламенту.",
    responsibilities: [
      "Подготовка сводных таблиц",
      "Помощь в документообороте",
      "Коммуникация со студентами по шаблонам",
    ],
    requirements: [
      "Уверенный Excel/Google Sheets",
      "Аккуратность",
      "Быстрое обучение",
    ],
  },
  {
    id: "v3",
    title: "Участник исследовательского проекта (NLP)",
    department: "Лаборатория ИИ",
    type: "Исследовательский проект",
    format: "Гибрид",
    location: "Корпус C, лаборатория 210",
    hoursPerWeek: "10 ч/нед",
    pay: "Грант 15 000 ₽/мес",
    deadline: "29 марта",
    tags: ["Python", "NLP", "Research"],
    description:
      "Участие в исследовательских задачах: подготовка данных, эксперименты, отчёты. Портфолио приветствуется.",
    responsibilities: [
      "Подготовка датасетов",
      "Запуск экспериментов",
      "Оформление результатов",
    ],
    requirements: [
      "Python",
      "Базовые знания ML",
      "Умение читать статьи (RU/EN)",
    ],
  },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "p1",
    title: "Телеграм-бот для записи в библиотеку",
    role: "Разработчик",
    period: "2025",
    skills: ["Python", "SQL", "API"],
    summary:
      "Сделал бота для записи на слоты посещения, добавил админ-панель и отчётность.",
    links: [
      { label: "GitHub", url: "https://github.com/example/library-bot" },
      { label: "Демо", url: "https://example.com/demo" },
    ],
    files: [{ name: "Презентация.pdf", size: "2.4 МБ" }],
    visibility: "Виден работодателям кампуса",
  },
  {
    id: "p2",
    title: "Дашборд посещаемости занятий",
    role: "Аналитик",
    period: "2024–2025",
    skills: ["Excel", "Power BI", "Data"],
    summary:
      "Собрал отчёты по посещаемости, настроил фильтры и показатели для кафедры.",
    links: [{ label: "Google Drive", url: "https://drive.google.com/example" }],
    files: [{ name: "Скриншоты.zip", size: "14 МБ" }],
    visibility: "Только по ссылке",
  },
];

export const applications: Application[] = [
  {
    id: "a1",
    vacancyId: "v1",
    vacancyTitle: "Ассистент преподавателя (Программирование)",
    department: "Кафедра ИТ",
    createdAt: "10 марта",
    status: "В рассмотрении",
    timeline: [
      { at: "10 марта, 10:12", title: "Заявка отправлена" },
      { at: "10 марта, 14:01", title: "Просмотрено работодателем" },
      {
        at: "10 марта, 16:20",
        title: "Статус изменён",
        details: "В рассмотрении",
      },
    ],
  },
  {
    id: "a2",
    vacancyId: "v3",
    vacancyTitle: "Участник исследовательского проекта (NLP)",
    department: "Лаборатория ИИ",
    createdAt: "8 марта",
    status: "Запрошены материалы",
    timeline: [
      { at: "8 марта, 09:40", title: "Заявка отправлена" },
      { at: "8 марта, 12:10", title: "Просмотрено работодателем" },
      {
        at: "9 марта, 11:05",
        title: "Запрос дополнительной информации",
        details: "Пришлите 1–2 проекта из портфолио и ссылку на GitHub",
      },
    ],
  },
];
