"use client";
import { ca } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";
import { useState } from "react";

const API_URL = process.env.API_BASE_URL;

const [user, setUser] = useState<{id:number ,name:string} | null>(null);

async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
  }
}

export async function GetCartID(req: NextRequest) {
  fetchUser();

  const user_id = user?.id;

  if(!user_id){

    return;
  }

  try {
    const CartResponse = await fetch(`${API_URL}/cart/${user_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (!CartResponse.ok) {
        return NextResponse.json({ error: "Cart ID Not found." }, { status: 404 });
      }
    
    const cart_data = await CartResponse.json();
    const cart_id = cart_data?.data.id;
    
    if (!cart_id) {
        return NextResponse.json({ error: "Cart ID Not found." }, { status: 404 });
      }   
    return cart_id;  
  } catch (error:any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

