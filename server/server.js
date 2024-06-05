import express from 'express'
import cors from 'cors'
import {ChatOpenAI} from "@langchain/openai"
import dotenv from 'dotenv'


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

// week2 endpoint to joke

app.get('/joke', async (req, res) => {
    try {
        const joke = await model.invoke('Tell me a Javascript joke!');
        res.json({ joke: joke.content });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch joke' });
    }
});

app.post('/chat', async (req,res) => {
    const {query} = req.body;
    if (!query) {
        return res.status(400).json({error: 'give me a fucking query'})
    } try {
        const response = await model.invoke(query)
        res.json({response: response.content})
    } catch (err){
        res.status(500).json({err: 'we are failing help!'})
    }
})


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
