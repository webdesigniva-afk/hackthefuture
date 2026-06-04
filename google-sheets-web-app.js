const SHEET_NAME = "Applications";
const NOTIFICATION_EMAIL = "i.nikolova@it-s.org";

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
		sendApplicationNotification(params, spreadsheet);
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

	sendApplicationNotification(params, spreadsheet);

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

function sendApplicationNotification(params, spreadsheet) {
	const application = buildApplicationSummary(params, spreadsheet);
	const subject = "Нова кандидатура за Hack the Future: " + (application.name || "без име");
	const emailOptions = {
		to: NOTIFICATION_EMAIL,
		subject: subject,
		name: "Hack the Future",
		body: buildPlainTextEmail(application),
		htmlBody: buildHtmlEmail(application),
	};

	if (application.email) {
		emailOptions.replyTo = application.email;
	}

	MailApp.sendEmail(emailOptions);
}

function buildApplicationSummary(params, spreadsheet) {
	return {
		submittedAt: formatSubmittedAt(params.submitted_at),
		name: params.name || "",
		email: params.email || "",
		age: params.age || "",
		school: params.school || "",
		motivation: params.motivation || "",
		themes: params.themes || "",
		applicationType: params.application_type || "",
		teamName: params.team_name || "",
		pageUrl: params.page_url || "",
		spreadsheetUrl: spreadsheet.getUrl(),
	};
}

function formatSubmittedAt(value) {
	const date = value ? new Date(value) : new Date();

	if (isNaN(date.getTime())) {
		return value || "";
	}

	return Utilities.formatDate(date, Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm");
}

function buildPlainTextEmail(application) {
	return [
		"Нова кандидатура за Hack the Future",
		"",
		"Подадена на: " + application.submittedAt,
		"Име: " + application.name,
		"Имейл: " + application.email,
		"Възраст: " + application.age,
		"Училище: " + application.school,
		"Теми: " + application.themes,
		"Начин на кандидатстване: " + application.applicationType,
		"Име на отбор: " + (application.teamName || "-"),
		"",
		"Мотивация:",
		application.motivation,
		"",
		"Страница: " + application.pageUrl,
		"Таблица: " + application.spreadsheetUrl,
	].join("\n");
}

function buildHtmlEmail(application) {
	const rows = [
		["Подадена на", application.submittedAt],
		["Име", application.name],
		["Имейл", application.email],
		["Възраст", application.age],
		["Училище", application.school],
		["Теми", application.themes],
		["Начин на кандидатстване", application.applicationType],
		["Име на отбор", application.teamName || "-"],
	];
	const detailRows = rows.map(function(row) {
		return '<tr><td style="padding: 12px 16px; color: #6a6078; font-size: 13px; border-bottom: 1px solid #ece7f6; width: 34%;">' +
			escapeHtml(row[0]) +
			'</td><td style="padding: 12px 16px; color: #171717; font-size: 15px; border-bottom: 1px solid #ece7f6; font-weight: 600;">' +
			escapeHtml(row[1]) +
			"</td></tr>";
	}).join("");

	return '<div style="margin: 0; padding: 28px; background: #f7f4fb; font-family: Arial, sans-serif; color: #171717;">' +
		'<div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e7def5; border-radius: 14px; overflow: hidden;">' +
			'<div style="padding: 28px 32px; background: #4f2f90; color: #ffffff;">' +
				'<div style="font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.82;">Hack the Future</div>' +
				'<h1 style="margin: 10px 0 0; font-size: 24px; line-height: 1.25;">Нова кандидатура</h1>' +
			'</div>' +
			'<div style="padding: 26px 32px;">' +
				'<table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; border: 1px solid #ece7f6; border-radius: 10px; overflow: hidden;">' +
					detailRows +
				'</table>' +
				'<div style="margin-top: 24px;">' +
					'<h2 style="margin: 0 0 10px; color: #4f2f90; font-size: 16px;">Мотивация</h2>' +
					'<div style="padding: 16px; background: #fbf9fe; border: 1px solid #ece7f6; border-radius: 10px; color: #26202f; font-size: 15px; line-height: 1.65; white-space: pre-wrap;">' +
						escapeHtml(application.motivation || "-") +
					'</div>' +
				'</div>' +
				'<div style="margin-top: 24px; color: #6a6078; font-size: 13px; line-height: 1.6;">' +
					(application.pageUrl ? '<div>Страница: <a href="' + escapeHtml(application.pageUrl) + '" style="color: #4f2f90;">' + escapeHtml(application.pageUrl) + "</a></div>" : "") +
					'<div>Таблица: <a href="' + escapeHtml(application.spreadsheetUrl) + '" style="color: #4f2f90;">отвори Google Sheet</a></div>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>';
}

function escapeHtml(value) {
	return String(value || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
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
