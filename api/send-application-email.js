import nodemailer from "nodemailer";

const REQUIRED_FIELDS = ["name", "email", "age", "school", "motivation", "application_type"];

function getSmtpConfig() {
	const host = process.env.SMTP_HOST;
	const port = Number(process.env.SMTP_PORT || 465);
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASSWORD;
	const from = process.env.SMTP_FROM || user;
	const to = parseEmailList(process.env.NOTIFICATION_TO_EMAIL);

	if (!host || !user || !pass || !from || to.length === 0) {
		throw new Error("Missing SMTP environment variables.");
	}

	return {
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
		from,
		to,
	};
}

function parseEmailList(value) {
	return String(value || "")
		.split(",")
		.map((email) => email.trim())
		.filter(Boolean);
}

function normalizeApplication(body) {
	const application = {
		submittedAt: body.submitted_at || new Date().toISOString(),
		name: body.name || "",
		email: body.email || "",
		age: body.age || "",
		school: body.school || "",
		motivation: body.motivation || "",
		themes: Array.isArray(body.themes) ? body.themes.join(", ") : body.themes || "",
		applicationType: body.application_type || "",
		teamName: body.team_name || "",
		pageUrl: body.page_url || "",
	};

	const missingFields = REQUIRED_FIELDS.filter((field) => !body[field]);
	if (!application.themes) {
		missingFields.push("themes");
	}

	return { application, missingFields };
}

function formatSubmittedAt(value) {
	const date = value ? new Date(value) : new Date();

	if (Number.isNaN(date.getTime())) {
		return value || "";
	}

	return new Intl.DateTimeFormat("bg-BG", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: "Europe/Sofia",
	}).format(date);
}

function buildTextEmail(application) {
	return [
		"Нова кандидатура за Hack the Future",
		"",
		"Подадена на: " + formatSubmittedAt(application.submittedAt),
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
	].join("\n");
}

function buildHtmlEmail(application) {
	const details = [
		["Подадена на", formatSubmittedAt(application.submittedAt)],
		["Име", application.name],
		["Имейл", application.email],
		["Възраст", application.age],
		["Училище", application.school],
		["Теми", application.themes],
		["Начин на кандидатстване", application.applicationType],
		["Име на отбор", application.teamName || "-"],
	];
	const rows = details.map(([label, value]) => (
		'<tr><td style="padding:12px 16px;color:#6a6078;font-size:13px;border-bottom:1px solid #ece7f6;width:34%;">' +
		escapeHtml(label) +
		'</td><td style="padding:12px 16px;color:#171717;font-size:15px;border-bottom:1px solid #ece7f6;font-weight:600;">' +
		escapeHtml(value) +
		"</td></tr>"
	)).join("");

	return '<div style="margin:0;padding:28px;background:#f7f4fb;font-family:Arial,sans-serif;color:#171717;">' +
		'<div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e7def5;border-radius:14px;overflow:hidden;">' +
			'<div style="padding:28px 32px;background:#4f2f90;color:#ffffff;">' +
				'<div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.82;">Hack the Future</div>' +
				'<h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;">Нова кандидатура</h1>' +
			'</div>' +
			'<div style="padding:26px 32px;">' +
				'<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border:1px solid #ece7f6;border-radius:10px;overflow:hidden;">' +
					rows +
				'</table>' +
				'<div style="margin-top:24px;">' +
					'<h2 style="margin:0 0 10px;color:#4f2f90;font-size:16px;">Мотивация</h2>' +
					'<div style="padding:16px;background:#fbf9fe;border:1px solid #ece7f6;border-radius:10px;color:#26202f;font-size:15px;line-height:1.65;white-space:pre-wrap;">' +
						escapeHtml(application.motivation || "-") +
					'</div>' +
				'</div>' +
				(application.pageUrl ? '<div style="margin-top:24px;color:#6a6078;font-size:13px;line-height:1.6;">Страница: <a href="' + escapeHtml(application.pageUrl) + '" style="color:#4f2f90;">' + escapeHtml(application.pageUrl) + "</a></div>" : "") +
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

function sendJson(response, statusCode, payload) {
	response.statusCode = statusCode;
	response.setHeader("Content-Type", "application/json");
	response.end(JSON.stringify(payload));
}

function parseRequestBody(body) {
	if (!body) {
		return {};
	}

	if (typeof body === "string") {
		return JSON.parse(body);
	}

	return body;
}

export default async function handler(request, response) {
	if (request.method !== "POST") {
		response.setHeader("Allow", "POST");
		sendJson(response, 405, { ok: false, error: "Method not allowed." });
		return;
	}

	try {
		const body = parseRequestBody(request.body);
		const { application, missingFields } = normalizeApplication(body);
		if (missingFields.length > 0) {
			sendJson(response, 400, { ok: false, error: "Missing required fields.", fields: missingFields });
			return;
		}

		const smtpConfig = getSmtpConfig();
		const transporter = nodemailer.createTransport({
			host: smtpConfig.host,
			port: smtpConfig.port,
			secure: smtpConfig.secure,
			auth: smtpConfig.auth,
		});

		await transporter.sendMail({
			from: smtpConfig.from,
			to: smtpConfig.to,
			replyTo: application.email,
			subject: "Нова кандидатура за Hack the Future: " + application.name,
			text: buildTextEmail(application),
			html: buildHtmlEmail(application),
		});

		sendJson(response, 200, { ok: true });
	} catch (error) {
		console.error("Application email failed:", error);
		sendJson(response, 500, { ok: false, error: "Email could not be sent." });
	}
}
