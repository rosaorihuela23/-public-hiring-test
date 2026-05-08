"use client";

import { CreateCarbonEmissionFactorDto } from "@/types/carbon-emission-factor";

// Form field configuration
type FormFieldConfig = {
  name: keyof CreateCarbonEmissionFactorDto;
  label: string;
  type: "text" | "number" | "textarea";
  placeholder: string;
  required: boolean;
  step?: string;
  min?: string;
  rows?: number;
};

const formFields: FormFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "e.g., Steel Production",
    required: true,
  },
  {
    name: "unit",
    label: "Unit",
    type: "text",
    placeholder: "e.g., kg, ton, liter",
    required: true,
  },
  {
    name: "emissionCO2eInKgPerUnit",
    label: "CO2e Emission (kg per unit)",
    type: "number",
    placeholder: "e.g., 2.5",
    required: true,
    step: "0.01",
    min: "0",
  },
  {
    name: "source",
    label: "Source",
    type: "textarea",
    placeholder: "e.g., EPA Database 2023",
    required: true,
    rows: 3,
  },
];

interface CreateFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCarbonEmissionFactorDto) => Promise<void>;
  isCreating: boolean;
}

export default function CreateFactorModal({
  isOpen,
  onClose,
  onSubmit,
  isCreating,
}: CreateFactorModalProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Dynamically build the data object based on form fields configuration
    const data = formFields.reduce((acc, field) => {
      const value = formData.get(field.name) as string;

      if (field.type === "number") {
        (acc as any)[field.name] = parseFloat(value);
      } else {
        (acc as any)[field.name] = value;
      }

      return acc;
    }, {} as CreateCarbonEmissionFactorDto);

    await onSubmit(data);
  };

  const renderFormField = (field: FormFieldConfig) => {
    const baseClassName =
      "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm !text-black font-semibold px-3 py-2";

    return (
      <div key={field.name}>
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700"
        >
          {field.label}
        </label>
        {field.type === "textarea" ? (
          <textarea
            name={field.name}
            id={field.name}
            required={field.required}
            rows={field.rows}
            className={baseClassName}
            placeholder={field.placeholder}
          />
        ) : (
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            required={field.required}
            step={field.step}
            min={field.min}
            className={baseClassName}
            placeholder={field.placeholder}
          />
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Add New Carbon Emission Factor
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map(renderFormField)}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Factor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
