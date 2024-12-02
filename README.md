# Dryland Batch Scanner

Dryland Batch Scanner is a streamlined solution for inventory management at Dryland Distillery. It replaces paper records by scanning QR codes formatted to the distillery's product data, including product type, batch number, bottle size, quantity, and timestamp. 

This private, bespoke app integrates with Google Sheets to record inventory data and is designed for operational efficiency and accuracy.

## Features

- **QR Code Scanning**: Captures product details (e.g., spirit, batch number, bottle size, and quantity).  
- **Timestamp Logging**: Automatically adds a timestamp to every scan.  
- **Data Validation**: Ensures QR codes contain properly formatted data before saving.  
- **Google Sheets Integration**: Sends scanned data to a designated Google Sheet for management.  
- **Local Data Storage**: Retains scanned data locally for 24 hours for easy reference.  
- **Planned Enhancements**:  
  - Location tracking for scans (e.g., Main Street, Rick House).  
  - Vehicle mileage tracking for maintenance records.

---

## Tech Stack

- **Frontend**: React (Vite), SCSS, HTML  
- **Backend**: Google Sheets API  
- **Build Tools**: Webpack  
- **Deployment**: Firebase  
- **Primary Dependencies**:
  - google-api-javascript-client
  - gapi-script
  - react-qr-scanner

---

## Installation

To set up the project locally:

1. **Fork the repository**.  
2. **Install dependencies**: Run `npm install`.  
3. **Start the development server**: Run `npm start`.  
4. Ensure your Google Cloud project has the necessary APIs enabled and your Google account is safelisted.

---

## Usage

1. **Log in**: Users must log in using their safelisted Google account via Google OAuth.  
2. **Scan QR Code**: Once logged in, scan any QR code formatted for Dryland's products.  
3. **Confirm Quantity**: Validate and confirm the quantity for each scan.  
4. **Submit Data**: Use the `sendToSheet` function to save the data to the Google Sheet. Scanned data is retained locally for 24 hours for easy reference.

---

## Known Bugs

- **Login Issues**: Occasionally, users may be unable to log in. This may be caused by cache issues.  
- **Submission Errors**: Some users experience permission or scope errors when attempting to send scans to the Google Sheet.  

---

## Licensing & Contributions

This project is private and does not accept external contributions or licensing.

---

## Contact

For support or inquiries, please contact Dryland Distillery management directly.

---

Let me know if you'd like to tweak any section!
<!-- ## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a `Node.js` environment installed.
- You have access to `Google Sheets API` and `Firebase`. -->
