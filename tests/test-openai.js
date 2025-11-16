import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('🧪 Testing OpenAI API connection...\n');
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('❌ OpenAI API key not configured');
      console.log('📝 Please add your OpenAI API key to .env.local:');
      console.log('   OPENAI_API_KEY=your_actual_openai_api_key');
      console.log('\n🔗 Get your API key at: https://platform.openai.com/api-keys');
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are VeganBnB's AI Travel Assistant, specializing in complete vegan travel planning."
        },
        {
          role: "user", 
          content: "Hello! Can you help me plan a vegan trip to Berlin?"
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    console.log('✅ OpenAI API connection successful!\n');
    console.log('📱 Model:', completion.model);
    console.log('🎯 Usage:', completion.usage);
    console.log('\n💬 Sample response:');
    console.log(response);
    console.log('\n🚀 OpenAI integration ready for VeganBnB!');

  } catch (error) {
    console.error('❌ OpenAI API test failed:', error.message);
    if (error.code === 'invalid_api_key') {
      console.log('\n🔑 Please check your OpenAI API key in .env.local');
      console.log('🔗 Get your API key at: https://platform.openai.com/api-keys');
    }
  }
}

testOpenAI();