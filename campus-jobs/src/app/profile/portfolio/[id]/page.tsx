import { portfolioProjects } from "@/lib/mockData";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PortfolioProjectPage({ params }: Props) {
  const { id } = await params;
  const p = portfolioProjects.find((x) => x.id === id) ?? portfolioProjects[0];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{p.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {p.role} • {p.period} • {p.visibility}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/profile/portfolio">Назад</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Описание</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <p className="text-sm text-muted-foreground">{p.summary}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <div className="text-sm font-semibold">Навыки</div>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-semibold">Ссылки</div>
              <div className="grid gap-2">
                {p.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    className="rounded-xl border bg-muted/30 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label}: {l.url}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-2 rounded-2xl border bg-muted/30 p-4">
            <div className="text-sm font-semibold">Файлы</div>
            <div className="grid gap-2">
              {p.files.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between gap-4 rounded-xl border bg-background/40 px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">{f.name}</span>
                  <span className="text-xs text-muted-foreground">{f.size}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
