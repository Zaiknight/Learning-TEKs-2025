import { NextRequest, NextResponse } from "next/server";
const API_URL = process.env.API_BASE_URL;


type Order = {
    user_id ?: number;
    user_email : string;
    status ?: string;
    payment_method ?: string;
  };


  
export async function POST(req: NextRequest) {
    const order : Order = await req.json();
  
    try {
      const response = await fetch(`${API_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
  
      const data = await response.json().catch(() => ({}));
  
      if (!response.ok) {
        return NextResponse.json(
          { error: data?.error || data?.message},
          { status: response.status }
        );
      }
  
      return NextResponse.json(data, { status: 200 });
  
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Network Error" }, { status: 500 });
    }
  }