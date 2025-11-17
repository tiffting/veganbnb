import { config } from 'dotenv';
import { getAICompletion, getAIProviderInfo } from '../lib/ai-config.js';

// Load environment variables
config({ path: '.env.local' });

async function testAIConfig() {
    console.log('🧪 Testing AI Configuration System\n');
    
    // Display current configuration
    const aiInfo = getAIProviderInfo();
    console.log('Current AI Provider Configuration:');
    console.log('- Provider:', aiInfo.provider);
    console.log('- Model:', aiInfo.model);
    console.log('- Configured:', aiInfo.configured ? '✅' : '❌');
    console.log('- AI_PROVIDER env:', process.env.AI_PROVIDER || 'not set (defaulting to openrouter)');
    console.log();
    
    if (!aiInfo.configured) {
        console.error('❌ AI provider not properly configured. Please check your API keys.');
        process.exit(1);
    }
    
    try {
        console.log('📝 Testing AI completion...\n');
        
        const response = await getAICompletion({
            systemPrompt: "You are a helpful assistant that provides brief, concise responses.",
            userPrompt: "What is the capital of Germany? Reply in exactly one word.",
            maxTokens: 50,
            temperature: 0.1
        });
        
        console.log('AI Response:', response.trim());
        console.log('\n✅ AI configuration test successful!');
        
        console.log('\n💡 To switch providers:');
        console.log('1. Set AI_PROVIDER=gemini in .env.local (for Gemini)');
        console.log('2. Set AI_PROVIDER=openai in .env.local (for OpenAI/GPT-4o-mini)');
        console.log('3. Set AI_PROVIDER=openrouter in .env.local (for OpenRouter)');
        console.log('4. Restart your development server');
        
        console.log('\n🔑 Required API keys:');
        console.log('- Gemini: GEMINI_API_KEY');
        console.log('- OpenAI: OPENAI_API_KEY');
        console.log('- OpenRouter: OPENROUTER_API_KEY');
        
    } catch (error) {
        console.error('❌ AI test failed:', error.message);
        console.error('\nPlease check:');
        console.error('1. Your API keys are correctly set in .env.local');
        console.error('2. You have internet connectivity');
        console.error('3. The AI provider service is available');
    }
}

// Run the test
testAIConfig();