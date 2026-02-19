// Safety middleware to block risky medical requests
const safetyMiddleware = (req, res, next) => {
  const { message } = req.body;
  
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
  
  if (containsRiskyKeyword) {
    return res.status(400).json({
      error: 'Request blocked for safety reasons',
      message: 'I cannot provide prescriptions, specific dosages, or medical advice requiring professional evaluation. Please consult a healthcare provider for personalized medical advice.'
    });
  }
  
  next();
};

module.exports = safetyMiddleware;