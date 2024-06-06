import express from 'express'
import cors from 'cors'
import {ChatOpenAI} from "@langchain/openai"
import dotenv from 'dotenv'
import {PromptTemplate} from "@langchain/core/prompts";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let chatHistory = [];

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    max_tokens: 30,
    temperature: 0.5,
})


app.post('/chat', async (req, res) => {
    const {query} = req.body;
    if (!query) {
        return res.status(400).json({error: 'give me a fucking query'})
    }

    // promp eng. toepassen om betere resultaten te krijgen.
    let prompt = `You are a holiday planner chatbot. Your goal is to help users plan their holidays with a good conversation. 
                         Based on their preferences, you will suggest activities and destinations ${chatHistory} ${query}`

    try {
        const response = await model.invoke(prompt)
        res.json({response: response.content})
        chatHistory.push(`user: ${query}`);
        chatHistory.push(`bot: ${response.content}`)


    } catch (err) {
        res.status(500).json({err: 'we are failing help!'})
    }
})


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
