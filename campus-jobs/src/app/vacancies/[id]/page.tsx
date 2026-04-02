"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/navigation/SiteHeader";

interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  format: string;
  description: string;
  type: string;
  pay: string;
  hoursPerWeek: string;
  deadline: string;
  tags: unknown;
  responsibilities: unknown;
  requirements: unknown;
}

 function safeStringArray(value: unknown): string[] {
   if (Array.isArray(value)) {
     return value.filter((x) => typeof x === "string") as string[];
   }
   if (typeof value === "string") {
     try {
       const parsed = JSON.parse(value);
       if (Array.isArray(parsed)) {
         return parsed.filter((x) => typeof x === "string") as string[];
       }
     } catch {
       return [];
     }
   }
   return [];
 }

export default function VacancyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [vacancy, setVacancy] = React.useState<Vacancy | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { id } = React.use(params);

  React.useEffect(() => {
    async function fetchVacancy() {
      try {
        const res = await fetch(`/api/vacancies/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setVacancy(data);
      } catch (error) {
        console.error("Error fetching vacancy:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVacancy();
  }, [id]);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="grid gap-6">
            <Skeleton className="h-8 w-64" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (!vacancy) {
    return notFound();
  }

  const v = vacancy;
  const responsibilities = safeStringArray(v.responsibilities);
  const requirements = safeStringArray(v.requirements);
  const tags = safeStringArray(v.tags);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{v.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {v.department} • {v.location} • {v.format}
              </p>
            </div>
            <Button asChild>
              <Link href={`/vacancies/${v.id}/apply`}>Откликнуться</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">О вакансии</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <div className="text-sm font-semibold">Описание</div>
                <div className="text-sm text-muted-foreground">{v.description}</div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Обязанности</div>
                  <ul className="grid gap-2">
                    {responsibilities.map((r: string) => (
                      <li
                        key={r}
                        className="rounded-xl border bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Требования</div>
                  <ul className="grid gap-2">
                    {requirements.map((r: string) => (
                      <li
                        key={r}
                        className="rounded-xl border bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border bg-muted/30 p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Оплата</span>
                  <span className="font-medium">{v.pay}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Занятость</span>
                  <span className="font-medium">{v.hoursPerWeek}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Дедлайн</span>
                  <span className="font-medium">{v.deadline}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((t: string) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="/vacancies">
              ← Назад к списку
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href={`/vacancies/${v.id}/apply`}
            >
              Перейти к отклику →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
