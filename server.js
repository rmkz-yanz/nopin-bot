const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const apiUrl = `https://api.telegram.org/bot${token}`;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = message.chat.id;
        const text = 'Klik tombol di bawah untuk menjalankan miniapp:';
        const replyMarkup = {
            inline_keyboard: [
                [
                    {
                        text: 'Jalankan Miniapp',
                        url: `https://nopin-bot.vercel.app/index.html?chat_id=${chatId}`
                    }
                ]
            ]
        };

        await sendMessage(chatId, text, replyMarkup);
    }

    res.sendStatus(200);
});

async function sendMessage(chatId, text, replyMarkup) {
    const url = `${apiUrl}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            reply_markup: replyMarkup
        })
    });

    return response.json();
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
