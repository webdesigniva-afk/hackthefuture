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

function doGet(event) {
	const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheet = getOrCreateSheet(spreadsheet);
	const params = normalizeParams(event);

	ensureHeaders(sheet);

	if (String(params.test_row || "") === "1") {
		appendApplicationRow(sheet, {
			submitted_at: new Date().toISOString(),
			name: "Apps Script test",
			email: "test@example.com",
			age: "16",
			school: "Test school",
			motivation: "This row was created by opening the Apps Script test URL.",
			themes: "Future of Work",
			application_type: "Applying alone",
			team_name: "",
			page_url: "apps-script-test",
		});
	}

	if (String(params.submit_application || "") === "1") {
		appendApplicationRow(sheet, params);
	}

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
	const params = normalizeParams(event);
	const lock = LockService.getScriptLock();

	lock.waitLock(10000);

	try {
		appendApplicationRow(sheet, params);
	} finally {
		lock.releaseLock();
	}

	return jsonResponse({ ok: true });
}

function getOrCreateSheet(spreadsheet) {
	return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function normalizeParams(event) {
	const params = (event && event.parameter) || {};
	const allParams = (event && event.parameters) || {};

	return {
		...params,
		themes: allParams.themes ? allParams.themes.join(", ") : params.themes,
	};
}

function appendApplicationRow(sheet, params) {
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
	formatApplicationSheet(sheet);
}

function ensureHeaders(sheet) {
	const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
	const currentHeaders = headerRange.getValues()[0];
	const hasHeaders = currentHeaders.some(Boolean);

	if (!hasHeaders) {
		headerRange.setValues([HEADERS]);
	}

	formatApplicationSheet(sheet);
}

function formatApplicationSheet(sheet) {
	const lastRow = Math.max(sheet.getLastRow(), 1);
	const lastColumn = HEADERS.length;
	const fullRange = sheet.getRange(1, 1, lastRow, lastColumn);
	const headerRange = sheet.getRange(1, 1, 1, lastColumn);

	sheet.setFrozenRows(1);

	headerRange
		.setBackground("#4f2f90")
		.setFontColor("#ffffff")
		.setFontWeight("bold")
		.setFontSize(11)
		.setHorizontalAlignment("center")
		.setVerticalAlignment("middle");

	fullRange
		.setFontFamily("Arial")
		.setFontSize(10)
		.setVerticalAlignment("top")
		.setBorder(true, true, true, true, true, true, "#e6e1f2", SpreadsheetApp.BorderStyle.SOLID);

	if (lastRow > 1) {
		sheet.getRange(2, 1, lastRow - 1, lastColumn)
			.setBackground("#ffffff")
			.setFontColor("#171717")
			.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

		sheet.getRange(2, 6, lastRow - 1, 1)
			.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

		sheet.getRange(2, 1, lastRow - 1, 1)
			.setNumberFormat("yyyy-mm-dd hh:mm");
	}

	sheet.setColumnWidths(1, 1, 155);
	sheet.setColumnWidths(2, 1, 150);
	sheet.setColumnWidths(3, 1, 190);
	sheet.setColumnWidths(4, 1, 60);
	sheet.setColumnWidths(5, 1, 170);
	sheet.setColumnWidths(6, 1, 360);
	sheet.setColumnWidths(7, 1, 230);
	sheet.setColumnWidths(8, 1, 160);
	sheet.setColumnWidths(9, 1, 150);
	sheet.setColumnWidths(10, 1, 230);

	if (!sheet.getFilter()) {
		fullRange.createFilter();
	}
}

function jsonResponse(payload) {
	return ContentService
		.createTextOutput(JSON.stringify(payload))
		.setMimeType(ContentService.MimeType.JSON);
}
