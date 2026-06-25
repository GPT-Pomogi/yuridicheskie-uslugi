const TELEGRAM_API = "https://api.telegram.org/bot";

function clean(value) {
  return String(value || "").trim().slice(0, 1200);
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return response.status(500).json({ error: "Lead delivery is not configured" });
  }

  const body = request.body || {};

  if (clean(body.company)) {
    return response.status(204).end();
  }

  const name = clean(body.name);
  const phone = clean(body.phone);

  if (!name || !phone) {
    return response.status(400).json({ error: "Name and phone are required" });
  }

  const debt = clean(body.debt) || "Не указано";
  const message = clean(body.message) || "Без комментария";
  const text = [
    "<b>Новая заявка с лендинга</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Сумма долга:</b> ${escapeHtml(debt)}`,
    `<b>Ситуация:</b> ${escapeHtml(message)}`
  ].join("\n");

  const telegramResponse = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true
    })
  });

  if (!telegramResponse.ok) {
    return response.status(502).json({ error: "Telegram delivery failed" });
  }

  return response.status(200).json({ ok: true });
};
