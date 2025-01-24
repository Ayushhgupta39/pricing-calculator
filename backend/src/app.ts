import express from "express";
import cors from "cors";
import { calculateProfitability } from "./controllers/calculatorController";
import { errorHandler } from "./utils/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "This port serves as the backend for Amazon Pricing Calculator.",
  });
});
app.post("/api/v1/profitability-calculator", calculateProfitability);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
