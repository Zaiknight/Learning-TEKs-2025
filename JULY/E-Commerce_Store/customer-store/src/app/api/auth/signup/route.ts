import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  const {first_name, last_name, email, password} = await req.json();

  if (!first_name){
    return NextResponse.json({error: "First Name is Required"}, {status:400})
  }

  if (!last_name){
    return NextResponse.json({error: "Last Name is Required"}, {status:400})
  }

  if (!email){
    return NextResponse.json({error: "Email is Required"}, {status:400})
  }

  if(!password){
    return NextResponse.json({error:"Password is Required"}, {status: 400})
  }

  try {
    const response = await fetch(`${API_URL}/users`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ first_name, last_name, email, password}),
    });
    const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return NextResponse.json({
          error: data?.error || data?.message,
          validation_errors: data?.validation_errors || undefined
        },
        {status: response.status}
      );
      }
      return data;
    
  } catch (error :any) {
    return NextResponse.json({ error: error.message || "Network Error" }, { status: 500 });
  }
}
