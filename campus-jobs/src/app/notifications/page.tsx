"use client";

import * as React from "react";
import Link from "next/link";
import { BellIcon } from "lucide-react";
import { SiteHeader } from "@/components/navigation/SiteHeader";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const typeLabel: Record<string, string> = {
  APPLICATION: "Заявка",
  VACANCY: "Вакансия",
  SYSTEM: "Система",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<string>("");

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

  React.useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      try {
        const res = await fetch(`/api/notifications?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [userId]);

  const unread = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="grid gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Уведомления</h1>
                <Skeleton className="mt-1 h-4 w-64" />
              </div>
            </div>
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Уведомления</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Центр уведомлений: изменения статусов и сообщения от работодателей.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/vacancies">К вакансиям</Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BellIcon className="size-4" />
                Список уведомлений
                {unread > 0 && (
                  <Badge variant="secondary">{unread} новых</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Все уведомления от работодателей и системы.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Уведомлений пока нет.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={`/notifications/${n.id}`}
                      className="flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{n.title}</span>
                          {!n.read && (
                            <span className="size-2 rounded-full bg-primary" />
                          )}
                          <Badge variant="outline">{typeLabel[n.type] || n.type}</Badge>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {n.message}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleDateString("ru-RU")}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
