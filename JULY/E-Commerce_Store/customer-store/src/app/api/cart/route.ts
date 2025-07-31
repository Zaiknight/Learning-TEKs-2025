import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const authRes = await fetch(`${req.nextUrl.origin}/api/auth/me`, {
      headers: req.headers,
      credentials: "include",
    });
    const authData = await authRes.json();
    const user = authData.user;
    if (!user?.id) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const cartRes = await fetch(`${API_BASE_URL}/cart/${user.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!cartRes.ok) {
      return NextResponse.json({ error: "Cart not found." }, { status: 404 });
    }
    const cartData = await cartRes.json();
    return NextResponse.json({ cart: cartData.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
