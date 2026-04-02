import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Clock, Banknote, FileText, Pencil } from "lucide-react";

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
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

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

export default async function AdminEditVacancyPage({ params }: Props) {
  const { id } = await params;
  
  const v = await prisma.vacancy.findUnique({
    where: { id },
  });

  if (!v) {
    notFound();
  }

  // Parse JSON strings
  const tags = (typeof v.tags === 'string' ? JSON.parse(v.tags) : v.tags) as string[];
  const responsibilities = (typeof v.responsibilities === 'string' ? JSON.parse(v.responsibilities) : v.responsibilities) as string[];
  const requirements = (typeof v.requirements === 'string' ? JSON.parse(v.requirements) : v.requirements) as string[];

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/vacancies">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Редактировать вакансию</h1>
          <p className="text-sm text-muted-foreground">
            {v.title} • {v.department}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
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
                <Input id="title" defaultValue={v.title} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  defaultValue={v.description}
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="department">Подразделение</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="department" defaultValue={v.department} className="pl-9" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Локация</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="location" defaultValue={v.location} className="pl-9" />
                  </div>
                </div>
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
                  <Select defaultValue={v.type}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Select defaultValue={v.format}>
                    <SelectTrigger>
                      <SelectValue />
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
                    <Input id="pay" defaultValue={v.pay} className="pl-9" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hours">Занятость</Label>
                  <Input id="hours" defaultValue={v.hoursPerWeek} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deadline">Дедлайн подачи заявок</Label>
                <Input id="deadline" type="text" defaultValue={v.deadline} />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/vacancies">
                <Pencil className="mr-2 size-4" />
                Сохранить изменения
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/vacancies">Отмена</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Текущие теги</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(tags) && tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Статистика</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Просмотры:</span>
                <span className="font-medium">124</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Отклики:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус:</span>
                <Badge variant="outline">Активна</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
