// Utility function for OpenAI integration
import OpenAI from 'openai';

// Check if OpenAI API key is provided
const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0;

let openai = null;

if (hasOpenAIKey) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// System prompt for the AI
const SYSTEM_PROMPT = `You are a cautious medical assistant.
Return advice in JSON.
Never give prescriptions, doses, mg amounts, or medical brand specifics.
Only return general OTC categories and self-care tips.
Always include a disclaimer advising professional consultation.`;

// Function to get response from OpenAI
const getOpenAIResponse = async (userMessage) => {
  if (!openai) {
    throw new Error('OpenAI API key not configured - falling back to rule-based responses');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      // If parsing fails, return a structured response
      return {
        causes: "Unable to determine specific causes from the provided information.",
        medicine_categories: ["general pain reliever"],
        home_remedies: ["Rest and stay hydrated", "Monitor your symptoms"],
        red_flags: ["Severe pain", "Difficulty breathing", "High fever"],
        next_steps: "Consult with a healthcare provider for accurate diagnosis and treatment.\n\nDISCLAIMER: This advice is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
      };
    }
  } catch (error) {
    throw new Error(`Failed to get response from OpenAI: ${error.message}`);
  }
};

export { getOpenAIResponse, hasOpenAIKey };