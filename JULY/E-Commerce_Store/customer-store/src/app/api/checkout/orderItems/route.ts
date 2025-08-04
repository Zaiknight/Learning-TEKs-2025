import { NextRequest, NextResponse } from "next/server";
const API_URL = process.env.API_BASE_URL;

type OrderItem = {
    order_id: number;
    product_id : number;
    quantity: number;
  }

  export async function POST(req: NextRequest) {
    const orderItem : OrderItem = await req.json();
  
    try {
      const response = await fetch(`${API_URL}/orderItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( orderItem ),
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