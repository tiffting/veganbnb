import { generateItineraryFromChat, canExportToCalendar } from "../lib/sample-itinerary.ts";
import { generateIcsContent } from "../lib/calendar-export.ts";

console.log("🧪 Testing Calendar Export...");

// Test 1: Message detection
const tripMessages = [
    { role: "user", content: "Plan my 3-day vegan trip to Berlin" },
    { role: "assistant", content: "Here are my recommendations for Berlin restaurants and tours..." },
];

const canExport = canExportToCalendar(tripMessages);
console.log("✅ Can export from trip messages:", canExport);

// Test 2: Itinerary generation
const itinerary = generateItineraryFromChat(tripMessages);
console.log("✅ Generated itinerary:", itinerary?.title);
console.log("   Days:", itinerary?.days.length);
console.log(
    "   Events:",
    itinerary?.days.reduce((sum, day) => sum + day.events.length, 0),
);

// Test 3: Calendar format
if (itinerary) {
    const icsContent = generateIcsContent(itinerary);
    console.log("✅ ICS file generated:", icsContent.includes("BEGIN:VCALENDAR"));
    console.log("   Venue events:", (icsContent.match(/🍽️|🎯|🏨/g) || []).length);
    console.log("   Transit events:", (icsContent.match(/🚶|🚇/g) || []).length);
}

console.log("🎉 Calendar export tests complete!");
