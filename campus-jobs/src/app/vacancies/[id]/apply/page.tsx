import { portfolioProjects, vacancies } from "@/lib/mockData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/navigation/SiteHeader";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ApplyPage({ params }: Props) {
  const { id } = await params;
  const v = vacancies.find((x) => x.id === id) ?? vacancies[0];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Отклик на вакансию</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {v.title} • {v.department}
            </p>
          </div>

          <form className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Резюме</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="rounded-2xl border bg-muted/30 p-4">
                    <div className="text-sm font-medium">Загрузить файл</div>
                    <div className="mt-1 text-xs text-muted-foreground">PDF или DOCX</div>
                    <input className="mt-3 w-full text-sm" type="file" />
                  </label>
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <div className="text-sm font-medium">Использовать профиль</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Если у вас заполнен профиль, можно отправить его как резюме.
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-3">
                      Выбрать профиль
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Сопроводительное письмо</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="min-h-32 w-full rounded-2xl border bg-muted/30 p-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Коротко: почему вам интересна позиция и чем вы можете быть полезны"
                />
                <div className="mt-2 text-xs text-muted-foreground">Рекомендуем 500–1200 символов</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle className="text-sm">Портфолио</CardTitle>
                <Link className="text-xs text-muted-foreground hover:text-foreground" href="/profile/portfolio">
                  Управлять портфолио →
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <div className="text-sm font-medium">Выберите проекты (до 3)</div>
                    <div className="mt-3 grid gap-2">
                      {portfolioProjects.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-start gap-3 rounded-xl border bg-background/40 px-3 py-2"
                        >
                          <input className="mt-1" type="checkbox" />
                          <div>
                            <div className="text-sm font-medium">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{p.role} • {p.period}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <Button type="button" variant="secondary" size="sm" className="mt-3">
                      Добавить новый проект
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <div className="text-sm font-medium">Ссылки</div>
                      <div className="mt-3 grid gap-2">
                        <input
                          className="h-10 rounded-xl border bg-background/40 px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="GitHub"
                        />
                        <input
                          className="h-10 rounded-xl border bg-background/40 px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="Google Drive / Демо"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <div className="text-sm font-medium">Файлы</div>
                      <div className="mt-3 rounded-2xl border border-dashed bg-background/40 p-4 text-sm text-muted-foreground">
                        Перетащите файлы сюда или выберите вручную
                        <input className="mt-3 w-full text-sm" type="file" multiple />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/applications">Отправить заявку</Link>
              </Button>
              <Button type="button" variant="outline">
                Сохранить черновик
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
