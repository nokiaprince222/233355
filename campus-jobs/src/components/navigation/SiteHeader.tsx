"use client";

import * as React from "react";
import Link from "next/link";
import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { AdminNav } from "@/components/navigation/AdminNav";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        <Link href="/vacancies" className="font-semibold tracking-tight">
          Кампус Карьера
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
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
              href="/bookmarks"
            >
              Закладки
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/events"
            >
              Мероприятия
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/companies"
            >
              Компании
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

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <NotificationsBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col p-4 gap-2 text-sm">
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/vacancies"
              onClick={() => setMobileMenuOpen(false)}
            >
              Вакансии
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/applications"
              onClick={() => setMobileMenuOpen(false)}
            >
              Мои заявки
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/bookmarks"
              onClick={() => setMobileMenuOpen(false)}
            >
              Закладки
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
            >
              Мероприятия
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/companies"
              onClick={() => setMobileMenuOpen(false)}
            >
              Компании
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href="/profile/portfolio"
              onClick={() => setMobileMenuOpen(false)}
            >
              Портфолио
            </Link>
            <div className="mt-2 pt-2 border-t">
              <AdminNav />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
