import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/portfolio/[id] - удалить проект
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 });
  }
}

// PUT /api/portfolio/[id] - обновить проект
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        tags: JSON.stringify(body.tags),
        links: body.links ? JSON.stringify(body.links) : null,
        files: body.files ? JSON.stringify(body.files) : null,
        visibility: body.visibility,
      },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
  }
}
