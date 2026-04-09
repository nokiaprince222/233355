"use client";

import * as React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { Bookmark } from "lucide-react";

interface Vacancy {
  id: string;
  title: string;
  department: string;
  type: string;
  format: string;
  location: string;
  hoursPerWeek: string;
  pay: string;
  deadline: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: string;
  createdAt: string;
}

type TypeFilter = "all" | "Подработка" | "Стажировка";
type FormatFilter = "all" | "Кампус" | "Гибрид";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function includesQuery(v: Vacancy, q: string) {
  const haystack = [v.title, v.department, v.description, ...v.tags].join(" ").toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}

export default function VacanciesPage() {
  const [vacancies, setVacancies] = React.useState<Vacancy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<TypeFilter>("all");
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());
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
    async function fetchBookmarks() {
      try {
        const res = await fetch(`/api/bookmarks?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          const vacancyIds = new Set(data.map((b: any) => b.vacancyId) as string[]);
          setBookmarks(vacancyIds);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    }
    fetchBookmarks();
  }, [userId]);

  async function handleBookmark(vacancyId: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      if (bookmarks.has(vacancyId)) {
        await fetch(`/api/bookmarks?userId=${userId}&vacancyId=${vacancyId}`, {
          method: "DELETE",
        });
        setBookmarks(new Set([...bookmarks].filter((id) => id !== vacancyId)));
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, vacancyId }),
        });
        setBookmarks(new Set([...bookmarks, vacancyId]));
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
    }
  }

  const [format, setFormat] = React.useState<FormatFilter>("all");
  const [department, setDepartment] = React.useState<string>("all");
  const [selectedId, setSelectedId] = React.useState("");
  const [density, setDensity] = React.useState<"comfortable" | "compact">("comfortable");
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch vacancies from API
  React.useEffect(() => {
    async function fetchVacancies() {
      try {
        const res = await fetch("/api/vacancies");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        // Parse JSON fields for each vacancy
        const parsed = data.map((v: Vacancy) => ({
          ...v,
          tags: typeof v.tags === 'string' ? JSON.parse(v.tags) : v.tags,
          responsibilities: typeof v.responsibilities === 'string' ? JSON.parse(v.responsibilities) : v.responsibilities,
          requirements: typeof v.requirements === 'string' ? JSON.parse(v.requirements) : v.requirements,
        }));
        setVacancies(parsed);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVacancies();
  }, []);

  const departments = React.useMemo(() => {
    const d = Array.from(new Set(vacancies.map((v) => v.department)));
    return d.sort((a, b) => a.localeCompare(b));
  }, [vacancies]);

  const filtered = React.useMemo(() => {
    return vacancies.filter((v) => {
      if (type !== "all" && v.type !== type) return false;
      if (format !== "all" && v.format !== format) return false;
      if (department !== "all" && v.department !== department) return false;
      if (query.trim() && !includesQuery(v, query)) return false;
      return true;
    });
  }, [vacancies, query, type, format, department]);

  const selected = React.useMemo(() => {
    return filtered.find((v) => v.id === selectedId) ?? filtered[0] ?? vacancies[0];
  }, [filtered, selectedId, vacancies]);

  React.useEffect(() => {
    if (!selected) return;
    if (selectedId === selected.id) return;
    setSelectedId(selected.id);
  }, [selected, selectedId]);

  React.useEffect(() => {
    setIsLoading(true);
    const t = window.setTimeout(() => setIsLoading(false), 250);
    return () => window.clearTimeout(t);
  }, [query, type, format, department]);

  function resetFilters() {
    setQuery("");
    setType("all");
    setFormat("all");
    setDepartment("all");
  }

  if (loading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Вакансии и стажировки</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Поиск, фильтры и быстрый отклик — всё в одном месте.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card className="h-fit">
          <CardHeader className="space-y-3">
            <div className="grid gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по должности, кафедре, навыкам"
              />
              <div className="grid gap-2">
                <Tabs value={type} onValueChange={(v) => setType(v as TypeFilter)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Все</TabsTrigger>
                    <TabsTrigger value="Подработка">Подработка</TabsTrigger>
                    <TabsTrigger value="Стажировка">Стажировка</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Tabs value={density} onValueChange={(v) => setDensity(v as typeof density)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comfortable">Обычный</TabsTrigger>
                    <TabsTrigger value="compact">Компактный</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="grid gap-2 md:grid-cols-2">
                  <Select value={format} onValueChange={(v) => setFormat(v as FormatFilter)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Формат" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любой формат</SelectItem>
                      <SelectItem value="Кампус">Кампус</SelectItem>
                      <SelectItem value="Гибрид">Гибрид</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Подразделение" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все подразделения</SelectItem>
                      {departments.filter(d => d && d.trim()).map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                Найдено: <span className="font-medium text-foreground">{filtered.length}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Сбросить
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-xl border bg-card px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid gap-2">
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-5 w-28 rounded-full" />
                      <Skeleton className="h-5 w-36 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="grid gap-3 rounded-xl border border-dashed border-border p-4">
                <div className="text-sm font-semibold">Ничего не найдено</div>
                <div className="text-sm text-muted-foreground">
                  Попробуйте изменить запрос или сбросить фильтры.
                </div>
                <Button onClick={resetFilters} className="w-fit">
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filtered.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedId(v.id)}
                    className={
                      "text-left rounded-xl border bg-card transition-colors hover:bg-muted/40 cursor-pointer " +
                      (v.id === selected?.id ? "border-ring" : "border-border")
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <div className={density === "compact" ? "px-4 py-2" : "px-4 py-3"}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{v.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {v.department} • {v.format}
                        </div>
                      </div>
                      <Badge variant="outline">{v.type}</Badge>
                    </div>

                    {density === "comfortable" ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary">{v.pay}</Badge>
                        <Badge variant="secondary">{v.hoursPerWeek}</Badge>
                        <Badge variant="secondary">Дедлайн: {v.deadline}</Badge>
                      </div>
                    ) : null}

                    {density === "comfortable" ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {v.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {density === "comfortable" ? (
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant={bookmarks.has(v.id) ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => handleBookmark(v.id, e)}
                        >
                          <Bookmark className={`h-4 w-4 mr-2 ${bookmarks.has(v.id) ? "fill-current" : ""}`} />
                          {bookmarks.has(v.id) ? "Сохранено" : "Сохранить"}
                        </Button>
                        <Button size="sm" asChild onClick={(e) => e.stopPropagation()}>
                          <Link href={`/vacancies/${v.id}/apply`}>Откликнуться</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" asChild onClick={(e) => e.stopPropagation()}>
                          <Link href={`/vacancies/${v.id}/apply`}>Откликнуться</Link>
                        </Button>
                      </div>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">{selected?.title ?? "Вакансия"}</CardTitle>
            {selected ? (
              <div className="text-sm text-muted-foreground">
                {selected.department} • {selected.location} • {selected.format}
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="grid gap-6">
            {isLoading ? (
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-5 w-36 rounded-full" />
                </div>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="grid gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            ) : selected ? (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{selected.type}</Badge>
                <Badge variant="secondary">{selected.pay}</Badge>
                <Badge variant="secondary">{selected.hoursPerWeek}</Badge>
                <Badge variant="secondary">Дедлайн: {selected.deadline}</Badge>
              </div>
            ) : null}

            <div className="grid gap-2">
              <div className="text-sm font-semibold">Описание</div>
              <div className="text-sm text-muted-foreground">
                {selected?.description ?? "Выберите вакансию слева"}
              </div>
            </div>

            {selected ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Обязанности</div>
                  <div className="grid gap-2">
                    {selected.responsibilities?.map((r: string) => (
                      <div
                        key={r}
                        className="rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground"
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Требования</div>
                  <div className="grid gap-2">
                    {selected.requirements?.map((r: string) => (
                      <div
                        key={r}
                        className="rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground"
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {selected ? (
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={`/vacancies/${selected.id}/apply`}>Откликнуться</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/vacancies/${selected.id}`}>Открыть карточку</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
      </div>
      </main>
    </>
  );
}
