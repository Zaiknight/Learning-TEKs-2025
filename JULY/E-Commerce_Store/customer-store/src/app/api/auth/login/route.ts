import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; // For setting cookies on the server

const API_URL = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and Password Required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || "Invalid Credentials" },
        { status: response.status }
      );
    }

    // Assuming your controller returns { user, token }
    const { user, token } = data as { user: any; token: string };


    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Optionally, don't send the token back to the client, just user info
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Network Error" }, { status: 500 });
  }
}