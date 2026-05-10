"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import IngredientForm from "@/components/IngredientForm";
import ProductResult from "@/components/ProductResult";
import {
  CreateProductRequest,
  ProductDetail,
  IngredientInput,
} from "@/types/product-carbon-footprint";

export default function CalculatePage() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: "", quantity: 0, unit: "kg" },
  ]);
  const [result, setResult] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError("Product name is required");
      return;
    }
    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() && ing.quantity > 0 && ing.unit.trim(),
    );
    if (validIngredients.length === 0) {
      setError("At least one valid ingredient is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload: CreateProductRequest = {
        name: productName.trim(),
        ingredients: validIngredients,
      };
      const res = await fetch("/api/product-carbon-footprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to calculate");
      }
      const data: ProductDetail = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 border-b border-gray-200 pb-3">
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Carbon Emission Factors
            </button>
          </div>
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calculate Carbon Footprint
          </h1>
          <p className="text-gray-600">
            Enter a product name and its ingredients. The system will match each
            ingredient to an emission factor (same name and unit) and compute
            total CO₂e.
          </p>
        </div>

        {/* Action Buttons Row (outside the form) */}
        <div className="mb-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/compare")}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            View Saved Products
          </button>
          <button
            type="submit"
            form="carbon-form"
            disabled={loading}
            className="cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate & Save"}
          </button>
        </div>

        {/* Form Card */}
        <form
          id="carbon-form"
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              placeholder="e.g., Ham Cheese Pizza"
              required
              suppressHydrationWarning
            />
          </div>

          {/* Dynamic Ingredient Form */}
          <IngredientForm ingredients={ingredients} onChange={setIngredients} />

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </form>

        {/* Result Display */}
        {result && <ProductResult product={result} />}
      </div>
    </div>
  );
}
