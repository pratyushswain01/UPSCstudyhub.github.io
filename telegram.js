const https = require('https');

const BOT_TOKEN       = process.env.TELEGRAM_BOT_TOKEN || 'AAGz1MHDKYfxKkPQPyGsDQRSF7oYZxAOMfE';
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID   || '1917437695';


async function sendTelegramReminder({ chatId, title, time, message }) {
  // Use provided chatId or fall back to default
  const targetChatId = chatId || DEFAULT_CHAT_ID;

  // Build message — use custom message if provided, else build from title/time
  const text = message || `📌 *UPSChub Task Reminder*\n\n✅ Task: ${title}\n⏰ ${time}\n\n💪 Stay focused and keep your streak alive!`;

  const body = JSON.stringify({
    chat_id: targetChatId,
    text:    text,
    parse_mode: 'Markdown'
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path:     `/bot${BOT_TOKEN}/sendMessage`,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.ok) {
          console.log(`✅ Telegram sent to chat ${targetChatId}`);
          resolve(parsed);
        } else {
          console.error(`❌ Telegram error:`, parsed.description);
          reject(new Error(parsed.description));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = { sendTelegramReminder };