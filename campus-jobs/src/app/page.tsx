import Link from "next/link";
import { FileText, Settings, Search, Bell, Briefcase, Building2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/navigation/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Кампус Карьера</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Централизованная платформа для поиска подработки и стажировок в кампусе
            </p>
          </div>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="size-5" />
              Поиск и фильтры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Фильтрация по типу, кафедре, оплате и формату (кампус/гибрид).
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-5" />
              Отклик и статус
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Резюме, сопроводительное письмо, уведомления и история изменений.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-5" />
              Админка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Размещение вакансий, управление откликами, общение с кандидатами.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="size-5" />
              Для студентов
            </CardTitle>
            <CardDescription>
              Поиск вакансий и управление портфолио
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-fit items-center justify-center gap-1 overflow-hidden rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs font-medium text-white">Вакансии</span>
                <span className="text-muted-foreground">поиск и фильтры</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-fit items-center justify-center gap-1 overflow-hidden rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs font-medium text-white">Портфолио</span>
                <span className="text-muted-foreground">проекты и файлы</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-fit items-center justify-center gap-1 overflow-hidden rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs font-medium text-white">Заявки</span>
                <span className="text-muted-foreground">отслеживание</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/vacancies">
                  <ArrowRight className="mr-2 size-4" />
                  К вакансиям
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-5" />
              Для работодателей
            </CardTitle>
            <CardDescription>
              Управление вакансиями и кандидатами
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-fit items-center justify-center gap-1 overflow-hidden rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs font-medium text-white">Вакансии</span>
                <span className="text-muted-foreground">создание и редактирование</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-fit items-center justify-center gap-1 overflow-hidden rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs font-medium text-white">Отклики</span>
                <span className="text-muted-foreground">просмотр и статус</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-fit items-center justify-center gap-1 overflow-hidden rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs font-medium text-white">Чат</span>
                <span className="text-muted-foreground">общение с кандидатами</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/vacancies">
                  <ArrowRight className="mr-2 size-4" />
                  Админка
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-5" />
              Центр уведомлений
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <CardDescription>
              Получайте уведомления об изменении статуса заявок и сообщения от работодателей.
            </CardDescription>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/notifications">
                  <ArrowRight className="mr-2 size-4" />
                  Уведомления
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
        </div>
      </main>
    </>
  );
}
