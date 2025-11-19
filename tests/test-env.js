import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

console.log("Environment Variables Check:");
console.log("AI_PROVIDER:", process.env.AI_PROVIDER || "openrouter (default)");
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "✓ Set" : "❌ Missing");
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✓ Set" : "❌ Missing");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✓ Set" : "❌ Missing");
console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "❌ Missing");
console.log("SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "❌ Missing");

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
}