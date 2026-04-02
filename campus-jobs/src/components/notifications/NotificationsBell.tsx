"use client";

import * as React from "react";
import Link from "next/link";
import { BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { notifications as mockNotifications } from "@/lib/notifications";

export function NotificationsBell() {
  const [items, setItems] = React.useState(mockNotifications);

  const unreadCount = items.reduce((acc, n) => (n.read ? acc : acc + 1), 0);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellIcon />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
          <span className="sr-only">Уведомления</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[340px]">
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Уведомления</DropdownMenuLabel>
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Прочитать всё
          </Button>
        </div>
        <DropdownMenuSeparator />

        {items.slice(0, 6).map((n) => (
          <DropdownMenuItem key={n.id} asChild className="cursor-pointer">
            <Link href={n.href ?? "/notifications"}>
              <div className="grid gap-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium">
                    {n.title}
                    {!n.read ? (
                      <span className="ml-2 inline-flex h-2 w-2 translate-y-[-1px] rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground">{n.at}</div>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {n.description}
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications">Открыть центр уведомлений</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
