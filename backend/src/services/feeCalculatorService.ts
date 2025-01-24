import { 
    CalculatorInput, 
    CalculatorResponse, 
    FeeStructure 
  } from '../models/types';
  import { SpreadsheetService } from './spreadsheetService';
  
  export class FeeCalculatorService {
    private feeStructures: FeeStructure[] = [];
    private spreadsheetService: SpreadsheetService;
  
    constructor() {
      this.spreadsheetService = new SpreadsheetService();
    }
  
    async initialize() {
      this.feeStructures = await this.spreadsheetService.getFeeStructures();
    }
  
    private calculateReferralFee(category: string, price: number): number {
      const structure = this.feeStructures.find(f => f.category === category);
      if (!structure) throw new Error('Invalid category');
      return (price * structure.referralFeePercentage) / 100;
    }
  
    private calculateWeightHandlingFee(
      weight: number, 
      shippingMode: string, 
      serviceLevel: string
    ): number {
      const baseRate = shippingMode === 'FBA' ? 20 : 15;
      const serviceFactor = serviceLevel === 'Express' ? 1.5 : 1;
      return weight * baseRate * serviceFactor;
    }
  
    private calculateClosingFee(price: number, category: string): number {
      const structure = this.feeStructures.find(f => f.category === category);
      if (!structure) throw new Error('Invalid category');
      
      return price > structure.closingFeeThreshold 
        ? structure.baseClosingFee * 2 
        : structure.baseClosingFee;
    }
  
    private calculatePickAndPackFee(isFBA: boolean, productSize: string): number {
      if (!isFBA) return 0;
      return productSize === 'Standard' ? 20 : 40;
    }
  
    async calculateTotalFees(input: CalculatorInput): Promise<CalculatorResponse> {
      if (this.feeStructures.length === 0) {
        await this.initialize();
      }
  
      const referralFee = this.calculateReferralFee(
        input.productCategory, 
        input.sellingPrice
      );
  
      const weightHandlingFee = this.calculateWeightHandlingFee(
        input.weight,
        input.shippingMode,
        input.serviceLevel
      );
  
      const closingFee = this.calculateClosingFee(
        input.sellingPrice,
        input.productCategory
      );
  
      const pickAndPackFee = this.calculatePickAndPackFee(
        input.shippingMode === 'FBA',
        input.productSize
      );
  
      const totalFees = referralFee + weightHandlingFee + closingFee + pickAndPackFee;
      const netEarnings = input.sellingPrice - totalFees;
  
      return {
        breakdown: {
          referralFee,
          weightHandlingFee,
          closingFee,
          pickAndPackFee
        },
        totalFees,
        netEarnings
      };
    }
  }
  