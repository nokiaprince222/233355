import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware для защиты админ-роутов
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, является ли путь админским
  if (pathname.startsWith("/admin")) {
    // Пропускаем страницу логина
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Проверяем куку adminAuth
    const adminAuth = request.cookies.get("adminAuth");
    
    if (!adminAuth || adminAuth.value !== "true") {
      // Перенаправляем на страницу логина
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

// Конфигурация middleware
export const config = {
  matcher: ["/admin/:path*"],
};
