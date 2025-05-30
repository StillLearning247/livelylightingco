// import { GoogleSpreadsheet } from "google-spreadsheet";

// const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
// const CLIENT_EMAIL = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
// const PRIVATE_KEY = import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(
//   /\\n/g,
//   "\n"
// );

// if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
//   throw new Error("Missing required Google Sheets environment variables");
// }

// export async function appendToSheet(data: {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   message?: string;
// }) {
//   try {
//     const doc = new GoogleSpreadsheet(SHEET_ID);

//     await doc.useServiceAccountAuth({
//       client_email: CLIENT_EMAIL,
//       private_key: PRIVATE_KEY,
//     });

//     await doc.loadInfo();
//     const sheet = doc.sheetsByIndex[0];

//     await sheet.addRow({
//       "First Name": data.firstName,
//       "Last Name": data.lastName,
//       Email: data.email,
//       Phone: data.phone,
//       Message: data.message || "",
//       Date: new Date().toISOString(),
//     });

//     return true;
//   } catch (error) {
//     console.error("Error appending to Google Sheet:", error);
//     return false;
//   }
// }
