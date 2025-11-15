import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

console.log("Environment Variables Check:");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✓ Set" : "❌ Missing");
console.log("FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓ Set" : "❌ Missing");
console.log("FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓ Set" : "❌ Missing");

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.log("Firebase API Key starts with:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 10) + "...");
}