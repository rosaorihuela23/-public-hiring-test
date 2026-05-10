"use client";

import { IngredientInput } from "@/types/product-carbon-footprint";

interface IngredientFormProps {
  ingredients: IngredientInput[];
  onChange: (ingredients: IngredientInput[]) => void;
}

export default function IngredientForm({
  ingredients,
  onChange,
}: IngredientFormProps) {
  const addIngredient = () => {
    onChange([...ingredients, { name: "", quantity: 0, unit: "kg" }]);
  };

  const updateIngredient = (
    index: number,
    field: keyof IngredientInput,
    value: string | number,
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Ingredients
        </label>
        <button
          type="button"
          onClick={addIngredient}
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Ingredient
        </button>
      </div>

      {ingredients.length === 0 && (
        <p className="text-sm text-gray-500">No ingredients added yet.</p>
      )}

      {ingredients.map((ing, idx) => (
        <div key={idx} className="flex flex-wrap gap-3 items-end pb-3">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs text-gray-500">Name</label>
            <input
              type="text"
              value={ing.name}
              onChange={(e) => updateIngredient(idx, "name", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              placeholder="e.g., ham"
              required
            />
          </div>
          <div className="w-24">
            <label className="block text-xs text-gray-500">Quantity</label>
            <input
              type="number"
              step="any"
              value={ing.quantity}
              onChange={(e) =>
                updateIngredient(
                  idx,
                  "quantity",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              required
              min="0"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs text-gray-500">Unit</label>
            <input
              type="text"
              value={ing.unit}
              onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              placeholder="kg"
              required
            />
          </div>
          <button
            type="button"
            onClick={() => removeIngredient(idx)}
            className="cursor-pointer text-red-600 hover:text-red-800 text-sm mb-1"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
