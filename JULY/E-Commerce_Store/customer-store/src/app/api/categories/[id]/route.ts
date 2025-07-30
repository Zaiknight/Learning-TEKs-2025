import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

export async function GET(
    req: NextRequest,
    context: { params: { slug: string } }
  ) {
    const { slug } = await context.params;
  
    try {
      // Fetch category by slug
      const catRes = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(slug)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!catRes.ok) {
        return NextResponse.json({ error: "Category Not found." }, { status: 404 });
      }
      const catData = await catRes.json();
      const cat = catData?.data;
      if (!cat) {
        return NextResponse.json({ error: "Category Not found." }, { status: 404 });
      }
  
      // Build the category object
      const category = {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        slug: slugify(cat.name),
        image_url: `${API_BASE_URL}/upload/${cat.img_name}`,
      };
      return NextResponse.json({ category }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$||)+/g, "");
}