"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) {
      alert("Ошибка: пользователь не найден");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const tags = formData.get("skills")?.toString().split(",").map(s => s.trim()).filter(Boolean) || [];
    const links = [
      { label: "GitHub", url: formData.get("github")?.toString() || "" },
      { label: "Демо", url: formData.get("demo")?.toString() || "" },
    ].filter(l => l.url);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title")?.toString() || "",
          description: formData.get("summary")?.toString() || "",
          tags,
          links: links.length > 0 ? links : null,
          files: null,
          visibility: formData.get("visibility")?.toString().toUpperCase() || "CAMPUS",
          userId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create");
      
      router.push("/profile/portfolio");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Ошибка при создании проекта");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Добавить проект</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Заполните описание проекта, навыки и добавьте ссылки/файлы.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Детали проекта</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Название проекта</Label>
                <Input id="title" name="title" placeholder="Например: Дашборд посещаемости" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Роль</Label>
                <Input id="role" name="role" placeholder="Разработчик / Аналитик / Исследователь" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="summary">Описание и результат</Label>
              <Textarea
                id="summary"
                name="summary"
                className="min-h-32"
                placeholder="Что вы сделали и какой был результат (цифры/эффект/польза)"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="skills">Навыки (теги через запятую)</Label>
                <Input id="skills" name="skills" placeholder="Python, SQL, Power BI..." />
              </div>
              <div className="grid gap-2">
                <Label>Видимость</Label>
                <Select name="visibility" defaultValue="campus">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите видимость" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campus">Виден работодателям кампуса</SelectItem>
                    <SelectItem value="private">Только по ссылке</SelectItem>
                    <SelectItem value="public">Публичный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ссылки</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" name="github" placeholder="https://github.com/..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="demo">Демо / Google Drive</Label>
              <Input id="demo" name="demo" placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
          <Button variant="outline" type="button" onClick={() => router.push("/profile/portfolio")}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
    </main>
    </>
  );
}
