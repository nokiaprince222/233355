import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/auth/login - вход пользователя
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Проверяем пароль (в реальном приложении нужно использовать bcrypt)
    // Для демо проверяем простое совпадение
    if (password !== "password") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Возвращаем данные пользователя без пароля
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

// GET /api/auth/me - получить текущего пользователя
export async function GET() {
  // В реальном приложении здесь проверяется сессия/JWT
  // Для демо возвращаем первого студента
  try {
    const user = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
