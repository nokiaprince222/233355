"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Building2, MapPin, Clock, Banknote, FileText } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const vacancyTypes = [
  { value: "Подработка", label: "Подработка" },
  { value: "Стажировка", label: "Стажировка" },
  { value: "Исследовательский проект", label: "Исследовательский проект" },
  { value: "Ассистент преподавателя", label: "Ассистент преподавателя" },
];

const workFormats = [
  { value: "Кампус", label: "Кампус" },
  { value: "Гибрид", label: "Гибрид" },
];

export default function AdminNewVacancyPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, status: "ACTIVE" | "DRAFT") {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const tags = selectedTags.length > 0 ? selectedTags : ["Без опыта"];
    const responsibilities = formData.get("responsibilities")?.toString().split("\n").filter(Boolean) || [];
    const requirements = formData.get("requirements")?.toString().split("\n").filter(Boolean) || [];

    try {
      const res = await fetch("/api/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title")?.toString() || "",
          description: formData.get("description")?.toString() || "",
          department: formData.get("department")?.toString() || "",
          location: formData.get("location")?.toString() || "",
          type: formData.get("type")?.toString() || "Подработка",
          format: formData.get("format")?.toString() || "Кампус",
          pay: formData.get("pay")?.toString() || "",
          hoursPerWeek: formData.get("hours")?.toString() || "",
          deadline: formData.get("deadline")?.toString() || "",
          tags: JSON.stringify(tags),
          responsibilities: JSON.stringify(responsibilities),
          requirements: JSON.stringify(requirements),
          status,
        }),
      });

      if (!res.ok) throw new Error("Failed to create");

      if (status === "ACTIVE") {
        toast.success("Вакансия опубликована");
      } else {
        toast.info("Черновик сохранён");
      }
      
      router.push("/admin/vacancies");
    } catch (error) {
      console.error("Error creating vacancy:", error);
      toast.error("Ошибка при создании вакансии");
    } finally {
      setLoading(false);
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/vacancies">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Создать вакансию</h1>
          <p className="text-sm text-muted-foreground">
            Форма публикации вакансии для внутренних подразделений.
          </p>
        </div>
      </div>

      <form className="grid gap-6 lg:grid-cols-[1fr_320px]" onSubmit={(e) => handleSubmit(e, "ACTIVE")}>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Название вакансии</Label>
                <Input id="title" name="title" placeholder="Например: Ассистент преподавателя" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Опишите обязанности и требования..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="department">Подразделение</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="department" name="department" placeholder="Кафедра ИТ" className="pl-9" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Локация</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="location" name="location" placeholder="Корпус A, 3 этаж" className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="responsibilities">Обязанности (каждая с новой строки)</Label>
                <Textarea
                  id="responsibilities"
                  name="responsibilities"
                  placeholder="- Проверка заданий&#10;- Помощь студентам&#10;- Подготовка материалов"
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="requirements">Требования (каждое с новой строки)</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="- Знание Python&#10;- Коммуникабельность&#10;- Внимательность"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4" />
                Условия работы
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Тип занятости</Label>
                  <Select name="type" defaultValue="Подработка">
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {vacancyTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Формат работы</Label>
                  <Select name="format" defaultValue="Кампус">
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите формат" />
                    </SelectTrigger>
                    <SelectContent>
                      {workFormats.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="pay">Оплата</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="pay" name="pay" placeholder="900 ₽/час или 25 000 ₽/мес" className="pl-9" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hours">Занятость</Label>
                  <Input id="hours" name="hours" placeholder="10–15 ч/нед" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deadline">Дедлайн подачи заявок</Label>
                <Input id="deadline" name="deadline" type="date" />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Публикация..." : "Опубликовать"}
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                const form = e.currentTarget.closest('form');
                if (form) handleSubmit({ preventDefault: () => {}, currentTarget: form } as React.FormEvent<HTMLFormElement>, "DRAFT");
              }}
              disabled={loading}
            >
              Сохранить черновик
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin/vacancies">Отмена</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Подсказки</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <Badge variant="outline" className="shrink-0">1</Badge>
                <span>Чёткое название помогает студентам быстро понять суть позиции.</span>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="shrink-0">2</Badge>
                <span>Укажите конкретные навыки, которые пригодятся в работе.</span>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="shrink-0">3</Badge>
                <span>Реалистичный дедлайн даёт время на качественный отбор.</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Навыки и теги</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                {["Python", "Excel", "Коммуникация", "Аналитика", "JavaScript"].map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    <Plus className="mr-1 size-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Кликните на тег, чтобы добавить/убрать его из вакансии.
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
