import { google } from "googleapis";
import { FeeStructure } from "../models/types";
import path from "path";

export class SpreadsheetService {
  private readonly spreadsheetId =
    "1o_yM63Grl_QB6lpuXE3spbrMeCs-hIMXCVyghj8FmV0";
  private readonly auth;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: path.join(
        __dirname,
        "../../keys/citric-aleph-448805-f2-e6be6f941f08.json"
      ),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  }

  async getFeeStructures(): Promise<FeeStructure[]> {
    try {
      const sheets = google.sheets({ version: "v4", auth: this.auth });

      // Request data from multiple sheets simultaneously
      const [referralFeesResponse, closingFeesResponse] = await Promise.all([
        sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "'Referral fees'",
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "'Closing fees'",
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "'Weight handling fees'",
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "'Other Fees'",
        }),
      ]);

      console.log("Referral Fees:", referralFeesResponse.data);
      console.log("Closing Fees:", closingFeesResponse.data);

      const referralRows = referralFeesResponse.data.values || [];
      const closingRows = closingFeesResponse.data.values || [];

      // Combine data from both sheets
      const combinedFeeStructures = [
        ...referralRows.map((row) => ({
          category: row[0],
          referralFeePercentage: parseFloat(row[1]),
          closingFeeThreshold: parseFloat(row[2]),
          baseClosingFee: parseFloat(row[3]),
          sheetType: "referral",
        })),
        ...closingRows.map((row) => ({
          category: row[0],
          referralFeePercentage: parseFloat(row[1]),
          closingFeeThreshold: parseFloat(row[2]),
          baseClosingFee: parseFloat(row[3]),
          sheetType: "closing",
        })),
      ];

      return combinedFeeStructures;
    } catch (error) {
      console.error("Error fetching fee structures:", error);
      throw new Error("Failed to fetch fee structures");
    }
  }

  // Helper method to get all sheet names (useful for debugging)
  async getSheetNames(): Promise<string[]> {
    try {
      const sheets = google.sheets({ version: "v4", auth: this.auth });
      const response = await sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      return (
        response.data.sheets?.map((sheet) => sheet.properties?.title || "") ||
        []
      );
    } catch (error) {
      console.error("Error fetching sheet names:", error);
      throw new Error("Failed to fetch sheet names");
    }
  }

  // Helper method to get data from a specific sheet
  private async getSheetData(sheetName: string) {
    const sheets = google.sheets({ version: "v4", auth: this.auth });
    return sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `'${sheetName}'!A2:D`,
    });
  }
}
