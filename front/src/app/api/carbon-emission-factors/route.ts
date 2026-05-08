import { NextRequest, NextResponse } from "next/server";
import {
  CarbonEmissionFactor,
  CreateCarbonEmissionFactorDto,
} from "@/types/carbon-emission-factor";

export async function GET() {
  try {
    // Proxy the request to the backend API
    const response = await fetch(
      "http://localhost:3000/carbon-emission-factors",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const data: CarbonEmissionFactor[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching carbon emission factors:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch carbon emission factors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCarbonEmissionFactorDto[] = await request.json();

    // Proxy the request to the backend API
    const response = await fetch(
      "http://localhost:3000/carbon-emission-factors",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const data: CarbonEmissionFactor[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating carbon emission factors:", error);
    return NextResponse.json(
      {
        error: "Failed to create carbon emission factors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
