"use client";

import { ProductDetail } from "@/types/product-carbon-footprint";

interface ProductResultProps {
  product: ProductDetail;
}

export default function ProductResult({ product }: ProductResultProps) {
  const total = product.totalFootprintKgCO2e;
  const hasMissing = product.ingredients.some(
    (ing) => ing.footprintKgCO2e === null,
  );

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Calculation Result
      </h3>
      <p>
        <strong>Product:</strong> {product.name}
      </p>
      <p>
        <strong>Total CO₂e footprint:</strong>{" "}
        {total !== null
          ? `${total.toFixed(3)} kg CO₂e`
          : "Incomplete - missing emission factors"}
      </p>
      {hasMissing && (
        <p className="text-amber-600 text-sm mt-1">
          ⚠️ Some ingredients have no matching emission factors. Total footprint
          is null.
        </p>
      )}

      <div className="mt-4">
        <h4 className="font-medium">Ingredient breakdown:</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full mt-2 text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left py-2 px-3">Ingredient</th>
                <th className="text-left py-2 px-3">Quantity</th>
                <th className="text-left py-2 px-3">Unit</th>
                <th className="text-left py-2 px-3">Footprint (kg CO₂e)</th>
                <th className="text-left py-2 px-3">Emission factor used</th>
              </tr>
            </thead>
            <tbody>
              {product.ingredients.map((ing, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3 font-medium">{ing.name}</td>
                  <td className="py-2 px-3">{ing.quantity}</td>
                  <td className="py-2 px-3">{ing.unit}</td>
                  <td className="py-2 px-3">
                    {ing.footprintKgCO2e !== null
                      ? ing.footprintKgCO2e.toFixed(3)
                      : "❌ Missing"}
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-500">
                    {ing.emissionFactorUsed
                      ? `${ing.emissionFactorUsed.name} (${ing.emissionFactorUsed.source})`
                      : "None"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasMissing && (
        <p className="text-xs text-gray-500 mt-3">
          * Missing factors mean the ingredient was not found in the emission
          factors database (name and unit must match exactly).
        </p>
      )}
    </div>
  );
}
