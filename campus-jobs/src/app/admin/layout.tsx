import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import "../globals.css";

export const metadata: Metadata = {
  title: "Админ-панель | Кампус Карьера",
  description: "Управление вакансиями и откликами",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-background text-foreground antialiased">
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <Link href="/admin/vacancies" className="font-semibold tracking-tight">
            Кампус Карьера — Админ
          </Link>
          <div className="flex items-center gap-3">
            <NotificationsBell />
            <nav className="flex items-center gap-2 text-sm">
              <Link
                className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                href="/admin/vacancies"
              >
                Вакансии
              </Link>
              <Link
                className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                href="/admin/applications"
              >
                Отклики
              </Link>
              <span className="mx-1 h-6 w-px bg-border" />
              <Link
                className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                href="/vacancies"
              >
                На сайт →
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 py-8">{children}</main>
      <Toaster richColors closeButton />
    </div>
  );
}
