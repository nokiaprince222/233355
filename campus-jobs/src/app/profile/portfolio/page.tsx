"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, FolderOpen, Link2, FileText, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { SiteHeader } from "@/components/navigation/SiteHeader";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  tags: string;
  links: string | null;
  files: string | null;
  visibility: string;
  createdAt: string;
}

const visibilityLabels: Record<string, string> = {
  PRIVATE: "По ссылке",
  CAMPUS: "Виден кампусу",
  PUBLIC: "Публичный",
};

export default function PortfolioPage() {
  const [projects, setProjects] = React.useState<Portfolio[]>([]);
  const [loading, setLoading] = React.useState(true);
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

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success("Проект удален");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Ошибка при удалении");
    }
  }

  // Fetch portfolio from API
  React.useEffect(() => {
    if (!userId) return;

    async function fetchPortfolio() {
      try {
        const res = await fetch(`/api/portfolio?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, [userId]);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="grid gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Портфолио</h1>
                <Skeleton className="mt-1 h-4 w-64" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
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
          <h1 className="text-2xl font-semibold tracking-tight">Портфолио</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Добавляйте проекты, ссылки и файлы — работодатели оценят ваши навыки.
          </p>
        </div>
        <Button asChild>
          <Link href="/profile/portfolio/new">
            <Plus className="mr-2 size-4" />
            Добавить проект
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            Нет проектов. Добавьте свой первый проект!
          </div>
        ) : (
          projects.map((p) => {
            const tags = JSON.parse(p.tags || "[]");
            const links = p.links ? JSON.parse(p.links) : [];
            const files = p.files ? JSON.parse(p.files) : [];
            return (
              <Card key={p.id} className="h-full">
                <CardContent className="grid gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/profile/portfolio/${p.id}`} className="grid gap-1 flex-1">
                      <div className="font-semibold hover:text-primary transition-colors">{p.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("ru-RU")}
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0">
                        {p.visibility === "CAMPUS" || p.visibility === "PUBLIC" ? (
                          <Eye className="mr-1 size-3" />
                        ) : (
                          <EyeOff className="mr-1 size-3" />
                        )}
                        {visibilityLabels[p.visibility] || p.visibility}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/profile/portfolio/${p.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Проект "{p.title}" будет удален.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(p.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <Link href={`/profile/portfolio/${p.id}`}>
                    <p className="text-sm text-muted-foreground line-clamp-2 hover:text-foreground transition-colors">
                      {p.description || "Нет описания"}
                    </p>
                  </Link>

                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 5).map((s: string) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <Link2 className="size-3.5" />
                      {links.length} ссылок
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="size-3.5" />
                      {files.length} файлов
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <FolderOpen className="size-5 text-yellow-500" />
          <CardTitle className="text-base">Рекомендации</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <Badge variant="outline" className="shrink-0">1</Badge>
            <span>Добавляйте 1–3 проекта, релевантных вакансии.</span>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="shrink-0">2</Badge>
            <span>Прикладывайте презентации/отчёты PDF и ссылки на репозитории.</span>
          </div>
        </CardContent>
      </Card>
    </div>
    </main>
  </>
);
}
