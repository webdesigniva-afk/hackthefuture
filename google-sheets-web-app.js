const SHEET_NAME = "Applications";

const HEADERS = [
	"Submitted at",
	"Name",
	"Email",
	"Age",
	"School",
	"Motivation",
	"Themes",
	"Application type",
	"Team name",
	"Page URL",
];

function doGet() {
	const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheet = getOrCreateSheet(spreadsheet);

	ensureHeaders(sheet);

	return jsonResponse({
		ok: true,
		message: "HTF application sheet is connected.",
		spreadsheet: spreadsheet.getName(),
		sheet: sheet.getName(),
	});
}

function doPost(event) {
	const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheet = getOrCreateSheet(spreadsheet);
	const params = event.parameter || {};
	const lock = LockService.getScriptLock();

	lock.waitLock(10000);

	try {
		ensureHeaders(sheet);
		sheet.appendRow([
			params.submitted_at || new Date().toISOString(),
			params.name || "",
			params.email || "",
			params.age || "",
			params.school || "",
			params.motivation || "",
			params.themes || "",
			params.application_type || "",
			params.team_name || "",
			params.page_url || "",
		]);
	} finally {
		lock.releaseLock();
	}

	return jsonResponse({ ok: true });
}

function getOrCreateSheet(spreadsheet) {
	return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders(sheet) {
	const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
	const currentHeaders = headerRange.getValues()[0];
	const hasHeaders = currentHeaders.some(Boolean);

	if (!hasHeaders) {
		headerRange.setValues([HEADERS]);
		sheet.setFrozenRows(1);
		sheet.autoResizeColumns(1, HEADERS.length);
	}
}

function jsonResponse(payload) {
	return ContentService
		.createTextOutput(JSON.stringify(payload))
		.setMimeType(ContentService.MimeType.JSON);
}
