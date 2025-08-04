import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL;
type UserAddress = {
    user_id ?: string;
    address_1 : string;
    address_2 ?: string;
    province : string;
    country : string;
    contact : string;
    user_email : string;
  };


export async function POST(req: NextRequest) {
    const userAddress : UserAddress = await req.json();
  
    try {
      const response = await fetch(`${API_URL}/userAddress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( userAddress ),
      });
      
      console.log(response)
      const data = await response.json().catch(() => ({}));
  
      if (!response.ok) {
        return NextResponse.json(
          { error: data?.error || data?.message},
          { status: response.status }
        );
      }
  
      return NextResponse.json(data, { status: 200 });
  
    } catch (error: any) {
      console.log(error)
      return NextResponse.json({ error: error.message || "Network Error" }, { status: 500 });
    }
  }
  