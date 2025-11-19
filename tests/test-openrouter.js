import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

async function testOpenRouter() {
    try {
        console.log("🧪 Testing OpenRouter API connection...\n");

        if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === "your_openrouter_api_key_here") {
            console.log("❌ OpenRouter API key not configured");
            console.log("📝 Please add your OpenRouter API key to .env.local:");
            console.log("   OPENROUTER_API_KEY=your_actual_openrouter_api_key");
            console.log("\n🔗 Get your API key at: https://openrouter.ai/keys");
            return;
        }

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "You are NaVegate's AI Travel Assistant, specializing in complete vegan travel planning.",
                },
                {
                    role: "user",
                    content: "Hello! Can you help me plan a vegan trip to Berlin?",
                },
            ],
            max_tokens: 200,
            temperature: 0.7,
        });

        const response = completion.choices[0].message.content;

        console.log("✅ OpenRouter API connection successful!\n");
        console.log("📱 Model:", completion.model || "meta-llama/llama-3.1-8b-instruct:free");
        console.log("🎯 Usage:", completion.usage);
        console.log("\n💬 Sample response:");
        console.log(response);
        console.log("\n🚀 OpenRouter integration ready for NaVegate!");
    } catch (error) {
        console.error("❌ OpenRouter API test failed:", error.message);
        if (error.status === 401) {
            console.log("\n🔑 Please check your OpenRouter API key in .env.local");
            console.log("🔗 Get your API key at: https://openrouter.ai/keys");
        } else if (error.status === 429) {
            console.log("\n⏳ Rate limit hit - OpenRouter has generous free tiers, this should resolve quickly");
        } else {
            console.log("\n🔧 Error details:", error);
        }
    }
}

testOpenRouter();
