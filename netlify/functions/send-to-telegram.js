// File: netlify/functions/send-to-telegram.js
const {
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID
} = process.env;

exports.handler = async (event) => {
    // Получение данных формы из Netlify
    const data = JSON.parse(event.body);
    const {
        name,
        email,
        message
    } = data.payload.data;

    // Формирование сообщения для Telegram
    const telegramMessage = `*Новая заявка с сайта!*
Имя: ${name}
Email: ${email}
Сообщение:
${message}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            throw new Error(`Telegram API responded with status ${response.status}`);
        }

        console.log('Message sent to Telegram successfully!');

        // Netlify ожидает успешный ответ
        return {
            statusCode: 200,
            body: "Сообщение успешно отправлено!"
        };
    } catch (error) {
        console.error("Error sending message to Telegram:", error);

        return {
            statusCode: 500,
            body: "Не удалось отправить сообщение."
        };
    }
};