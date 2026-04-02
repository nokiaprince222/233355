import { applications, portfolioProjects } from "@/lib/mockData";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminApplicationProfilePage({ params }: Props) {
  const { id } = await params;
  const a = applications.find((x) => x.id === id) ?? applications[0];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Профиль кандидата</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {a.vacancyTitle} • {a.department} • Заявка: {a.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline">
            Запросить материалы
          </Button>
          <Button type="button">Назначить собеседование</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Данные кандидата</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3 text-sm">
              <div className="rounded-xl border bg-muted/30 px-3 py-2 text-muted-foreground">
                ФИО: Иван(а) Петров(а)
              </div>
              <div className="rounded-xl border bg-muted/30 px-3 py-2 text-muted-foreground">
                Факультет: ИТ • Курс: 3
              </div>
              <div className="rounded-xl border bg-muted/30 px-3 py-2 text-muted-foreground">
                Контакты: student@university.edu
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="text-sm font-semibold">Резюме</div>
                <div className="mt-2 text-sm text-muted-foreground">Файл: resume.pdf</div>
                <Button type="button" variant="outline" size="sm" className="mt-3">
                  Скачать
                </Button>
              </div>

              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="text-sm font-semibold">Сопроводительное письмо</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Здравствуйте! Мне интересна позиция, потому что я уже помогал(а) в учебных
                  проектах и хочу развиваться в преподавании.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="text-sm font-semibold">История статусов</div>
              <div className="mt-3 grid gap-2">
                {a.timeline.map((t) => (
                  <div key={t.at + t.title} className="rounded-xl border bg-background/40 px-3 py-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm">{t.title}</span>
                      <span className="text-xs text-muted-foreground">{t.at}</span>
                    </div>
                    {t.details ? (
                      <div className="mt-1 text-sm text-muted-foreground">{t.details}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="grid gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-sm">Портфолио</CardTitle>
              <Badge variant="secondary">Ссылки + файлы</Badge>
            </CardHeader>
            <CardContent className="grid gap-3">
              {portfolioProjects.slice(0, 2).map((p) => (
                <div key={p.id} className="rounded-2xl border bg-muted/30 p-4">
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.role} • {p.period} • {p.visibility}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-2">
                    {p.links.slice(0, 2).map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        className="rounded-xl border bg-background/40 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">Файлов: {p.files.length}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-sm">Чат</CardTitle>
              <Badge variant="secondary">Прототип</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="rounded-2xl border bg-muted/30 p-3 text-sm">
                  <div className="text-xs text-muted-foreground">Вы • сегодня</div>
                  <div className="mt-1">
                    Здравствуйте! Посмотрел портфолио — можете уточнить вклад в проект?
                  </div>
                </div>
                <div className="rounded-2xl border bg-background/40 p-3 text-sm">
                  <div className="text-xs text-muted-foreground">Кандидат • сегодня</div>
                  <div className="mt-1">
                    Да, я отвечал(а) за бэкенд и интеграцию API, могу прислать дополнительно.
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Input placeholder="Сообщение..." />
                <Button type="button">Отправить</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Link className="text-sm text-muted-foreground hover:text-foreground" href="/admin/applications">
        ← Назад к откликам
      </Link>
    </div>
  );
}
