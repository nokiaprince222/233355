import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Очистка данных
  await prisma.eventRegistration.deleteMany()
  await prisma.bookmark.deleteMany()
  await prisma.review.deleteMany()
  await prisma.event.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.company.deleteMany()
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
  const vacancies = await prisma.vacancy.createMany({
    data: [
      {
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
      {
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
      {
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
    ],
  })

  // Создание заявки
  const vacancy = await prisma.vacancy.findFirst()
  if (vacancy) {
    await prisma.application.create({
      data: {
        status: "PENDING",
        coverLetter: "Хочу развиваться в преподавании...",
        userId: student.id,
        vacancyId: vacancy.id,
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
  }

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

  // Создание навыков
  await prisma.skill.createMany({
    data: [
      { name: "JavaScript", category: "Разработка" },
      { name: "Python", category: "Разработка" },
      { name: "SQL", category: "Данные" },
      { name: "Excel", category: "Данные" },
      { name: "Коммуникация", category: "Мягкие навыки" },
      { name: "Организация", category: "Мягкие навыки" },
      { name: "Power BI", category: "Данные" },
      { name: "TypeScript", category: "Разработка" },
      { name: "React", category: "Разработка" },
      { name: "Git", category: "Разработка" },
    ],
  })

  // Создание компаний
  const company1 = await prisma.company.create({
    data: {
      name: "Яндекс",
      description: "Технологическая компания",
      logo: null,
      website: "https://yandex.ru",
      industry: "IT",
    },
  })

  const company2 = await prisma.company.create({
    data: {
      name: "Сбер",
      description: "Финансовая компания",
      logo: null,
      website: "https://sber.ru",
      industry: "Финансы",
    },
  })

  // Обновление вакансий с привязкой к компаниям
  const allVacancies = await prisma.vacancy.findMany()
  if (allVacancies.length > 0) {
    await prisma.vacancy.update({
      where: { id: allVacancies[0].id },
      data: { companyId: company1.id },
    })
    if (allVacancies.length > 1) {
      await prisma.vacancy.update({
        where: { id: allVacancies[1].id },
        data: { companyId: company2.id },
      })
    }
  }

  // Создание мероприятий
  await prisma.event.createMany({
    data: [
      {
        title: "Ярмарка вакансий 2024",
        description: "Встреча с работодателями кампуса",
        date: new Date("2024-04-15T10:00:00"),
        location: "Главный корпус, актовый зал",
        type: "CAREER_FAIR",
        status: "UPCOMING",
        companyId: company1.id,
      },
      {
        title: "Вебинар: Карьера в IT",
        description: "Онлайн-встреча с экспертами",
        date: new Date("2024-04-20T14:00:00"),
        location: "Zoom",
        type: "WEBINAR",
        status: "UPCOMING",
        companyId: company2.id,
      },
      {
        title: "Мастер-класс: Резюме и собеседование",
        description: "Практические советы для студентов",
        date: new Date("2024-03-25T16:00:00"),
        location: "Корпус B, 101",
        type: "WORKSHOP",
        status: "COMPLETED",
      },
    ],
  })

  // Создание отзывов
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: "Отличная компания для старта карьеры",
        userId: student.id,
        companyId: company1.id,
      },
      {
        rating: 4,
        comment: "Хорошие условия, но много бюрократии",
        userId: student.id,
        companyId: company2.id,
      },
    ],
  })

  // Создание закладок
  const firstVacancy = await prisma.vacancy.findFirst()
  if (firstVacancy) {
    await prisma.bookmark.create({
      data: {
        userId: student.id,
        vacancyId: firstVacancy.id,
      },
    })
  }

  // Создание регистраций на мероприятия
  const firstEvent = await prisma.event.findFirst()
  if (firstEvent) {
    await prisma.eventRegistration.create({
      data: {
        userId: student.id,
        eventId: firstEvent.id,
        status: "REGISTERED",
      },
    })
  }

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
