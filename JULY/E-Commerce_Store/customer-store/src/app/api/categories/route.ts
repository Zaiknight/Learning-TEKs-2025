import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }

    const result = await response.json();
    const rawCategories = Array.isArray(result) ? result : result.data || [];

    const categories = rawCategories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      active: cat.active,
      slug: cat.slug || slugify(cat.name), 
      image_url: `${API_URL}/upload/${cat.img_name}`,
    }));

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}