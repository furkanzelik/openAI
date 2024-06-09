import express from 'express';
import cors from 'cors';
import {ChatOpenAI} from "@langchain/openai";
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let chatHistory = [];

const model = new ChatOpenAI({
    max_tokens: 30,
    temperature: 0.5,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});

app.post('/chat', async (req, res) => {
    const userLocation = 'Istanbul';
    const {query} = req.body;

    if (!query) {
        return res.status(400).json({error: 'Please provide a query'});
    }

    const weatherKey = process.env.WHEATHER_API_KEY;
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${weatherKey}&units=metric`;

    try {
        const weatherShow = await axios.get(weatherAPI);

        if (weatherShow.status !== 200) {
            new Error(`Weather API request failed with status: ${weatherShow.status}`);
        }

        const temperature = weatherShow.data.main.temp;

        let prompt = `
        You are a holiday planner chatbot. Your goal is to help users plan their holidays with a good conversation. Based on their preferences, you will suggest activities and destinations.
        Here is the current weather information for the user's location:
        Location: ${userLocation}
        Temperature: ${temperature}°C

        The user may ask about:
        - Suggested destinations
        - Activities based on the weather
        - General travel advice

        You should provide personalized responses based on the user's preferences and the current weather conditions. 

        Here is the conversation history so far:
        ${chatHistory}

        User query: ${query}

        Please respond as a helpful holiday planner chatbot.
        `;

        const response = await model.invoke(prompt);
        res.json({response: response.content});

        chatHistory.push(`user: ${query}`);  // chat role voor de user
        chatHistory.push(`bot: ${response.content}`); // chat role voor de bot

    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Something went wrong, please try again later'});
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
