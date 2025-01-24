import { Request, Response, NextFunction } from 'express';

export class CustomError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      status: 'error',
      statusCode: error.statusCode,
      message: error.message
    });
  }

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal server error'
  });
};
