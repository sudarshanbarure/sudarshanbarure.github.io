// ═══════════════════════════════════════════════
// GOOGLE APPS SCRIPT — Contact Form Backend
// Paste this at: script.google.com → New Project
// ═══════════════════════════════════════════════

const SHEET_NAME = "Portfolio Contacts";
const OWNER_EMAIL = "ajaybarure@gmail.com"; // Change if needed

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Create sheet + header row on first run
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Name", "Phone", "Email", "Query"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#00d4ff");
    }

    // Append the submission
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name  || "",
      data.phone || "",
      data.email || "",
      data.query || "",
    ]);

    // Send email notification to owner
    const subject = `📩 New Portfolio Enquiry from ${data.name}`;
    const body = `
You have a new enquiry from your portfolio website.

─────────────────────────
Name    : ${data.name}
Phone   : ${data.phone}
Email   : ${data.email}
─────────────────────────
Message :
${data.query}
─────────────────────────
Submitted at: ${data.timestamp}

Reply directly to: ${data.email}
    `.trim();

    MailApp.sendEmail({
      to:      OWNER_EMAIL,
      subject: subject,
      body:    body,
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
