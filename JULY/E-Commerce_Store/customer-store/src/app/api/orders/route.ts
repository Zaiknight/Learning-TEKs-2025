import { NextRequest, NextResponse } from "next/server";
const API_URL = process.env.API_BASE_URL;

export async function GET(req: NextRequest) {
  // Get email from query string
  const order_email = req.nextUrl.searchParams.get("email");

  if (!order_email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${API_URL}/order/${encodeURIComponent(order_email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Network Error" },
      { status: 500 }
    );
  }
}