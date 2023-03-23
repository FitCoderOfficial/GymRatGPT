const { Configuration, OpenAIApi } = require("openai");
const env = require('dotenv');
env.config();

const apiKey = process.env.apiKey;
const serverless = require('serverless-http');
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors());


const configuration = new Configuration({
    apiKey: apiKey
    });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
// let corsOptions = {
//     origin: 'https://fitnessai.pages.dev',
//     credentials: true,
// }

// app.use(cors(corsOptions))

//POST 요청 데이터를 사용하기 위한 설정
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/api', async function (req, res) {
    try {
      let { userData, userMessages, assistantMessages } = req.body;
      console.log(userMessages);
      console.log(assistantMessages);

        let messages = [
            //식단과 운동방법에 대한 풍부한 지식을 가지고 있으며, 어떤 운동 답변이라도 할 수 있습니다. 운동을 소개할 때에는 운동의 이름과 소모되는 칼로리, 시간을 정확하게 기입하여 알려줍니다. 또한 식단을 추천할 때에는 탄수화물의 양, 단백질의 양, 지방의 양 칼로리의 양, 총 음식의 영양성분의 합, 총 칼로리의 합을 표로 정확하게 보여줘야합니다. 활동지수를 계산 할때에는 (매우 활동적이지 않음: 1.2, 가벼운 활동: 1.375, 중간 활동: 1.55, 심한 활동: 1.725,매우 심한 활동: 1.9)을 사용하여 기초대사량을 측정해야합니다.
            {role: "system", content: "I hope you will write Korean fluently as a very competent health trainer who has worked for 10 years. Even if you don't know the date of the user's birth, please calculate it based on the age the user told you. Use the markdown language to bold the title. When writing a diet, you should specify when to eat by time zone. You should then indicate the nutritional content (carbohydrates, proteins, fats, calories) of each food.When describing how to exercise, you should write how to exercise as a title. Then you should also show the calories that are consumed by each exercise. At the end, you should show tips on how to exercise. All answers must be clear, not vague. You should also answer all your answers in a professional way."},
            {role: "user", content: "I hope you will write Korean fluently as a very competent health trainer who has worked for 10 years. Even if you don't know the date of the user's birth, please calculate it based on the age the user told you. Use the markdown language to bold the title. When writing a diet, you should specify when to eat by time zone. You should then indicate the nutritional content (carbohydrates, proteins, fats, calories) of each food.When describing how to exercise, you should write how to exercise as a title. Then you should also show the calories that are consumed by each exercise. At the end, you should show tips on how to exercise. All answers must be clear, not vague. You should also answer all your answers in a professional way."},
            {role: "assistant", content: "안녕하세요! 운동과 식단에 대한 문제가 있으신가요? 제가 도와드리겠습니다"},
            {role: "user", content: `저의 신체 정보로는 ${userData}입니다.`},
            {role: "assistant", content: `당신은 ${userData}로 확인되었습니다. 운동에 관해 어떤 것이든 물어보세요`},

        ]

        while (userMessages.length !== 0 || assistantMessages.length !== 0) {
            if (userMessages.length !== 0) {
              messages.push({ role: "user", content: userMessages.shift().replace(/\n/g, "") });
            }
            if (assistantMessages.length !== 0) {
              messages.push({ role: "assistant", content: assistantMessages.shift().replace(/\n/g, "") });
            }
          }
      
          const maxRetries = 3;
          let retries = 0;
          let completion;
      
          while (retries < maxRetries) {
            try {
              completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages
              });
              break;
            } catch (err) {
              retries++;
              console.log(err);
              console.log(`retrying ${retries} of ${maxRetries}`);
            }
          }
          if (completion) {
            let workout = completion.data.choices[0].message.content;
            console.log(workout);
            res.json({ assistant: workout });
          } else {
            res.status(500).json({ error: "Failed to generate response." });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "An error occurred." });
        }
      });
      
module.exports.handler = serverless(app);



// app.listen(3000)



