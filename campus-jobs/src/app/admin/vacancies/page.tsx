"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Building2, Clock, Pencil, Trash2, EyeOff, Lightbulb, CheckCircle, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Vacancy {
  id: string;
  title: string;
  department: string;
  type: string;
  format: string;
  pay: string;
  deadline: string;
  status: string;
}

export default function AdminVacanciesPage() {
  const [vacancies, setVacancies] = React.useState<Vacancy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [department, setDepartment] = React.useState("all");

  // Fetch vacancies from API
  React.useEffect(() => {
    async function fetchVacancies() {
      try {
        const res = await fetch("/api/vacancies");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVacancies(data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVacancies();
  }, []);

  const departments = React.useMemo(() => {
    return Array.from(new Set(vacancies.map((v) => v.department))).sort();
  }, [vacancies]);

  const filtered = React.useMemo(() => {
    return vacancies.filter((v) => {
      if (department !== "all" && v.department !== department) return false;
      if (query.trim()) {
        const haystack = [v.title, v.department, v.type].join(" ").toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [vacancies, query, department]);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/vacancies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setVacancies(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
      toast.success(newStatus === "ACTIVE" ? "Вакансия опубликована" : "Вакансия скрыта");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Ошибка при изменении статуса");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/vacancies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      setVacancies(prev => prev.filter(v => v.id !== id));
      toast.success("Вакансия удалена");
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      toast.error("Ошибка при удалении");
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Админ: вакансии</h1>
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
          <h1 className="text-2xl font-semibold tracking-tight">Админ: вакансии</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Размещение, редактирование и управление публикациями.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/vacancies/new">
            <Plus className="mr-2 size-4" />
            Создать вакансию
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по названию..."
                  className="pl-9 w-[260px]"
                />
              </div>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px]">
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
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border">
            <div className="grid grid-cols-[1fr_180px_120px_140px] gap-3 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
              <div>Название</div>
              <div>Подразделение</div>
              <div>Дедлайн</div>
              <div>Действия</div>
            </div>

            {filtered.map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-[1fr_180px_120px_140px] items-center gap-3 border-b px-4 py-3 last:border-b-0"
              >
                <div>
                  <div className="font-medium">{v.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{v.type}</Badge>
                    <Badge variant="secondary">{v.format}</Badge>
                    <span>{v.pay}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="size-3" />
                  {v.department}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="size-3" />
                  {v.deadline}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" className="h-8" asChild>
                    <Link href={`/admin/vacancies/${v.id}/edit`} className="flex items-center">
                      <Pencil className="mr-1 size-3" />
                      Редакт.
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleStatusChange(v.id, v.status === "ACTIVE" ? "DRAFT" : "ACTIVE")}
                    title={v.status === "ACTIVE" ? "Скрыть" : "Опубликовать"}
                  >
                    {v.status === "ACTIVE" ? <EyeOff className="size-4" /> : <CheckCircle className="size-4" />}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить вакансию?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Вакансия "{v.title}" будет удалена.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(v.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed p-8 text-center">
              <div className="text-sm font-medium">Ничего не найдено</div>
              <div className="text-xs text-muted-foreground mt-1">
                Попробуйте изменить фильтры или создайте новую вакансию.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <Lightbulb className="size-5 text-yellow-500" />
          <CardTitle className="text-base">Подсказки</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            Добавьте дедлайн и контактное лицо — это снижает количество уточняющих сообщений.
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            В откликах используйте статусы и шаблоны сообщений.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
