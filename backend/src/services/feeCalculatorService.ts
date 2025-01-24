import {
  CalculatorInput,
  CalculatorResponse,
  FeeStructure,
} from "../types/types";
import { SpreadsheetService } from "./spreadsheetService";

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
    const structure = this.feeStructures
      .filter((f) => f.sheetType === "referral")
      .find((f) => f.category === category);

    if (!structure || !structure.referralFeePercentage) {
      throw new Error("Invalid category or missing referral fee percentage");
    }

    // Convert percentage string to number and remove % if present
    const percentage = parseFloat(
      structure.referralFeePercentage.toString().replace("%", "")
    );
    return (price * percentage) / 100;
  }

  private calculateWeightHandlingFee(
    weight: number,
    shippingMode: string,
    serviceLevel: string,
    location: string
  ): number {
    const structure = this.feeStructures
      .filter((f) => f.sheetType === "weight")
      .find((f) => {
        if (!f.weightRange) return false;
        return (
          f.weightRange.includes(shippingMode) &&
          f.weightRange.includes(
            weight <= 12000 ? "Standard Size" : "Heavy & Bulky"
          )
        );
      });

    if (!structure) {
      throw new Error(
        `No weight handling fee structure found for mode: ${shippingMode}`
      );
    }

    switch (location.toLowerCase()) {
      case "local":
        return parseFloat(structure.local?.toString() || "0");
      case "regional":
        return parseFloat(structure.regional?.toString() || "0");
      case "national":
        return parseFloat(structure.national?.toString() || "0");
      case "special":
        return parseFloat(structure.specialRegions?.toString() || "0");
      default:
        throw new Error(`Invalid location: ${location}`);
    }
  }

  private calculateClosingFee(price: number, shippingMode: string): number {
    const structure = this.feeStructures
      .filter((f) => f.sheetType === "closing")
      .find((f) => {
        if (!f.priceRange) return false;
        const [min, max] = f.priceRange.split("-").map(Number);
        return price >= min && price <= max;
      });

    if (!structure) {
      throw new Error(`No closing fee structure found for price: ${price}`);
    }

    switch (shippingMode) {
      case "FBA":
        return parseFloat(structure.fbaNormal?.toString() || "0");
      case "Easy Ship":
        return parseFloat(structure.easyShip?.toString() || "0");
      case "Self Ship":
        return parseFloat(structure.selfShip?.toString() || "0");
      case "Seller Flex":
        return parseFloat(structure.sellerFlex?.toString() || "0");
      default:
        throw new Error(`Invalid shipping mode: ${shippingMode}`);
    }
  }

  private calculatePickAndPackFee(productSize: string): number {
    const structures = this.feeStructures.filter(
      (f) => f.sheetType === "other" && f.feeType === "Pick & Pack Fee"
    );

    let structure: FeeStructure | undefined;

    if (productSize === "Standard") {
      structure = structures.find((f) => f.applicableOn === "Standard Size");
    } else {
      structure = structures.find(
        (f) => f.applicableOn === "Oversize/Heavy & Bulky"
      );
    }

    if (!structure || !structure.value) {
      throw new Error(`No pick and pack fee found for size: ${productSize}`);
    }

    // Remove '₹' symbol if present and convert to number
    return parseFloat(structure.value.toString().replace("₹", ""));
  }

  private calculateStorageFee(productSize: string, volume: number): number {
    const structure = this.feeStructures
      .filter((f) => f.sheetType === "other" && f.feeType === "Storage Fee")
      .find((f) => f.applicableOn === "All Categories");

    if (!structure || !structure.value) {
      throw new Error("No storage fee structure found");
    }

    // Remove '₹' symbol and 'per cubic foot per month' text, then convert to number
    const ratePerCubicFoot = parseFloat(
      structure.value.toString().replace("₹", "").split(" ")[0]
    );
    return ratePerCubicFoot * volume;
  }

  private calculateRemovalFee(
    productSize: string,
    shippingSpeed: string
  ): number {
    const structures = this.feeStructures.filter(
      (f) => f.sheetType === "other" && f.feeType === "Removal Fees"
    );

    let structure: FeeStructure | undefined;

    if (productSize === "Standard") {
      structure = structures.find(
        (f) => f.applicableOn === `Standard Size - ${shippingSpeed} Shipping`
      );
    } else {
      structure = structures.find(
        (f) => f.applicableOn === `Heavy & Bulky - ${shippingSpeed} Shipping`
      );
    }

    if (!structure || !structure.value) {
      throw new Error(
        `No removal fee found for size: ${productSize} and shipping speed: ${shippingSpeed}`
      );
    }

    // Remove '₹' symbol and convert to number
    return parseFloat(structure.value.toString().replace("₹", ""));
  }

  async calculateTotalFees(
    input: CalculatorInput
  ): Promise<CalculatorResponse> {
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
      input.serviceLevel,
      input.location
    );

    const closingFee = this.calculateClosingFee(
      input.sellingPrice,
      input.shippingMode
    );

    const pickAndPackFee = this.calculatePickAndPackFee(input.productSize);

    // Calculate storage fee if volume is provided
    const storageFee = input.volume
      ? this.calculateStorageFee(input.productSize, input.volume)
      : 0;

    // Calculate removal fee if shipping speed is provided
    const removalFee = input.shippingSpeed
      ? this.calculateRemovalFee(input.productSize, input.shippingSpeed)
      : 0;

    const totalFees =
      referralFee +
      weightHandlingFee +
      closingFee +
      pickAndPackFee +
      storageFee +
      removalFee;
    const netEarnings = input.sellingPrice - totalFees;

    return {
      breakdown: {
        referralFee,
        weightHandlingFee,
        closingFee,
        pickAndPackFee,
        storageFee,
        removalFee,
      },
      totalFees,
      netEarnings,
    };
  }
}
