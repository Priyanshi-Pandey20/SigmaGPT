import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.API_KEY });

const getOpenAPIRespone = async(message, systemPrompt = "You are a helpful assistant.") => {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ]
        });

        const reply = response.choices[0]?.message?.content;
        return reply;

    } catch(error) {
        console.error(error.message);
        throw new Error("Something went wrong");
    }
}

export default getOpenAPIRespone;