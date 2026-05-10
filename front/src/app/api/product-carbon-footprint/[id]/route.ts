import { NextRequest, NextResponse } from "next/server";
import { ProductDetail } from "@/types/product-carbon-footprint";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const response = await fetch(
      `${BACKEND_URL}/product-carbon-footprint/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const data: ProductDetail = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
