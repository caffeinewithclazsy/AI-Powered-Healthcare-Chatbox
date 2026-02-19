// Vercel API route for chat functionality
import { getOpenAIResponse, hasOpenAIKey } from '../src/utils/openai';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    
    // Allergy symptoms
    allergy: {
      causes: "Allergies occur when the immune system reacts to substances like pollen, dust, pet dander, or certain foods.",
      medicine_categories: ["antihistamine", "decongestant"],
      home_remedies: ["Avoid known allergens", "Use air purifiers", "Shower after being outdoors"],
      red_flags: ["Difficulty breathing", "Swelling of face or throat", "Severe rash or hives", "Dizziness"],
      next_steps: "Identify and avoid triggers. Over-the-counter antihistamines may help. Seek emergency care if experiencing severe allergic reactions."
    },
    
    // Asthma symptoms
    asthma: {
      causes: "Asthma involves inflammation and narrowing of airways, often triggered by allergens, exercise, or irritants.",
      medicine_categories: ["bronchodilator", "inhaled corticosteroid"],
      home_remedies: ["Use prescribed inhaler as directed", "Avoid triggers like smoke or strong odors", "Practice breathing exercises"],
      red_flags: ["Severe shortness of breath", "Unable to speak in full sentences", "Blue lips or fingernails", "Peak flow meter readings in danger zone"],
      next_steps: "Follow your asthma action plan. Use rescue inhaler as prescribed. Seek emergency care if symptoms don't improve or worsen rapidly."
    },
    
    // Diabetes-related symptoms
    diabetes: {
      causes: "Diabetes affects blood sugar regulation. Type 1 is autoimmune, Type 2 is often related to insulin resistance.",
      medicine_categories: ["insulin", "oral hypoglycemic agents"],
      home_remedies: ["Monitor blood sugar regularly", "Follow prescribed meal plan", "Exercise regularly as advised"],
      red_flags: ["Very high or low blood sugar", "Frequent urination with extreme thirst", "Unexplained weight loss", "Blurred vision"],
      next_steps: "Work closely with healthcare provider to manage blood sugar. Regular monitoring and medication adherence are crucial."
    },
    
    // Hypertension symptoms
    hypertension: {
      causes: "High blood pressure can result from genetics, lifestyle factors, obesity, or other medical conditions.",
      medicine_categories: ["blood pressure medication", "diuretic"],
      home_remedies: ["Reduce sodium intake", "Regular physical activity", "Stress management techniques"],
      red_flags: ["Severe headache", "Chest pain", "Shortness of breath", "Vision problems"],
      next_steps: "Monitor blood pressure regularly. Lifestyle changes and medications as prescribed by doctor are important for management."
    },
    
    // Arthritis symptoms
    arthritis: {
      causes: "Arthritis involves joint inflammation, with osteaarthrosis from wear and rheumatoid arthritis from autoimmune processes.",
      medicine_categories: ["anti-inflammatory", "pain reliever"],
      home_remedies: ["Gentle exercise and stretching", "Hot and cold therapy", "Weight management"],
      red_flags: ["Severe joint swelling", "Inability to move joint", "Fever with joint pain", "Sudden worsening"],
      next_steps: "Physical therapy and medications can help. Consult a healthcare provider for proper diagnosis and treatment plan."
    },
    
    // Depression symptoms
    depression: {
      causes: "Depression involves chemical imbalances in the brain and can be triggered by life events, genetics, or medical conditions.",
      medicine_categories: ["antidepressant", "mood stabilizer"],
      home_remedies: ["Regular exercise", "Maintain social connections", "Establish daily routines"],
      red_flags: ["Thoughts of self-harm or suicide", "Inability to function", "Complete loss of interest", "Extreme hopelessness"],
      next_steps: "Professional counseling and possibly medication can be effective. Contact mental health services immediately if experiencing suicidal thoughts."
    },
    
    // Anxiety symptoms
    anxiety: {
      causes: "Anxiety disorders involve excessive worry, fear, or nervousness that interfere with daily activities.",
      medicine_categories: ["anxiolytic", "antidepressant"],
      home_remedies: ["Deep breathing exercises", "Progressive muscle relaxation", "Mindfulness meditation"],
      red_flags: ["Panic attacks", "Chest pain", "Difficulty breathing", "Overwhelming fear"],
      next_steps: "Therapy and sometimes medication can help. Practice relaxation techniques and consider professional support."
    },
    
    // Heart-related symptoms
    heart: {
      causes: "Heart conditions include coronary artery disease, heart failure, arrhythmias, and other cardiovascular issues.",
      medicine_categories: ["blood thinner", "beta blocker", "ACE inhibitor"],
      home_remedies: ["Follow heart-healthy diet", "Regular moderate exercise", "Stress reduction"],
      red_flags: ["Chest pain or pressure", "Shortness of breath", "Irregular heartbeat", "Dizziness or fainting"],
      next_steps: "Seek immediate medical attention for chest pain. Regular checkups and cardiac rehabilitation programs are important."
    },
    
    // Skin conditions
    skin: {
      causes: "Skin conditions can include eczema, psoriasis, acne, fungal infections, or allergic reactions.",
      medicine_categories: ["topical steroid", "antifungal", "moisturizer"],
      home_remedies: ["Keep skin clean and moisturized", "Avoid harsh soaps", "Identify and avoid triggers"],
      red_flags: ["Spreading rash", "Signs of infection", "Severe itching disrupting sleep", "Fever with rash"],
      next_steps: "Proper skincare routine and avoiding triggers help. Consult dermatologist for persistent or severe conditions."
    },
    
    // Back pain
    back: {
      causes: "Back pain can result from muscle strain, disc problems, poor posture, or underlying conditions.",
      medicine_categories: ["pain reliever", "muscle relaxant"],
      home_remedies: ["Gentle stretching", "Heat or ice therapy", "Improving posture"],
      red_flags: ["Numbness or weakness in legs", "Loss of bladder control", "Severe unrelenting pain", "Fever with back pain"],
      next_steps: "Physical therapy and gradual return to activity often help. See a healthcare provider if pain persists or worsens."
    },
    
    // Joint pain
    joint: {
      causes: "Joint pain can stem from arthritis, injury, overuse, or inflammatory conditions.",
      medicine_categories: ["anti-inflammatory", "pain reliever"],
      home_remedies: ["Rest and gentle movement", "Ice or heat application", "Supportive braces if needed"],
      red_flags: ["Inability to move joint", "Severe swelling", "Redness and warmth", "Fever with joint pain"],
      next_steps: "Balance rest with gentle movement. Physical therapy and proper treatment depend on the underlying cause."
    },
    
    // Eye symptoms
    eye: {
      causes: "Eye problems can include dry eyes, infections, allergies, or vision changes.",
      medicine_categories: ["artificial tears", "antihistamine eye drops"],
      home_remedies: ["Rest eyes regularly", "Use proper lighting", "Avoid rubbing eyes"],
      red_flags: ["Sudden vision loss", "Severe eye pain", "Chemical exposure", "Injury to eye"],
      next_steps: "See an eye care professional for persistent symptoms. Protect eyes from harmful light and foreign objects."
    },
    
    // Sleep issues
    sleep: {
      causes: "Sleep problems can result from stress, schedule disruptions, medical conditions, or sleep disorders.",
      medicine_categories: ["sleep aid", "melatonin"],
      home_remedies: ["Maintain regular sleep schedule", "Create relaxing bedtime routine", "Optimize sleep environment"],
      red_flags: ["Excessive daytime sleepiness", "Stopping breathing during sleep", "Severe insomnia", "Sleep behaviors that are dangerous"],
      next_steps: "Good sleep hygiene practices are important. Consult a healthcare provider if sleep problems persist despite lifestyle changes."
    },
    
    // Urinary symptoms
    urinary: {
      causes: "Urinary issues can include infections, kidney stones, or prostate problems.",
      medicine_categories: ["antibiotic", "pain reliever"],
      home_remedies: ["Increase fluid intake", "Empty bladder completely", "Practice good hygiene"],
      red_flags: ["Severe pain", "Blood in urine", "Inability to urinate", "Fever with urinary symptoms"],
      next_steps: "UTIs often require antibiotics. See a healthcare provider promptly for proper diagnosis and treatment."
    },
    
    // Mental health - Stress
    stress: {
      causes: "Chronic stress can result from work, relationships, financial pressures, or health concerns.",
      medicine_categories: ["anti-anxiety", "sleep aid"],
      home_remedies: ["Regular exercise", "Meditation or mindfulness", "Time management techniques"],
      red_flags: ["Constant anxiety", "Physical symptoms interfering with daily life", "Thoughts of self-harm", "Substance abuse"],
      next_steps: "Stress management techniques and counseling can be very helpful. Consider professional support for chronic stress."
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

  try {
    // Use OpenAI if API key is configured, otherwise use rule-based responses
    if (hasOpenAIKey) {
      try {
        const aiResponse = await getOpenAIResponse(message);
        
        // Add disclaimer to AI response
        const disclaimer = "\n\nDISCLAIMER: This advice is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";
        
        return res.status(200).json({
          ...aiResponse,
          next_steps: aiResponse.next_steps + disclaimer
        });
      } catch (aiError) {
        console.error('OpenAI error:', aiError.message);
        // Fall back to rule-based responses if OpenAI fails
      }
    }
    
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
    } else if (lowerMessage.includes('allerg') || lowerMessage.includes('sneeze') || lowerMessage.includes('itchy') || lowerMessage.includes('rash')) {
      responseKey = 'allergy';
    } else if (lowerMessage.includes('asthma') || lowerMessage.includes('wheeze') || lowerMessage.includes('short of breath') || lowerMessage.includes('breathing')) {
      responseKey = 'asthma';
    } else if (lowerMessage.includes('diabet') || lowerMessage.includes('sugar') || lowerMessage.includes('glucose') || lowerMessage.includes('insulin')) {
      responseKey = 'diabetes';
    } else if (lowerMessage.includes('blood pressure') || lowerMessage.includes('hypertension') || lowerMessage.includes('high bp')) {
      responseKey = 'hypertension';
    } else if (lowerMessage.includes('arthritis') || lowerMessage.includes('joint pain') || lowerMessage.includes('stiff joints')) {
      responseKey = 'arthritis';
    } else if (lowerMessage.includes('depress') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless') || lowerMessage.includes('worthless')) {
      responseKey = 'depression';
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('nervous') || lowerMessage.includes('panic')) {
      responseKey = 'anxiety';
    } else if (lowerMessage.includes('heart') || lowerMessage.includes('chest pain') || lowerMessage.includes('palpitation') || lowerMessage.includes('cardiac')) {
      responseKey = 'heart';
    } else if (lowerMessage.includes('skin') || lowerMessage.includes('rash') || lowerMessage.includes('eczema') || lowerMessage.includes('psoriasis')) {
      responseKey = 'skin';
    } else if (lowerMessage.includes('back pain') || lowerMessage.includes('lower back') || lowerMessage.includes('spine') || lowerMessage.includes('herniated')) {
      responseKey = 'back';
    } else if (lowerMessage.includes('joint') || lowerMessage.includes('knee pain') || lowerMessage.includes('hip pain') || lowerMessage.includes('shoulder pain')) {
      responseKey = 'joint';
    } else if (lowerMessage.includes('eye') || lowerMessage.includes('vision') || lowerMessage.includes('blurry') || lowerMessage.includes('seeing')) {
      responseKey = 'eye';
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('can\'t sleep') || lowerMessage.includes('tired')) {
      responseKey = 'sleep';
    } else if (lowerMessage.includes('urin') || lowerMessage.includes('pee') || lowerMessage.includes('bladder') || lowerMessage.includes('kidney')) {
      responseKey = 'urinary';
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('burnout')) {
      responseKey = 'stress';
    } else if (lowerMessage.match(/^(hello|hi|hey|good morning|good afternoon|good evening|greetings)/)) {
      return res.status(200).json({
        causes: "Hello there! I'm glad you reached out. I'm here to assist you with health information in a safe and informative way.",
        medicine_categories: ["none needed"],
        home_remedies: ["Welcome to our health conversation", "Share your concerns openly", "Ask questions freely"],
        red_flags: ["None at this moment"],
        next_steps: "Tell me about what's been bothering you lately. For example, you might say 'I've been having some troubling symptoms' or 'I'd like to know about this pain I've been experiencing.'"
      });
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
      return res.status(200).json({
        causes: "You're very welcome! I'm happy to help with your health questions. It's important to stay informed about your wellbeing.",
        medicine_categories: ["none needed"],
        home_remedies: ["Continue learning about health topics", "Keep asking questions", "Stay engaged with your health"],
        red_flags: ["None at this moment"],
        next_steps: "Is there anything else you'd like to discuss about your health? I'm here to continue our educational conversation. Remember, I provide general information, but always consult healthcare professionals for personal medical decisions."
      });
    } else if (lowerMessage.match(/^(how are you|how do you do|what\'s up|how\'s it going|how are things)/)) {
      return res.status(200).json({
        causes: "I'm doing well, thank you for asking! I'm here and ready to have a productive health conversation with you.",
        medicine_categories: ["none needed"],
        home_remedies: ["Focus on your health journey", "Explore wellness topics", "Develop health awareness"],
        red_flags: ["None at this moment"],
        next_steps: "What health topics would you like to explore today? Perhaps you have symptoms you'd like to discuss or general wellness questions you'd like to learn about."
      });
    } else if (lowerMessage.match(/^(bye|goodbye|see you|take care|later|farewell)/)) {
      return res.status(200).json({
        causes: "Thank you for this health conversation! It's been great learning about your concerns together.",
        medicine_categories: ["none needed"],
        home_remedies: ["Reflect on our discussion", "Practice good health habits", "Continue learning about wellness"],
        red_flags: ["None at this moment"],
        next_steps: "Feel free to return anytime you have health questions. Remember that while I provide educational information, professional medical advice should come from qualified healthcare providers. Take care!"
      });
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('fatigue') || lowerMessage.includes('exhausted') || lowerMessage.includes('sleepy')) {
      responseKey = 'default';
      responses.default.causes = "Feeling tired can be due to lack of sleep, stress, nutritional deficiencies, or various health factors. It's important to understand what might be causing your fatigue.";
      responses.default.next_steps = "Try getting adequate rest and staying hydrated. If fatigue persists for more than a week, consider consulting a healthcare provider. Let's continue discussing your health concerns to better understand your situation.";
    } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('aches') || lowerMessage.includes('sore')) {
      responseKey = 'default';
      responses.default.causes = "Pain can result from injuries, inflammation, tension, or various health conditions. Understanding the type and location of pain is important for proper care.";
      responses.default.next_steps = "For mild pain, rest and over-the-counter pain relievers may help. If pain is severe or persistent, seek medical attention. Let's explore this further in our conversation.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('advice')) {
      return res.status(200).json({
        causes: "I'm here to help you understand health information better. My role is to provide educational insights about symptoms and general wellness.",
        medicine_categories: ["none needed"],
        home_remedies: ["Share your health concerns", "Learn about symptoms", "Understand wellness options"],
        red_flags: ["None at this moment"],
        next_steps: "Please describe your health concerns in more detail. For example, you can tell me about specific symptoms you're experiencing, when they started, or what makes them better or worse."
      });
    } else if (lowerMessage.includes('tell me') || lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('what are')) {
      responseKey = 'default';
      responses.default.causes = "That's a great question! Let me help you understand this health topic better. Learning about your symptoms can help you make informed decisions about your health.";
      responses.default.next_steps = "I'd love to continue our educational conversation. Please share more details about what specifically you'd like to know, and I'll provide general information to help increase your health literacy. Remember to always verify with a healthcare professional.";
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