// ═══════════════════════════════════════════════
// GOOGLE APPS SCRIPT — Contact Form Backend
// Paste this at: script.google.com → New Project
// ═══════════════════════════════════════════════

const SHEET_NAME = "Portfolio Contacts";
const OWNER_EMAIL = "ajaybarure@gmail.com"; // Change if needed

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Debug log
    Logger.log("Data: " + JSON.stringify(e.parameter));

    sheet.appendRow([
      new Date(),
      e.parameter.name,
      e.parameter.phone,
      e.parameter.email,
      e.parameter.query
    ]);

    return ContentService
      .createTextOutput("SUCCESS")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    Logger.log("Error: " + err.message);

    return ContentService
      .createTextOutput("ERROR: " + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
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
