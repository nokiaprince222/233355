import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Очистка данных
  await prisma.message.deleteMany()
  await prisma.application.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.portfolio.deleteMany()
  await prisma.vacancy.deleteMany()
  await prisma.user.deleteMany()

  // Создание пользователей
  const student = await prisma.user.create({
    data: {
      name: "Иван Петров",
      email: "student@campus.ru",
      role: "STUDENT",
      faculty: "ИТ",
      course: 3,
    },
  })

  const employer = await prisma.user.create({
    data: {
      name: "Админ Кафедры",
      email: "admin@campus.ru",
      role: "EMPLOYER",
    },
  })

  // Создание вакансий
  const v1 = await prisma.vacancy.create({
    data: {
      title: "Ассистент преподавателя (Программирование)",
      department: "Кафедра ИТ",
      type: "Ассистент преподавателя",
      format: "Кампус",
      location: "Корпус A, 3 этаж",
      hoursPerWeek: "10–15 ч/нед",
      pay: "900 ₽/час",
      deadline: "20 марта",
      tags: JSON.stringify(["JavaScript", "Коммуникация", "Без опыта"]),
      description: "Помощь преподавателю на практических занятиях...",
      responsibilities: JSON.stringify([
        "Проверка домашних заданий",
        "Помощь студентам на практиках",
        "Подготовка материалов",
      ]),
      requirements: JSON.stringify([
        "Знание JavaScript/Python",
        "Коммуникабельность",
        "Внимательность",
      ]),
      status: "ACTIVE",
    },
  })

  const v2 = await prisma.vacancy.create({
    data: {
      title: "Лаборант (Data Science)",
      department: "Кафедра анализа данных",
      type: "Лаборант",
      format: "Кампус",
      location: "Корпус B, 2 этаж",
      hoursPerWeek: "8–12 ч/нед",
      pay: "850 ₽/час",
      deadline: "15 марта",
      tags: JSON.stringify(["Python", "SQL", "Excel"]),
      description: "Поддержка лабораторных работ по анализу данных...",
      responsibilities: JSON.stringify([
        "Подготовка датасетов",
        "Настройка Jupyter",
        "Консультации студентов",
      ]),
      requirements: JSON.stringify([
        "Python на уровне junior",
        "Базовые знания SQL",
        "Excel/Google Таблицы",
      ]),
      status: "ACTIVE",
    },
  })

  const v3 = await prisma.vacancy.create({
    data: {
      title: "Помощник администратора",
      department: "Деканат ИТ",
      type: "Администратор",
      format: "Кампус",
      location: "Корпус A, 1 этаж",
      hoursPerWeek: "12–16 ч/нед",
      pay: "800 ₽/час",
      deadline: "25 марта",
      tags: JSON.stringify(["Организация", "Документооборот", "Внимательность"]),
      description: "Организация документооборота и приёма студентов...",
      responsibilities: JSON.stringify([
        "Приём студентов",
        "Оформление документов",
        "Работа с базой данных",
      ]),
      requirements: JSON.stringify([
        "Организованность",
        "Вежливость",
        "Опыт работы с документами",
      ]),
      status: "ACTIVE",
    },
  })

  // Создание заявки
  await prisma.application.create({
    data: {
      status: "PENDING",
      coverLetter: "Хочу развиваться в преподавании...",
      userId: student.id,
      vacancyId: v1.id,
      messages: {
        create: [
          {
            content: "Здравствуйте! Я хочу откликнуться на вакансию.",
            senderType: "APPLICANT",
          },
          {
            content: "Добрый день! Рассмотрим вашу кандидатуру.",
            senderType: "EMPLOYER",
          },
        ],
      },
    },
  })

  // Создание уведомлений
  await prisma.notification.createMany({
    data: [
      {
        title: "Новый отклик",
        message: "На вашу вакансию откликнулся студент",
        type: "APPLICATION",
        userId: employer.id,
      },
      {
        title: "Статус заявки изменён",
        message: "Ваша заявка на рассмотрении",
        type: "APPLICATION",
        userId: student.id,
      },
    ],
  })

  // Создание портфолио
  await prisma.portfolio.create({
    data: {
      title: "Telegram-бот для библиотеки",
      description: "Сделал бота для записи на слоты посещения",
      tags: JSON.stringify(["Python", "aiogram", "PostgreSQL"]),
      links: JSON.stringify([{ label: "GitHub", url: "https://github.com/..." }]),
      visibility: "CAMPUS",
      userId: student.id,
    },
  })

  console.log("✅ Seed data created successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
