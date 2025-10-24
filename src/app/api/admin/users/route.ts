import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authorizeRoles, isAuthenticatedUser } from "@/app/lib/middlewares/auth";
import bcrypt from "bcryptjs";
export async function GET(req: NextRequest) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const users = await prisma.user.findMany({
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

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      projects: user.projects.map((p) => p.project.name),
      bugsReported: user._count.reportedBugs,
    }));

    return NextResponse.json({ users: formattedUsers });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Get users error:", error.message);
    return NextResponse.json({ error: error.message || "Server error" }, { status: error.message.includes("Unauthorized") || error.message.includes("Not authorized") ? 401 : 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthenticatedUser(req);
    authorizeRoles(user, "ADMIN");

    const { email, name, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!["REPORTER", "DEVELOPER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ user: newUser });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Add user error:", error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: error.message.includes("Unauthorized") || error.message.includes("Not authorized") ? 401 : error.message.includes("Invalid") || error.message.includes("exists") ? 400 : 500 }
    );
  }
}