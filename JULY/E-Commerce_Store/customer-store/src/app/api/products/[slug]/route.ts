import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = await context.params;

  try {
    // Fetch product by slug
    const prodRes = await fetch(`${API_BASE_URL}/products/name/${encodeURIComponent(slug)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!prodRes.ok) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const prodData = await prodRes.json();
    const prod = prodData?.data;
    if (!prod) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Build the product object with full image URL
    const product = {
      id: prod.id,
      category_id: prod.category_id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      slug: slugify(prod.name),
      stock: prod.stock,
      image_url: `${API_BASE_URL}/upload/${prod.img_name}`,
      created_at: prod.created_at,
      updated_at: prod.updated_at
    };

    return NextResponse.json({ product }, { status: 200 });
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