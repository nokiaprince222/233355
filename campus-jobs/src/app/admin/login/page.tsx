"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Ошибка входа");
        return;
      }

      // Проверяем роль
      if (data.role !== "EMPLOYER" && data.role !== "ADMIN") {
        toast.error("Доступ запрещен. Требуется роль администратора.");
        return;
      }

      // Устанавливаем куку для аутентификации
      document.cookie = "adminAuth=true; path=/; max-age=86400; SameSite=Strict";
      
      toast.success("Вход выполнен успешно");
      router.push("/admin/vacancies");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Ошибка при входе");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid place-items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Вход в админ-панель</CardTitle>
          <CardDescription>
            Введите email и пароль для доступа к управлению вакансиями
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@campus.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Демо: admin@campus.ru / password
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
