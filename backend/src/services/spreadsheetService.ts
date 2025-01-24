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

      const [
        referralFeesResponse,
        closingFeesResponse,
        weightFeesResponse,
        otherFeesResponse,
      ] = await Promise.all([
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

      const referralRows = referralFeesResponse.data.values || [];
      const closingRows = closingFeesResponse.data.values || [];
      const weightRows = weightFeesResponse.data.values || [];
      const otherRows = otherFeesResponse.data.values || [];

      // Combine data from all sheets with explicit type annotations
      const combinedFeeStructures: FeeStructure[] = [
        // Referral Fees
        ...referralRows.slice(1).map(
          (row): FeeStructure => ({
            category: row[0],
            priceRange: row[1],
            referralFeePercentage: row[2],
            sheetType: "referral" as const,
          })
        ),

        // Closing Fees
        ...closingRows.slice(1).map(
          (row): FeeStructure => ({
            priceRange: row[0],
            fbaNormal: row[1],
            fbaException: row[2],
            easyShip: row[3],
            selfShip: row[4],
            sellerFlex: row[5],
            sheetType: "closing" as const,
          })
        ),

        // Weight Handling Fees
        ...weightRows.slice(1).map(
          (row): FeeStructure => ({
            weightRange: row[0],
            local: row[1],
            regional: row[2],
            national: row[3],
            specialRegions: row[4],
            sheetType: "weight" as const,
          })
        ),

        // Other Fees
        ...otherRows.slice(1).map(
          (row): FeeStructure => ({
            feeType: row[0],
            applicableOn: row[1],
            value: row[2],
            description: row[3],
            sheetType: "other" as const,
          })
        ),
      ];

      return combinedFeeStructures;
    } catch (error: any) {
      console.error("Error fetching fee structures:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
      throw new Error("Failed to fetch fee structures");
    }
  }

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

  private async getSheetData(sheetName: string) {
    const sheets = google.sheets({ version: "v4", auth: this.auth });
    return sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `'${sheetName}'!A1:Z1000`,
    });
  }
}
