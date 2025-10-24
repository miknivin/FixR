import { authorizeRoles, isAuthenticatedUser } from "@/app/lib/middlewares/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const projectId = params.id;
    const { userId } = await req.json();

    // Validate input
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already assigned
    const existingAssignment = await prisma.userProject.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (existingAssignment) {
      return NextResponse.json({ error: "User already assigned to project" }, { status: 409 });
    }

    // Assign user to project
    await prisma.userProject.create({
      data: { userId, projectId },
    });

    return NextResponse.json({ message: "User assigned to project successfully" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to assign user to project" },
      { status: error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500 }
    );
  }
}