import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedUser } from "@/app/lib/middlewares/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await isAuthenticatedUser(req);
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "",
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const statusCode = 401;
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, message: errorMessage }, { status: statusCode });
  }
}