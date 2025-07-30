import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  const { first_name, last_name, email, password } = await req.json();

  if (!first_name) {
    return NextResponse.json({ error: "First Name is Required", validation_errors: { first_name: "First name is required" } }, { status: 400 });
  }
  if (!last_name) {
    return NextResponse.json({ error: "Last Name is Required", validation_errors: { last_name: "Last name is required" } }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Email is Required", validation_errors: { email: "Email is required" } }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "Password is Required", validation_errors: { password: "Password is required" } }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Convert error array (path/message) to object
      let validation_errors: Record<string, string> = {};
      if (Array.isArray(data?.validation_errors)) {
        for (const err of data.validation_errors) {
          if (Array.isArray(err.path) && err.path.length) {
            validation_errors[err.path[0]] = err.message;
          }
        }
      }
      return NextResponse.json(
        {
          error: data?.error || data?.message,
          validation_errors: Object.keys(validation_errors).length ? validation_errors : undefined,
        },
        { status: response.status }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Network Error" }, { status: 500 });
  }
}