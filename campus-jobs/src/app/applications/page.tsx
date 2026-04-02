"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, MessageSquare, Clock } from "lucide-react";
import { SiteHeader } from "@/components/navigation/SiteHeader";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Application {
  id: string;
  status: string;
  coverLetter: string | null;
  createdAt: string;
  vacancy: {
    id: string;
    title: string;
    department: string;
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

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "active" | "archive">("all");
  const [userId, setUserId] = React.useState<string>("");

  // Fetch current user
  React.useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const user = await res.json();
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  // Fetch applications from API
  React.useEffect(() => {
    if (!userId) return;
    
    async function fetchApplications() {
      try {
        const res = await fetch(`/api/applications?userId=${userId}`);
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
  }, [userId]);

  const filtered = React.useMemo(() => {
    if (filter === "all") return applications;
    if (filter === "active") {
      return applications.filter((a) =>
        ["PENDING", "INTERVIEW"].includes(a.status)
      );
    }
    return applications.filter((a) => ["ACCEPTED", "REJECTED"].includes(a.status));
  }, [applications, filter]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Мои заявки</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Отслеживайте статусы, историю изменений и сообщения от работодателей.
              </p>
            </div>
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="active">Активные</TabsTrigger>
              <TabsTrigger value="archive">Архив</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4">
            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="grid gap-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid gap-2">
                          <Skeleton className="h-4 w-64" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-5 w-28 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-5/6" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card>
                <CardContent className="grid gap-4 py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileText className="size-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Нет заявок</div>
                    <div className="text-sm text-muted-foreground">
                      {filter === "all"
                        ? "У вас пока нет заявок. Перейдите к вакансиям и откликнитесь!"
                        : "В этой категории пока нет заявок."}
                    </div>
                  </div>
                  <Button asChild className="mx-auto w-fit">
                    <Link href="/vacancies">К вакансиям</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filtered.map((a) => (
                <Link key={a.id} href={`/applications/${a.id}`}>
                  <Card className="cursor-pointer transition-colors hover:bg-muted/40">
                    <CardContent className="grid gap-4 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{a.vacancy.title}</div>
                            <Badge variant={statusVariant[a.status] || "outline"}>
                              {statusLabels[a.status] || a.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{a.vacancy.department}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3.5" />
                              {a.createdAt}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <span>Подробнее</span>
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MessageSquare className="size-4" />
                          <span>Последнее событие:</span>
                          <span className="font-medium text-foreground">
                            {new Date(a.createdAt).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
