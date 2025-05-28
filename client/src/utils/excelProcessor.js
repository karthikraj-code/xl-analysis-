import * as XLSX from 'xlsx';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

export function validateFile(file) {
  if (!file) {
    throw new Error("File is required.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Max file size is 5MB.");
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Only .xls, .xlsx, and .csv files are accepted.");
  }
  return true;
}

export async function parseExcelFile(file) {
  try {
    validateFile(file);
    
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });

    if (!jsonData || jsonData.length === 0) {
      throw new Error("The Excel file is empty or could not be read.");
    }

    const headers = jsonData[0];
    const rows = jsonData.slice(1).map((rowArray) => {
      const rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = rowArray[index];
      });
      return rowObject;
    });

    // Filter out empty rows
    const filteredRows = rows.filter(row => 
      Object.values(row).some(value => value !== null && value !== undefined && value !== "")
    );

    return {
      headers,
      rows: filteredRows,
      fileName: file.name
    };
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw error;
  }
} 