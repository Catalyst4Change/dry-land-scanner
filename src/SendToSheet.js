import { gapi } from "gapi-script";

export const sendScansToSheet = async (scannedData, setUserMessage, sheetID) => {
  if (!gapi.client) {
    setUserMessage("Google API not loaded!");
    return false;
  }


  const params = {
    spreadsheetId: sheetID,
    range: `Sheet1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
  };

  const valueRangeBody = {
    values: scannedData,
  };

  try {
    const response = await gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
    if (response.ok) {
      setUserMessage("Data sent successfully!");
    }
    return true;
  } catch (error) {
    const errorMessage = error.result?.error?.message || "Unknown error occurred";
    const errorStatus = error.result?.error?.status || "Unknown status";
    const errorDetails = error.result?.error?.details || [];

    console.error("Error sending data to sheet:", {
      message: errorMessage,
      status: errorStatus,
      details: errorDetails,
    });

    let userFriendlyMessage = "Error sending data to sheet.";
    if (errorMessage.includes("insufficient permissions")) {
      userFriendlyMessage += " Please check if you have the required permissions.";
    } else if (errorMessage.includes("invalid range")) {
      userFriendlyMessage += " The specified range is invalid.";
    } else if (errorMessage.includes("quota exceeded")) {
      userFriendlyMessage += " The quota has been exceeded. Please try again later.";
    }

    setUserMessage(userFriendlyMessage + " Error details: " + errorMessage);
    return false;
  }
};
