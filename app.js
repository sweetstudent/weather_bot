const TelegramBot = require("node-telegram-bot-api");

const token = "749384960:AAHyC5iIwpjncO9tYl-cL2uVXJf7roi3dco";

const request = require("request");

const option = {
  parse_mode: "Markdown",
  reply_markup: {
    resize_keyboard:true,
    keyboard: [
      [
        {
          text: "Отправить геопозицию",
          request_location: true,
          callback_data: "location"
        }
      ]
      
    ]
  }
};

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const message ="Привет, отправьте мне геопозицию с помощью кнопки , чтобы узнать подробные данные о погоде в этом месте!";
  bot.sendMessage(chatId, message,option);
   

});


bot.on("location", msg => {
  const lat = msg.location.latitude.toFixed(2);
  const lon = msg.location.longitude.toFixed(2);
  const cels = 273;
  const chatId = msg.chat.id;

  request(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b9d7db5b1bd38af3d125a21fe14ead1b`,
    function(error, response, body) {
      const data = JSON.parse(body);

      let ms = `
      *Погода в ${data.name}:*
      ${data.weather[0].main}
      Температура: ${(data.main.temp - cels).toFixed(1)}℃
      Давление: ${data.main.pressure}
      Влажность: ${data.main.humidity}
      Минимальная температура: ${(data.main.temp_min - cels).toFixed(1)}℃
      Максимальная температура: ${(data.main.temp_max - cels).toFixed(1)}℃
      Скорость ветра: ${data.wind.speed}
      Направление ветра: ${data.wind.deg}°
      Процент облачности: ${data.clouds.all}
      `;

      bot.sendMessage(chatId, ms, option);
    }
  );
});