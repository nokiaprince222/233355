"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Download, Filter, MessageSquare, Calendar, User, Briefcase } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Application {
  id: string;
  status: string;
  createdAt: string;
  vacancy: {
    id: string;
    title: string;
    department: string;
  };
  user?: {
    name: string;
    faculty?: string;
    course?: number;
  };
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "outline",
  PENDING: "secondary",
  INTERVIEW: "default",
  ACCEPTED: "default",
  REJECTED: "destructive",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Черновик",
  PENDING: "На рассмотрении",
  INTERVIEW: "Собеседование",
  ACCEPTED: "Принято",
  REJECTED: "Отказ",
};

const kanbanColumns = [
  { key: "new", label: "Новые" },
  { key: "review", label: "В рассмотрении" },
  { key: "interview", label: "Интервью" },
  { key: "offer", label: "Оффер" },
  { key: "closed", label: "Закрыто" },
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  // Fetch applications from API
  React.useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/applications");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return applications;
    return applications.filter((a) =>
      a.vacancy.title.toLowerCase().includes(query.toLowerCase()) ||
      a.vacancy.department.toLowerCase().includes(query.toLowerCase())
    );
  }, [applications, query]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Админ: отклики</h1>
            <Skeleton className="mt-1 h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Админ: отклики</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Таблица и канбан для управления статусами кандидатов.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
            <div className="grid gap-1">
              <CardTitle className="text-base">Таблица откликов</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 size-4" />
                Фильтры
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 size-4" />
                Экспорт
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по вакансии или подразделению"
              />
            </div>

            <div className="rounded-xl border">
              <div className="grid grid-cols-[1fr_140px_minmax(140px,auto)_100px] gap-3 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                <div>Кандидат / вакансия</div>
                <div>Подразделение</div>
                <div>Статус</div>
                <div>Действия</div>
              </div>

              {filtered.map((a) => (
                <div
                  key={a.id}
                  className="grid grid-cols-[1fr_140px_minmax(140px,auto)_100px] items-center gap-3 border-b px-4 py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">Иван(а) Петров(а)</div>
                      <div className="text-xs text-muted-foreground">{a.vacancy.title}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="size-3" />
                    {a.vacancy.department}
                  </div>
                  <div>
                    <Badge variant={statusVariant[a.status] || "outline"}>{statusLabels[a.status] || a.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/admin/applications/${a.id}`}>Открыть</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Кандидат (превью)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Иван(а) Петров(а)</div>
                  <div className="text-xs text-muted-foreground">Факультет: ИТ • Курс: 3</div>
                </div>
              </div>

              <div className="grid gap-2 rounded-xl border bg-muted/30 p-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="size-4" />
                  <span>Резюме: загружено</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="size-4" />
                  <span>Сопроводительное: есть</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="size-4" />
                  <span>Проекты в отклике: 2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Проекты (портфолио)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="rounded-xl border p-3">
                  <div className="font-medium">Telegram-бот для библиотеки</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Python • PostgreSQL
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Python</Badge>
                    <Badge variant="outline" className="text-xs">aiogram</Badge>
                  </div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="font-medium">Сайт кафедры</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Frontend • React
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">React</Badge>
                    <Badge variant="outline" className="text-xs">TypeScript</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">
              <MessageSquare className="mr-2 size-4" />
              Написать
            </Button>
            <Button>
              <Calendar className="mr-2 size-4" />
              Интервью
            </Button>
          </div>
        </div>
      </div>

          </div>
  );
}
