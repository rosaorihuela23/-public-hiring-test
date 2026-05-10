import { NextRequest, NextResponse } from "next/server";
import {
  CreateProductRequest,
  ProductDetail,
  ProductSummary,
} from "@/types/product-carbon-footprint";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function GET() {
  try {
    const response = await fetch(
      "http://localhost:3000/product-carbon-footprint",
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Backend not available" },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const body: CreateProductRequest = await request.json();

  try {
    const response = await fetch(
      "http://localhost:3000/product-carbon-footprint",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Backend not available" },
      { status: 503 },
    );
  }
}
