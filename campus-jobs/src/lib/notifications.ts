export type NotificationType = "status" | "message" | "system";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  at: string;
  href?: string;
  read: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    type: "status",
    title: "Статус заявки изменён",
    description: "Вакансия: Ассистент преподавателя — статус: В рассмотрении",
    at: "Сегодня, 16:20",
    href: "/applications/a1",
    read: false,
  },
  {
    id: "n2",
    type: "message",
    title: "Новое сообщение от работодателя",
    description: "Лаборатория ИИ запросила дополнительные материалы по проектам.",
    at: "Вчера, 11:05",
    href: "/applications/a2",
    read: false,
  },
  {
    id: "n3",
    type: "system",
    title: "Профиль обновлён",
    description: "Портфолио доступно работодателям кампуса.",
    at: "8 марта",
    href: "/profile/portfolio",
    read: true,
  },
];
