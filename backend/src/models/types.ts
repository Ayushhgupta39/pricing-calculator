export interface FeeStructure {
  sheetType: 'referral' | 'closing' | 'weight' | 'other';
  category?: string;
  priceRange?: string;
  referralFeePercentage?: string;
  
  // Closing Fee specific fields
  fbaNormal?: string;
  fbaException?: string;
  easyShip?: string;
  selfShip?: string;
  sellerFlex?: string;
  
  // Weight Handling Fee specific fields
  weightRange?: string;
  local?: string;
  regional?: string;
  national?: string;
  specialRegions?: string;
  
  // Other Fee specific fields
  feeType?: string;
  applicableOn?: string;
  value?: string;
  description?: string;
}

export interface CalculatorInput {
  productCategory: string;
  sellingPrice: number;
  weight: number;
  shippingMode: 'FBA' | 'Easy Ship' | 'Self Ship' | 'Seller Flex';
  serviceLevel: 'Standard' | 'Express';
  productSize: 'Standard' | 'Non-Standard';
  location: 'Local' | 'Regional' | 'National' | 'Special';
  volume: any;
  shippingSpeed: any
}

export interface CalculatorResponse {
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
