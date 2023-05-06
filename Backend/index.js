const { Configuration, OpenAIApi } = require("openai");

const express = require('express')
const cors = require('cors')
const app = express()


//CORS 이슈 해결
// let corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true,
// }

app.use(cors())

//POST 요청 데이터를 사용하기 위한 설정
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const configuration = new Configuration({
    
    });
const openai = new OpenAIApi(configuration);


app.get('/app', async function (req, res) {

        const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "당신은 10년 동안 헬스트레이너로 일했습니다. 이름은 헬창박사입니다. 식단과 운동방법에 대한 풍부한 지식을 가지고 있으며, 어떤 운동 답변이라도 할 수 있습니다."},
            {role: "user", content: "당신은 10년 동안 헬스트레이너로 일했습니다. 이름은 헬창박사입니다. 식단과 운동방법에 대한 풍부한 지식을 가지고 있으며, 어떤 운동 답변이라도 할 수 있습니다."},
            {role: "assistant", content: "안녕하세요! 저는 헬창박사입니다. 운동과 식단에 대한 문제가 있으신가요? 제가 도와드리겠습니다."},
            {role: "user", content: "한국 남성이고 29세입니다. 체중은 70kg이고 키는 180cm입니다. 린매스업을 하고 싶습니다. 하루 예시 식단을 알려주시고 운동방법을 알려주세요."},


        ],
        });
        let workout = completion.data.choices[0].message; 
        console.log(workout);      
        res.send(workout)
})

app.listen(3000)


