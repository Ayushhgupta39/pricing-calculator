// feeCalculator.ts

import { useState } from "react";

interface CalculatorInput {
  productCategory: string;
  sellingPrice: number;
  weight: number;
  shippingMode: "FBA" | "Easy Ship" | "Self Ship" | "Seller Flex";
  serviceLevel: "Standard" | "Express";
  productSize: "Standard" | "Non-Standard";
  location: "Local" | "Regional" | "National" | "Special";
  volume?: number;
  shippingSpeed?: string;
}

interface CalculatorResponse {
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
}

export const calculateFees = async (
  input: CalculatorInput
): Promise<CalculatorResponse> => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/profitability-calculator",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to calculate fees");
    }

    const data = await response.json();
    return {
      breakdown: {
        referralFee: Number(data.breakdown.referralFee),
        weightHandlingFee: Number(data.breakdown.weightHandlingFee),
        closingFee: Number(data.breakdown.closingFee),
        pickAndPackFee: Number(data.breakdown.pickAndPackFee),
        storageFee: Number(data.breakdown.storageFee || 0),
        removalFee: Number(data.breakdown.removalFee || 0),
      },
      totalFees: Number(data.totalFees),
      netEarnings: Number(data.netEarnings),
    };
  } catch (error) {
    console.error("Error calculating fees:", error);
    throw error;
  }
};

export const useFeeCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateFeesWithState = async (
    input: CalculatorInput
  ): Promise<CalculatorResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await calculateFees(input);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
      return null;
    }
  };

  return {
    calculateFees: calculateFeesWithState,
    loading,
    error,
  };
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};
