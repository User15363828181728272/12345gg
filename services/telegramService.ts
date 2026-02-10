
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../constants';

export const sendNotification = async (message: string) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
};
