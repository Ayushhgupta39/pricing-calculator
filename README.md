# Amazon Fee Calculator
This repository is an assignment completed by Ayush Gupta for the position of Full Stack Developer Intern at letsthrive.ai

## Overview
A full-stack application that calculates various Amazon seller fees and profitability metrics. The application consists of a React frontend and Node.js/Express backend, integrated with Google Sheets for fee structure data.

## Features
- Real-time fee calculation
- Support for multiple product categories  
- Different shipping modes (FBA, Easy Ship, Self Ship, Seller Flex)
- Various service levels and locations
- Detailed fee breakdown
- Dynamic fee structure management via Google Sheets

## Tech Stack
- Frontend: React, TypeScript, TailwindCSS
- Backend: Node.js, Express, TypeScript 
- Data Storage: Google Sheets API
- State Management: React Hooks

## Project Structure
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PricingCalculator.tsx
│   │   ├── utils/
│   │   │   └── feeCalculator.ts
│   │   └── types/
│   │       └── index.ts
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── feeCalculatorService.ts
│   │   │   └── spreadsheetService.ts
│   │   ├── models/
│   │   │   └── types.ts
│   │   └── index.ts
│   └── package.json
└── README.md

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account
- Google Sheets API enabled

### Backend Setup
1. Clone the repository
git clone [repository-url]
cd [project-name]/backend

2. Install dependencies
npm install

3. Set up Google Sheets API
- Create a project in Google Cloud Console
- Enable Google Sheets API  
- Create service account credentials
- Download JSON key file
- Place the key file in `backend/keys/` directory

4. Configure environment variables
cp .env.example .env

Edit `.env` file with your configuration:
PORT=3000
GOOGLE_SHEETS_ID=your-spreadsheet-id
GOOGLE_APPLICATION_CREDENTIALS=./keys/your-credentials-file.json

5. Start the backend server
npm run dev

### Frontend Setup
1. Navigate to frontend directory
cd ../frontend

2. Install dependencies  
npm install

3. Configure API endpoint
Update `src/utils/feeCalculator.ts` with your backend URL if different from default.

4. Start the development server
npm run dev

## API Documentation

### Calculate Fees
Calculate seller fees and profitability metrics.

**Endpoint:** `POST /api/v1/profitability-calculator`

**Request Body:**
```bash
{
  productCategory: string;
  sellingPrice: number;
  weight: number;
  shippingMode: 'FBA' | 'Easy Ship' | 'Self Ship' | 'Seller Flex';
  serviceLevel: 'Standard' | 'Express';
  productSize: 'Standard' | 'Non-Standard';
  location: 'Local' | 'Regional' | 'National' | 'Special';
  volume?: number;
  shippingSpeed?: string;
}
```

**Response:**
```bash
{
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
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/profitability-calculator \
  -H "Content-Type: application/json" \
  -d '{
    "productCategory": "Books",
    "sellingPrice": 500,
    "weight": 500,
    "shippingMode": "FBA",
    "serviceLevel": "Standard", 
    "productSize": "Standard",
    "location": "Local"
  }'
  ```

## Fee Structure Management

### Google Sheets Structure
The fee structure is maintained in a Google Sheet with the following sheets:

#### 1. Referral Fees
| Field | Description |
|-------|-------------|
| Category | Product category |
| Price Range | Range of selling prices |
| Referral Fee Percentage | Percentage fee for the category |

#### 2. Closing Fees
| Field | Description |
|-------|-------------|
| Price Range | Range of selling prices |
| FBA Normal | Standard FBA closing fee |
| FBA Exception | Exception cases closing fee |
| Easy Ship | Easy Ship closing fee |
| Self Ship | Self Ship closing fee |
| Seller Flex | Seller Flex closing fee |

#### 3. Weight Handling Fees
| Field | Description |
|-------|-------------|
| Weight Range | Range of product weight |
| Local | Fee for local shipping |
| Regional | Fee for regional shipping |
| National | Fee for national shipping |
| Special Regions | Fee for special regions |

#### 4. Other Fees
| Field | Description |
|-------|-------------|
| Fee Type | Type of additional fee |
| Applicable On | Conditions for fee application |
| Value | Fee amount or percentage |
| Description | Additional details |

## Recent Changes

### Backend Changes
1. Implemented FeeCalculatorService
   - Added dynamic fee calculation based on Google Sheets data
   - Improved error handling and validation
   - Added support for different shipping modes and service levels

2. Created SpreadsheetService
   - Integrated Google Sheets API
   - Added caching mechanism for fee structures
   - Implemented error handling for API calls

### Frontend Changes  
1. Updated PricingCalculator component
   - Added loading states
   - Improved error handling
   - Enhanced UI/UX with better feedback
   - Added validation for input fields

2. Created fee calculator utility
   - Added API integration
   - Implemented proper typing
   - Added currency formatting
   - Added loading and error state management

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API Connection Issues | Ensure backend server is running and CORS is properly configured |
| Google Sheets API Errors | Verify credentials and API enablement in Google Cloud Console |
| Calculation Errors | Check fee structure in Google Sheets for accuracy |

## Future Improvements
- [ ] Add user authentication 
- [ ] Implement caching for fee structures
- [ ] Add bulk calculation feature
- [ ] Create historical calculation storage
- [ ] Add reporting and analytics features
