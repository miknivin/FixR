/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizeRoles, isAuthenticatedUser } from "@/app/lib/middlewares/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        users: { select: { user: { select: { id: true, name: true, email: true } } } },
        bugs: { select: { id: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      project: {
        ...project,
        users: project.users.map((u) => u.user),
        bugs: project.bugs.map((b) => b.id),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch project" },
      { status: error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500 }
    );
  }
}

// PUT: Update a project
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const projectId = params.id;
    const { name, description } = await req.json();

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check for duplicate name (excluding current project)
    if (name !== project.name) {
      const existingProject = await prisma.project.findUnique({ where: { name } });
      if (existingProject) {
        return NextResponse.json({ error: "Project name already exists" }, { status: 409 });
      }
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { name, description: description || null },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        users: { select: { user: { select: { id: true, name: true, email: true } } } },
        bugs: { select: { id: true } },
      },
    });

    return NextResponse.json({
      project: {
        ...updatedProject,
        users: updatedProject.users.map((u) => u.user),
        bugs: updatedProject.bugs.map((b) => b.id),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500 }
    );
  }
}

// POST: Assign a user to a project
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to assign user to project" },
      { status: error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500 }
    );
  }
}

// DELETE: Delete a project
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const projectId = params.id;

    // Check if project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete project (cascades to UserProject, Bug via Prisma schema)
    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.log(error);
    
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500 }
    );
  }
}