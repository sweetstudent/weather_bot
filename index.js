const TelegramBot = require("node-telegram-bot-api");

const request = require("request");

const token = "749384960:AAHyC5iIwpjncO9tYl-cL2uVXJf7roi3dco";



const bot = new TelegramBot(token, { polling: true });

const option = {
  parse_mode:'Markdown',
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Отправить геопозицию",
          request_location:true,
          resize_keyboard:true,
          callback_data: "geoposition",
          
        }
      ]
    ]
  }
};

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  
  const resp =
    "Привет, отправьте мне геопозицию с помощью кнопки , чтобы узнать подробные данные о погоде в этом месте!";

    
  bot.sendMessage(chatId, resp,option);

  
});

bot.on("callback_query", query => {
    const id = query.message.chat.id;
  
    request(
      "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b9d7db5b1bd38af3d125a21fe14ead1b",
      function(error, response, body) {
        const data = JSON.parse(body);
        
        
        let md = `
        * ${data.name}*
      `;
      bot.sendMessage(id, md, {parse_mode: 'Markdown'});      }
    );
  });

bot.on('callback_query',query=>{
  const num = query.message.chat.id;
  console.log(num)
})