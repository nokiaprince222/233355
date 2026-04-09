import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/event-registrations - список регистраций пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const eventId = searchParams.get("eventId")

    const registrations = await prisma.eventRegistration.findMany({
      where: {
        ...(userId && { userId }),
        ...(eventId && { eventId }),
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            type: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(registrations)
  } catch (error) {
    console.error("Error fetching event registrations:", error)
    return NextResponse.json({ error: "Failed to fetch event registrations" }, { status: 500 })
  }
}

// POST /api/event-registrations - зарегистрироваться на мероприятие
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, eventId, status } = body

    const registration = await prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
        status: status || "REGISTERED",
      },
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error("Error creating event registration:", error)
    return NextResponse.json({ error: "Failed to create event registration" }, { status: 500 })
  }
}

// DELETE /api/event-registrations - отменить регистрацию
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const eventId = searchParams.get("eventId")

    if (!userId || !eventId) {
      return NextResponse.json({ error: "userId and eventId are required" }, { status: 400 })
    }

    await prisma.eventRegistration.deleteMany({
      where: {
        userId,
        eventId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event registration:", error)
    return NextResponse.json({ error: "Failed to delete event registration" }, { status: 500 })
  }
}
