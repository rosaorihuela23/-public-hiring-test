"use client";

import { CarbonEmissionFactor } from "@/types/carbon-emission-factor";

// Column configuration
export type ColumnConfig = {
  key: keyof CarbonEmissionFactor;
  label: string;
  type: "string" | "number";
  cellClassName: string;
};

interface DataTableProps {
  data: CarbonEmissionFactor[];
  columns: ColumnConfig[];
  sortField: keyof CarbonEmissionFactor | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof CarbonEmissionFactor) => void;
}

export default function DataTable({
  data,
  columns,
  sortField,
  sortDirection,
  onSort,
}: DataTableProps) {
  const renderCellContent = (item: CarbonEmissionFactor, column: ColumnConfig) => {
    const value = item[column.key];
    
    if (column.key === "emissionCO2eInKgPerUnit") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {value}
        </span>
      );
    }
    
    if (column.key === "name") {
      return <div className="text-sm font-medium text-gray-900">{value}</div>;
    }
    
    if (column.key === "source") {
      return (
        <div className="truncate" title={String(value)}>
          {value}
        </div>
      );
    }
    
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => onSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortField === column.key && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {sortDirection === "asc" ? (
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={`${item.id}-${column.key}`}
                  className={`px-6 py-4 ${column.cellClassName}`}
                >
                  {renderCellContent(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
