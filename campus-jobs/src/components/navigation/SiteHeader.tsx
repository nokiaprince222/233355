"use client";

import Link from "next/link";
import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { AdminNav } from "@/components/navigation/AdminNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        <Link href="/vacancies" className="font-semibold tracking-tight">
          Кампус Карьера
        </Link>
        <div className="flex items-center gap-3">
          <NotificationsBell />
          <nav className="flex items-center gap-2 text-sm">
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/vacancies"
            >
              Вакансии
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/applications"
            >
              Мои заявки
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/profile/portfolio"
            >
              Портфолио
            </Link>
            <AdminNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
