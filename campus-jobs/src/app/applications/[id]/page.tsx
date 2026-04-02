import { notFound } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Send, ArrowLeft, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/navigation/SiteHeader";

type Props = {
  params: Promise<{ id: string }>;
};

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

export default async function ApplicationDetailsPage({ params }: Props) {
  const { id } = await params;

  const a = await prisma.application.findUnique({
    where: { id },
    include: {
      vacancy: true,
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!a) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Детали заявки</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="size-4" />
            <span>{a.vacancy.department}</span>
            <span>•</span>
            <Clock className="size-4" />
            <span>Отправлено: {new Date(a.createdAt).toLocaleDateString("ru-RU")}</span>
          </div>
        </div>
        <Badge variant={statusVariant[a.status] || "outline"} className="h-9 px-4 py-2 text-sm">
          {statusLabels[a.status] || a.status}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">История сообщений</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 max-h-[320px] overflow-y-auto pr-2">
              {a.messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Нет сообщений
                </div>
              ) : (
                a.messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.senderType === "APPLICANT" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="size-8">
                      <AvatarFallback className={m.senderType === "APPLICANT" ? "bg-primary text-primary-foreground text-xs" : "bg-muted text-xs"}>
                        {m.senderType === "APPLICANT" ? "Я" : "Р"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`grid gap-1 rounded-2xl px-4 py-2 text-sm ${m.senderType === "APPLICANT" ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-muted"}`}>
                      <div className={`flex items-center gap-2 text-xs ${m.senderType === "APPLICANT" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        <span>{m.senderType === "APPLICANT" ? "Вы" : "Работодатель"}</span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleDateString("ru-RU")}</span>
                      </div>
                      <div>{m.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2">
              <Input placeholder="Написать сообщение..." />
              <Button size="icon">
                <Send className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">О вакансии</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="font-semibold">{a.vacancy.title}</div>
              <div className="text-sm text-muted-foreground">{a.vacancy.department}</div>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Оплата:</span>
                <span>{a.vacancy.pay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Занятость:</span>
                <span>{a.vacancy.hoursPerWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дедлайн:</span>
                <span>{a.vacancy.deadline}</span>
              </div>
            </div>
            <Button asChild>
              <Link href={`/vacancies/${a.vacancy.id}`}>Перейти к вакансии</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Button variant="ghost" className="w-fit" asChild>
        <Link href="/applications">
          <ArrowLeft className="mr-2 size-4" />
          Назад к списку
        </Link>
      </Button>
        </div>
      </main>
    </>
  );
}
