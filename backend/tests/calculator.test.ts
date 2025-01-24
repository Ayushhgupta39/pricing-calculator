import { FeeCalculatorService } from "../src/services/feeCalculatorService";
import { CalculatorInput } from "../src/types/types";

describe("FeeCalculatorService", () => {
  let calculatorService: FeeCalculatorService;

  beforeEach(() => {
    calculatorService = new FeeCalculatorService();
  });

  test("should calculate fees correctly for standard product", async () => {
    const input: CalculatorInput = {
      productCategory: "Electronics",
      sellingPrice: 1000,
      weight: 1,
      shippingMode: "EasyShip",
      serviceLevel: "Standard",
      productSize: "Standard",
      location: "Local",
    };

    const result = await calculatorService.calculateTotalFees(input);

    expect(result.breakdown).toBeDefined();
    expect(result.totalFees).toBeGreaterThan(0);
    expect(result.netEarnings).toBeLessThan(input.sellingPrice);
  });
});
