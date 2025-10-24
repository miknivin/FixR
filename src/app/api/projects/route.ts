/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizeRoles, isAuthenticatedUser } from "@/app/lib/middlewares/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        users: { select: { user: { select: { id: true, name: true } } } },
        bugs: { select: { id: true } },
      },
    });

    return NextResponse.json({
      projects: projects.map((project) => ({
        ...project,
        users: project.users.map((u) => ({ id: u.user.id, name: u.user.name })),
        bugs: project.bugs.map((b) => b.id),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500 }
    );
  }
}

// POST: Create a new project
export async function POST(req: NextRequest) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user,"ADMIN");

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    // Check for duplicate project name
    const existingProject = await prisma.project.findUnique({ where: { name } });
    if (existingProject) {
      return NextResponse.json({ error: "Project name already exists" }, { status: 409 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        users: { select: { userId: true } },
        bugs: { select: { id: true } },
      },
    });

    return NextResponse.json({
      project: {
        ...project,
        users: project.users.map((u) => u.userId),
        bugs: project.bugs.map((b) => b.id),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500 }
    );
  }
}