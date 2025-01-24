export interface CalculatorInput {
    productCategory: string;
    sellingPrice: number;
    weight: number;
    shippingMode: 'EasyShip' | 'FBA';
    serviceLevel: 'Standard' | 'Express';
    productSize: 'Standard' | 'Oversize';
    location: 'Local' | 'National';
  }
  
  export interface FeeBreakdown {
    referralFee: number;
    weightHandlingFee: number;
    closingFee: number;
    pickAndPackFee: number;
  }
  
  export interface CalculatorResponse {
    breakdown: FeeBreakdown;
    totalFees: number;
    netEarnings: number;
  }
  
  export interface FeeStructure {
    category: string;
    referralFeePercentage: number;
    closingFeeThreshold: number;
    baseClosingFee: number;
  }
  