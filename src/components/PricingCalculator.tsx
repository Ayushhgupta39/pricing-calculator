import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { formatCurrency, useFeeCalculator } from "../utils/feeCalculators";

const categories = [
  "Automotive - Helmets & Riding Gloves",
  "Automotive - Tyres & Rims",
  "Automotive Vehicles",
  "Baby - Hardlines",
  "Baby - Strollers",
  "Baby - Diapers",
  "Books",
];

export default function PricingCalculator() {
  const { calculateFees, loading, error } = useFeeCalculator();
  const [formData, setFormData] = useState({
    productCategory: categories[0],
    sellingPrice: 0,
    weight: 0.5,
    shippingMode: "FBA" as const,
    serviceLevel: "Standard" as const,
    productSize: "Standard" as const,
    location: "Local" as const,
  });

  const [results, setResults] = useState<{
    breakdown: {
      referralFee: number;
      weightHandlingFee: number;
      closingFee: number;
      pickAndPackFee: number;
      storageFee: number;
      removalFee: number;
    };
    totalFees: number;
    netEarnings: number;
  } | null>(null);

  const handleCalculate = async () => {
    const result = await calculateFees(formData);
    if (result) {
      setResults(result);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sellingPrice" || name === "weight"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Amazon Pricing Calculator
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Mode
                </label>
                <select
                  name="shippingMode"
                  value={formData.shippingMode}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="FBA">FBA</option>
                  <option value="Easy Ship">Easy Ship</option>
                  <option value="Self Ship">Self Ship</option>
                  <option value="Seller Flex">Seller Flex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Level
                </label>
                <select
                  name="serviceLevel"
                  value={formData.serviceLevel}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Size
                  </label>
                  <select
                    name="productSize"
                    value={formData.productSize}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Non-Standard">Non-Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Local">Local</option>
                    <option value="Regional">Regional</option>
                    <option value="National">National</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  "Calculate Fees"
                )}
              </button>
            </div>

            {/* Results Section */}
            {results && (
              <div className="bg-gray-50 rounded-lg p-6 h-fit">
                <h2 className="text-lg font-semibold mb-4">Fee Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referral Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(results.breakdown.referralFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight Handling Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(results.breakdown.weightHandlingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Closing Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(results.breakdown.closingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pick & Pack Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(results.breakdown.pickAndPackFee)}
                    </span>
                  </div>
                  {results.breakdown.storageFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage Fee:</span>
                      <span className="font-medium">
                        {formatCurrency(results.breakdown.storageFee)}
                      </span>
                    </div>
                  )}
                  {results.breakdown.removalFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Removal Fee:</span>
                      <span className="font-medium">
                        {formatCurrency(results.breakdown.removalFee)}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Fees:</span>
                    <span className="text-blue-600">
                      {formatCurrency(results.totalFees)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Net Earnings:</span>
                    <span className="text-green-600">
                      {formatCurrency(results.netEarnings)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
