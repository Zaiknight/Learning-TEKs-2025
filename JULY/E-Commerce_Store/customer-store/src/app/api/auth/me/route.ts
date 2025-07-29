import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  // Get token from cookies
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string };

    return NextResponse.json({ user: { id: decoded.id, name: decoded.name, email: decoded.email } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}