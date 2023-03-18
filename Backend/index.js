const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);


async function main() {
    const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
        {role: "user", content: "Hello world"}
    ],
    });
    console.log(completion.data.choices[0].message);
}

main();
