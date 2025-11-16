// Simple, selective quick actions without AI dependency

export async function POST(request) {
  try {
    const { lastMessage } = await request.json();

    // Input validation
    if (!lastMessage || typeof lastMessage.content !== 'string') {
      return Response.json({ error: "Last message is required" }, { status: 400 });
    }

    // Only show quick actions when they're genuinely helpful
    const suggestions = getSmartQuickActions(lastMessage.content);
    
    return Response.json({
      suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Quick actions API error:', error);
    
    return Response.json({
      suggestions: [],
      timestamp: new Date().toISOString(),
      error: true
    });
  }
}

// Smart quick actions - only show when genuinely helpful
function getSmartQuickActions(messageContent) {
  const content = messageContent.toLowerCase();
  
  // INTERVIEW QUESTIONS with clear enumerated options
  
  // Budget range question
  if (content.includes('budget range') || (content.includes('budget') && (content.includes('€') || content.includes('trip')))) {
    return ['€', '€€', '€€€', 'any'];
  }
  
  // Eating style question
  if (content.includes('eating style') || (content.includes('foodie') && content.includes('casual') && content.includes('efficient'))) {
    return ['foodie', 'casual', 'efficient'];
  }
  
  // Yes/No questions - Breakfast
  if (content.includes('include breakfast in your travel plans') || content.includes('breakfast') && content.includes('travel plans')) {
    return ['yes', 'no'];
  }
  
  // Yes/No questions - Wheelchair accessibility
  if (content.includes('wheelchair accessibility a requirement') || (content.includes('wheelchair') && content.includes('requirement'))) {
    return ['yes', 'no'];
  }
  
  // Transport modes (multiple choice)
  if (content.includes('how do you prefer to get around') || (content.includes('get around') && content.includes('walking'))) {
    return ['walking', 'public transit', 'taxi', 'walking, public transit'];
  }
  
  // Planning style (binary choice)
  if (content.includes('structured') && content.includes('flexible') || (content.includes('structured') && content.includes('itinerary'))) {
    return ['structured', 'flexible'];
  }
  
  // Dietary restrictions (common options)
  if (content.includes('dietary restrictions beyond veganism') || (content.includes('dietary restrictions') && content.includes('beyond'))) {
    return ['none', 'gluten-free', 'nut-free', 'gluten-free, nut-free'];
  }
  
  // CITY SELECTION (clear choice scenario)
  if (content.includes('which city would you like to explore') || 
      (content.includes('city') && content.includes('comprehensive data for berlin'))) {
    return ['Berlin', 'Amsterdam', 'Barcelona', 'Paris'];
  }
  
  // SKIP/CONTINUE options (when interview is mentioned)
  if (content.includes('you can type "skip"') || content.includes('continue without the interview')) {
    return ['skip'];
  }
  
  // NO QUICK ACTIONS for:
  // - Travel dates (too personal/specific)
  // - Open-ended responses (recommendations, explanations)
  // - Follow-up conversations
  // - Complex recommendations
  
  return []; // No quick actions needed
}