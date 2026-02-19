# Healthcare Symptom Chatbot

A responsive web application that allows users to describe their symptoms in natural language and receive safe, general medical advice including possible causes, OTC medicine categories, home-care remedies, red-flag warnings, and guidance on when to seek a doctor.

## Features

- Natural language symptom input
- Structured medical advice response
- Safety filters to prevent dangerous medical recommendations
- Responsive design for mobile and desktop
- Rule-based fallback responder
- Optional OpenAI integration

## Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Vite (build tool)

### Backend
- Node.js + Express
- Safety middleware filters
- Rule-based response engine
- Optional OpenAI integration

## Project Structure

```
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd healthcare-chatbot
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here  # Optional, for LLM integration
```

If you don't provide an OpenAI API key, the application will use the rule-based responder.

### Running the Application

#### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a separate terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production Mode

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd ../backend
npm start
```

The application will be served at http://localhost:5000 with the frontend built assets.

## API Endpoints

### POST /api/chat
Submit symptoms and receive medical advice.

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "causes": "string",
  "medicine_categories": ["string"],
  "home_remedies": ["string"],
  "red_flags": ["string"],
  "next_steps": "string"
}
```

## Safety Features

The application includes safety middleware that blocks requests containing:
- Prescription requests
- Dosage inquiries
- Injection-related questions
- Pregnancy-specific advice requests
- Brand-name medication requests

Blocked requests receive a 400 error with a safety message.

## Optional OpenAI Integration

To enable the OpenAI integration:

1. Obtain an OpenAI API key from [OpenAI](https://platform.openai.com/)
2. Add the key to your `.env` file:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

The application uses a strict prompt template to ensure safe responses:
> "You are a cautious medical assistant. Return advice in JSON. Never give prescriptions, doses, mg amounts, or medical brand specifics. Only return general OTC categories and self-care tips. Always include a disclaimer advising professional consultation."

## Deployment

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set the build command: `cd frontend && npm install && npm run build`
4. Set the start command: `cd backend && npm install && npm start`
5. Add environment variables if needed

### Deploying to Vercel

1. Create a new project on Vercel
2. Connect your repository
3. Configure the frontend:
   - Set the build command: `npm run build`
   - Set the output directory: `dist`
   - Set the root directory: `frontend`
4. For the backend, deploy separately or use Vercel's serverless functions

### Local Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the production server:
```bash
cd ../backend
npm start
```

The application will be available at http://localhost:5000.

## Customization

### Adding More Symptoms

To add more symptoms to the rule-based responder:

1. Edit `backend/controllers/chatController.js`
2. Add a new key to the `responses` object with the symptom name
3. Define the response structure with causes, medicine categories, home remedies, red flags, and next steps

### Modifying Safety Filters

To adjust the safety filters:

1. Edit `backend/middleware/safetyMiddleware.js`
2. Modify the `riskyKeywords` array to add or remove blocked terms

## Disclaimer

This application provides general medical information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.