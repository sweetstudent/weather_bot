const TelegramBot = require("node-telegram-bot-api");

const token = "749384960:AAHyC5iIwpjncO9tYl-cL2uVXJf7roi3dco";

const request = require("request");

const option = {
  parse_mode: "Markdown",
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [
        {
          text: `Русский`,
          callback_data: "rus"
        },
        {
          text: `English`,
          callback_data: "eng"
        }
      ],
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

const rus = {
  err: "Выберите язык и отправте геопозицию",
  weather: "Погода в",
  temp: "Температура",
  pressure: "Давление",
  moisture: "Влажность",
  min_temp: "Минимальная температура",
  max_temp: "Максимальная температура",
  wind_speed: "Скорость ветра",
  direction: "Направление ветра",
  сloud_percentage: "Процент облачности",
  button: "Отпрвить геопозицию"
};

const eng = {
  err: "Choose language and send location",
  weather: "Weather in",
  temp: "Temperature",
  pressure: "Pressure",
  moisture: "Humidity",
  min_temp: "Minimal temperature",
  max_temp: "Maximal temperature",
  wind_speed: "Wind speed",
  direction: "Direction of the wind",
  сloud_percentage: "Cloud percentage",
  button: "Send location"
};

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const message = `Привет ${
    msg.chat.first_name
  }, *выберите язык* и отправьте мне геопозицию с помощью кнопки , чтобы узнать подробные данные о погоде в этом месте!`;
  bot.sendMessage(chatId, message, option);
});

bot.onText(/[^/start,Русский,English]/, (msg, match) => {
  const chatId = msg.chat.id;
  const message = `${rus.err}/
  ${eng.err} `;
  bot.sendMessage(chatId, message);
});

bot.on("message", msg => {
  let id = msg.chat.id;

  switch (msg.text) {
    case "Русский":
      bot.sendMessage(id, "Хорошо");

      bot.once("location", msg => {
        const lat = msg.location.latitude.toFixed(2);
        const lon = msg.location.longitude.toFixed(2);
        const cels = 273;
        request(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b9d7db5b1bd38af3d125a21fe14ead1b`,
          function(error, response, body) {
            const data = JSON.parse(body);

            let ms = `
            ${rus.weather} ${data.name}:

            ${rus.temp}: ${(data.main.temp - cels).toFixed(1)}℃
            ${rus.pressure}: ${data.main.pressure}
            ${rus.moisture}: ${data.main.humidity}
            ${rus.min_temp}: ${(data.main.temp_min - cels).toFixed(1)}℃
            ${rus.max_temp}: ${(data.main.temp_max - cels).toFixed(1)}℃
            ${rus.wind_speed}: ${data.wind.speed}
            ${rus.direction}: ${data.wind.deg}°
            ${rus.сloud_percentage}: ${data.clouds.all}


            ${rus.err}/${eng.err}
            
            `;

            bot.sendMessage(id, ms, option);
          }
        );
      });
      break;

    case "English":
      bot.sendMessage(id, "Ok");

      bot.once("location", msg => {
        const lat = msg.location.latitude.toFixed(2);
        const lon = msg.location.longitude.toFixed(2);
        const cels = 273;

        request(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b9d7db5b1bd38af3d125a21fe14ead1b`,
          function(error, response, body) {
            const data = JSON.parse(body);

            let ms = `
            ${eng.weather} ${data.name}:

            ${eng.temp}: ${(data.main.temp - cels).toFixed(1)}℃
            ${eng.pressure}: ${data.main.pressure}
            ${eng.moisture}: ${data.main.humidity}
            ${eng.min_temp}: ${(data.main.temp_min - cels).toFixed(1)}℃
            ${eng.max_temp}: ${(data.main.temp_max - cels).toFixed(1)}℃
            ${eng.wind_speed}: ${data.wind.speed}
            ${eng.direction}: ${data.wind.deg}°
            ${eng.сloud_percentage}: ${data.clouds.all}


            ${rus.err}/${eng.err}
            
            `;
            bot.sendMessage(id, ms, option);
          }
        );
      });
      break;
  }
});
