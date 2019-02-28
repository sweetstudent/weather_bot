const TelegramBot = require('node-telegram-bot-api');

const token = '749384960:AAHyC5iIwpjncO9tYl-cL2uVXJf7roi3dco';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg, match) => {
  
  const chatId = msg.chat.id;
  const resp = 'Привет, отправьте мне геопозицию с помощью кнопки или вручную, чтобы узнать подробные данные о погоде в этом месте!'; 

  bot.sendMessage(chatId, resp);
});

