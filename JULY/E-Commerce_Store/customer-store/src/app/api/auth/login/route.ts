import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Network Error" }, { status: 500 });
  }
}