import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = await context.params;

  try {
    // Fetch category by slug
    const catRes = await fetch(`${API_BASE_URL}/categories/name/${encodeURIComponent(slug)}`, {
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

    // Fetch products by category ID
    const productsRes = await fetch(`${API_BASE_URL}/products/categoryId/${encodeURIComponent(category.id)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    let products: any[] = [];
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      // Normalize single product or array of products
      let rawProducts = [];
      if (productsData && productsData.data) {
        if (Array.isArray(productsData.data)) {
          rawProducts = productsData.data;
        } else {
          rawProducts = [productsData.data];
        }
      }
      products = rawProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: slugify(p.name),
        price: p.price,
        image_url: `${API_BASE_URL}/upload/${p.img_name}`,
      }));
    }

    return NextResponse.json({ category, products }, { status: 200 });
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
    .replace(/(^-|-$)+/g, "");
}