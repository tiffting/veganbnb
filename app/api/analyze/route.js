import { getAICompletion, getAIProviderInfo } from "../../../lib/ai-config.js";
import { CATEGORY_PROMPTS } from "../../../lib/prompts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Valid categories for validation
const VALID_CATEGORIES = ['restaurant', 'accommodation', 'tour', 'event'];

export async function POST(req) {
    try {
        const { category, reviews } = await req.json();
        
        // Validate input
        if (!category || !VALID_CATEGORIES.includes(category)) {
            return Response.json(
                { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` }, 
                { status: 400 }
            );
        }
        
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
            return Response.json(
                { error: 'Reviews must be a non-empty array of strings' }, 
                { status: 400 }
            );
        }

        // Get AI provider info for logging
        const aiInfo = getAIProviderInfo();
        console.log(`Using ${aiInfo.provider} (${aiInfo.model}) for review analysis`);

        // Build the analysis prompt
        const reviewPrompt = CATEGORY_PROMPTS[category](reviews);
        
        // Add JSON formatting instruction to the system prompt
        const systemPrompt = `You are a vegan travel safety analyzer. Analyze reviews and return a JSON response.
        
IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. The response should be parseable by JSON.parse().

Expected JSON structure:
{
  "score": number (0-100),
  "category": string,
  "reasoning": string,
  "signals": object with category-specific scores,
  "citations": array of relevant quotes
}`;

        // Get AI completion
        const responseText = await getAICompletion({
            systemPrompt: systemPrompt,
            userPrompt: reviewPrompt,
            maxTokens: 800,
            temperature: 0.7
        });

        // Clean up response and parse JSON
        let cleanedResponse = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
            
        // If response starts/ends with backticks, remove them
        if (cleanedResponse.startsWith('`')) {
            cleanedResponse = cleanedResponse.replace(/^`+|`+$/g, '');
        }

        const analysis = JSON.parse(cleanedResponse);
        
        // Validate response structure
        if (!analysis.score || !analysis.category || !analysis.signals || !analysis.citations) {
            throw new Error('Invalid AI response structure');
        }
        
        // Add timestamp
        analysis.analyzedAt = new Date().toISOString();

        return Response.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        return Response.json({ 
            error: error.message || 'Failed to analyze reviews',
            category: req.body?.category || 'unknown'
        }, { status: 500 });
    }
}
