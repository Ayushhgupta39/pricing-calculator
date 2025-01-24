import { Request, Response } from 'express';
import { FeeCalculatorService } from '../services/feeCalculatorService';
import { CalculatorInput } from '../models/types';
import { CustomError } from '../utils/errorHandler';

const calculatorService = new FeeCalculatorService();

export const calculateProfitability = async (req: Request, res: Response) => {
  try {
    const input: CalculatorInput = req.body;

    // Input validation
    if (!input.productCategory || !input.sellingPrice || !input.weight) {
      throw new CustomError(400, 'Missing required fields');
    }

    if (input.sellingPrice <= 0 || input.weight <= 0) {
      throw new CustomError(400, 'Invalid price or weight values');
    }

    const result = await calculatorService.calculateTotalFees(input);
    res.json(result);
  } catch (error) {
    console.error(error)
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
