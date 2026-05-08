"use client";

import CreateFactorModal from "@/components/CreateFactorModal";
import DataTable, { ColumnConfig } from "@/components/DataTable";
import { CarbonEmissionFactor } from "@/types/carbon-emission-factor";
import { useEffect, useState } from "react";

// Column configuration

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    type: "number",
    cellClassName: "whitespace-nowrap text-sm text-gray-900",
  },
  {
    key: "name",
    label: "Name",
    type: "string",
    cellClassName: "whitespace-nowrap text-sm text-gray-900",
  },
  {
    key: "unit",
    label: "Unit",
    type: "string",
    cellClassName: "whitespace-nowrap text-sm text-gray-500",
  },
  {
    key: "emissionCO2eInKgPerUnit",
    label: "CO2e Emission (kg per unit)",
    type: "number",
    cellClassName: "whitespace-nowrap text-sm text-gray-900",
  },
  {
    key: "source",
    label: "Source",
    type: "string",
    cellClassName: "text-sm text-gray-500 max-w-xs",
  },
];

export default function Home() {
  const [factors, setFactors] = useState<CarbonEmissionFactor[]>([]);
  const [filteredFactors, setFilteredFactors] = useState<
    CarbonEmissionFactor[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sortField, setSortField] = useState<keyof CarbonEmissionFactor | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchCarbonFactors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/carbon-emission-factors");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CarbonEmissionFactor[] = await response.json();
        setFactors(data);
        setFilteredFactors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching carbon emission factors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarbonFactors();
  }, []);

  // Handle column header clicks
  const handleSort = (field: keyof CarbonEmissionFactor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Search and sort functionality
  useEffect(() => {
    let filtered = factors;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = factors.filter(
        (factor) =>
          factor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          factor.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
          factor.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle different data types
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredFactors(filtered);
  }, [searchQuery, factors, sortField, sortDirection]);

  const handleCreateFactor = async (formData: {
    name: string;
    unit: string;
    emissionCO2eInKgPerUnit: number;
    source: string;
  }) => {
    try {
      setCreating(true);
      const response = await fetch("/api/carbon-emission-factors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([formData]), // Backend expects an array
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the data
      const factorsResponse = await fetch("/api/carbon-emission-factors");
      if (factorsResponse.ok) {
        const data: CarbonEmissionFactor[] = await factorsResponse.json();
        setFactors(data);
        setFilteredFactors(data);
      }

      setShowForm(false);
    } catch (err) {
      console.error("Error creating carbon emission factor:", err);
      alert("Failed to create carbon emission factor. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-md bg-red-50 p-4 max-w-md">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <p className="text-red-600 text-sm mt-2">
              Make sure your backend is running on localhost:3000
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carbon Emission Factors
          </h1>
          <p className="text-gray-600">
            Explore carbon emission factors for various materials and activities
          </p>
        </div>

        {/* Search and Add Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search carbon factors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            Add Factor
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">
              Found{" "}
              <span className="font-semibold text-gray-900">
                {filteredFactors.length}
              </span>{" "}
              of {factors.length} carbon emission factors
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Create Factor Form Modal */}
        <CreateFactorModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateFactor}
          isCreating={creating}
        />

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredFactors.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No results found
              </h3>
              <p className="text-gray-500">
                No carbon emission factors match "{searchQuery}". Try a
                different search term.
              </p>
            </div>
          ) : factors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No carbon factors found
              </h3>
              <p className="text-gray-500">
                No carbon emission factors are currently available.
              </p>
            </div>
          ) : (
            <DataTable
              data={filteredFactors}
              columns={columns}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>
      </div>
    </div>
  );
}
