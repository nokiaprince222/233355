"use client";

import * as React from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function AdminNav() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Если загружается или пользователь не админ, не показываем ничего
  if (loading || !user) return null;
  
  // Показываем только для EMPLOYER или ADMIN
  if (user.role !== "EMPLOYER" && user.role !== "ADMIN") return null;

  return (
    <>
      <span className="mx-1 h-6 w-px bg-border" />
      <Link
        className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        href="/admin/vacancies"
      >
        Админ: вакансии
      </Link>
      <Link
        className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        href="/admin/applications"
      >
        Админ: отклики
      </Link>
    </>
  );
}
