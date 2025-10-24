/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAuthenticatedUser, authorizeRoles } from "@/app/lib/middlewares/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const userId = params.id;
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        projects: {
          select: {
            project: {
              select: { name: true },
            },
          },
        },
        _count: {
          select: { reportedBugs: true },
        },
      },
    });

    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formattedUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      createdAt: foundUser.createdAt.toISOString(),
      projects: foundUser.projects.map((p) => p.project.name),
      bugsReported: foundUser._count.reportedBugs,
    };

    return NextResponse.json({ user: formattedUser });
  } catch (error: any) {
    console.error("Get user by ID error:", error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      {
        status: error.message.includes("Unauthorized") || error.message.includes("Not authorized")
          ? 401
          : 500,
      }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const userId = params.id;
    const { email, name, password, role } = await req.json();

    // Validate inputs
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (password && password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    if (role && !["REPORTER", "DEVELOPER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check email uniqueness (if email is provided and different)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (email) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        projects: {
          select: {
            project: {
              select: { name: true },
            },
          },
        },
        _count: {
          select: { reportedBugs: true },
        },
      },
    });

    const formattedUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt.toISOString(),
      projects: updatedUser.projects.map((p) => p.project.name),
      bugsReported: updatedUser._count.reportedBugs,
    };

    return NextResponse.json({ user: formattedUser });
  } catch (error: any) {
    console.error("Update user error:", error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      {
        status: error.message.includes("Unauthorized") || error.message.includes("Not authorized")
          ? 401
          : error.message.includes("Invalid") || error.message.includes("exists")
          ? 400
          : 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const userId = params.id;

    // Prevent deleting self
    if (user.id === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user (cascade deletes relations)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete user error:", error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      {
        status: error.message.includes("Unauthorized") || error.message.includes("Not authorized")
          ? 401
          : error.message.includes("Cannot delete")
          ? 400
          : 500,
      }
    );
  }
}