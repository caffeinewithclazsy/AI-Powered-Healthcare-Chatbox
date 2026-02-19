// Vercel API route for chat functionality

// Safety middleware function
const safetyCheck = (message) => {
  // Keywords that indicate risky requests
  const riskyKeywords = [
    'prescription',
    'dose',
    'mg',
    'milligram',
    'injection',
    'inject',
    'pregnancy',
    'pregnant',
    'breastfeeding',
    'nursing',
    'doctor prescription',
    'specific medication',
    'brand name',
    'exact dosage'
  ];

  // Check if message contains any risky keywords
  const containsRiskyKeyword = riskyKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );

  return containsRiskyKeyword;
};

// Main handler function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Safety check
    if (safetyCheck(message)) {
      return res.status(400).json({
        error: 'Request blocked for safety reasons',
        message: 'I cannot provide prescriptions, specific dosages, or medical advice requiring professional evaluation. Please consult a healthcare provider for personalized medical advice.'
      });
    }

    // Comprehensive rule-based responses for common symptoms and conditions
    const responses = {
      // Fever-related symptoms
      fever: {
        causes: "Fever is commonly caused by infections (viral or bacterial), inflammation, or immune responses.",
        medicine_categories: ["pain reliever", "fever reducer"],
        home_remedies: ["Stay hydrated by drinking plenty of fluids", "Rest and avoid strenuous activities", "Use a cool compress on forehead"],
        red_flags: ["Temperature above 103°F (39.4°C)", "Severe headache or stiff neck", "Difficulty breathing", "Persistent vomiting"],
        next_steps: "Monitor temperature regularly. Consult a doctor if fever persists for more than 3 days or if severe symptoms develop."
      },
      
      // Headache-related symptoms
      headache: {
        causes: "Headaches can be caused by stress, dehydration, eye strain, lack of sleep, or sinus congestion.",
        medicine_categories: ["pain reliever", "anti-inflammatory"],
        home_remedies: ["Apply a cold or warm compress to head/neck", "Ensure adequate hydration", "Rest in a dark, quiet room"],
        red_flags: ["Sudden, severe headache unlike any before", "Headache with fever, stiff neck, confusion", "Headache after a head injury"],
        next_steps: "Most headaches resolve with rest. See a doctor for recurring severe headaches or those accompanied by neurological symptoms."
      },
      
      // Cold/flu symptoms
      cold: {
        causes: "Common cold is caused by viruses, most commonly rhinoviruses, affecting the upper respiratory tract.",
        medicine_categories: ["decongestant", "cough suppressant", "throat lozenge"],
        home_remedies: ["Drink warm liquids like tea with honey", "Gargle with warm salt water", "Use a humidifier or breathe steam"],
        red_flags: ["High fever lasting more than 3 days", "Severe sinus pain", "Difficulty breathing or chest pain"],
        next_steps: "Cold symptoms typically resolve in 7-10 days. Seek medical care if symptoms worsen or persist beyond 10 days."
      },
      
      // Stomach-related symptoms
      stomach: {
        causes: "Stomach discomfort can be due to indigestion, food intolerance, gastritis, or gastrointestinal infections.",
        medicine_categories: ["antacid", "anti-nausea", "digestive aid"],
        home_remedies: ["Eat bland foods like crackers or toast", "Stay hydrated with small sips of water", "Avoid spicy, fatty, or acidic foods"],
        red_flags: ["Severe abdominal pain", "Persistent vomiting or diarrhea", "Blood in vomit or stool", "Signs of dehydration"],
        next_steps: "Minor stomach issues often resolve with diet adjustments. Consult a doctor for persistent symptoms or signs of dehydration."
      },
      
      // Default response for unrecognized symptoms
      default: {
        causes: "I'm not familiar with those specific symptoms. They could be related to various conditions.",
        medicine_categories: ["general pain reliever", "anti-inflammatory"],
        home_remedies: ["Rest and stay hydrated", "Monitor your symptoms", "Maintain a healthy diet"],
        red_flags: ["Severe pain", "Difficulty breathing", "High fever", "Persistent vomiting"],
        next_steps: "Since I'm not familiar with these symptoms, it's best to consult with a healthcare provider for accurate diagnosis and treatment."
      }
    };

    // Enhanced HLL-style conversational matching
    let responseKey = 'default';
    
    // Convert message to lowercase for comparison
    const lowerMessage = message.toLowerCase().trim();
    
    // Check for different conversational patterns in HLL style
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('hot') || lowerMessage.includes('burning up')) {
      responseKey = 'fever';
    } else if (lowerMessage.includes('headache') || lowerMessage.includes('head ache') || lowerMessage.includes('head hurts') || lowerMessage.includes('head pain')) {
      responseKey = 'headache';
    } else if (lowerMessage.includes('cold') || lowerMessage.includes('flu') || 
               lowerMessage.includes('cough') || lowerMessage.includes('runny nose') || lowerMessage.includes('sneezing')) {
      responseKey = 'cold';
    } else if (lowerMessage.includes('stomach') || lowerMessage.includes('nausea') ||
               lowerMessage.includes('vomit') || lowerMessage.includes('diarrhea') || lowerMessage.includes('stomach ache')) {
      responseKey = 'stomach';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('advice')) {
      return res.status(200).json({
        causes: "I'm here to help you understand health information better. My role is to provide educational insights about symptoms and general wellness.",
        medicine_categories: ["none needed"],
        home_remedies: ["Share your health concerns", "Learn about symptoms", "Understand wellness options"],
        red_flags: ["None at this moment"],
        next_steps: "Please describe your health concerns in more detail. For example, you can tell me about specific symptoms you're experiencing, when they started, or what makes them better or worse."
      });
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return res.status(200).json({
        causes: "Hello there! I'm glad you reached out. I'm here to assist you with health information in a safe and informative way.",
        medicine_categories: ["none needed"],
        home_remedies: ["Welcome to our health conversation", "Share your concerns openly", "Ask questions freely"],
        red_flags: ["None at this moment"],
        next_steps: "Tell me about what's been bothering you lately. For example, you might say 'I've been having some troubling symptoms' or 'I'd like to know about this pain I've been experiencing.'"
      });
    }

    // Add disclaimer to all responses
    const response = responses[responseKey];
    const disclaimer = "\n\nDISCLAIMER: This advice is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Our conversation is meant to enhance your health literacy, but professional medical decisions should always involve qualified healthcare providers.";

    res.status(200).json({
      ...response,
      next_steps: response.next_steps + disclaimer
    });
  } catch (error) {
    console.error('Error processing chat response:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request. Please try again.'
    });
  }
}

// Enable body parsing for this API route
export const config = {
  api: {
    bodyParser: true,
  },
};