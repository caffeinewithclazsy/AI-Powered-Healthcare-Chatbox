# AI-Powered Healthcare Chatbox

A full-stack healthcare symptom checker application that provides safe, general medical guidance using both rule-based responses and AI integration.

## Features

- **Dual-mode operation**: Uses both rule-based responses and OpenAI API for symptom analysis
- **Safety enforcement**: Built-in middleware blocks prescription, dosage, and brand-name queries
- **Structured responses**: Provides causes, medicine categories, home remedies, red flags, and next steps
- **Responsive UI**: Clean, accessible interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React + TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js + Express with Vercel serverless functions
- **AI Integration**: OpenAI API (optional - falls back to rule-based responses)
- **Deployment**: Vercel (frontend) with serverless functions

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/caffeinewithclazsy/AI-Powered-Healthcare-Chatbox.git
cd AI-Powered-Healthcare-Chatbox
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
Create a `.env.local` file in the `frontend` directory with the following:
```env
OPENAI_API_KEY=your_openai_api_key_here  # Optional - app works with rule-based responses
```

## Running locally

1. Start the development server:
```bash
npm run dev
```

2. Visit `http://localhost:5173` in your browser

## Deployment to Vercel

### Prerequisites
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- The Vercel CLI installed globally (optional): `npm i -g vercel`

### Deployment Steps

#### Option 1: Using Vercel CLI
1. Navigate to the frontend directory: `cd frontend`
2. Run: `vercel`
3. Follow the prompts to link your project and configure settings
4. Set the environment variables in the Vercel dashboard

#### Option 2: Deploy via GitHub
1. Push your code to the GitHub repository
2. Connect your GitHub account to Vercel
3. Import your project in Vercel
4. Configure the following settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend`
5. Add your environment variables in the Vercel dashboard under Settings → Environment Variables

### Environment Variables for Vercel

Add the following environment variable in your Vercel project settings:
- `OPENAI_API_KEY` (optional): Your OpenAI API key for enhanced responses

## Safety Features

- **Prescription blocking**: Prevents responses about specific medications or dosages
- **Brand-name filtering**: Blocks requests for specific drug brands
- **Pregnancy/nursing advice**: Refuses to provide medical advice for special populations
- **Disclaimer**: All responses include a clear disclaimer about seeking professional medical advice

## Usage

1. Describe your symptoms in the chat interface
2. Receive structured medical information including:
   - Possible causes
   - General medicine categories
   - Home remedies
   - Red flag symptoms requiring immediate care
   - Recommended next steps
3. Remember that this is for educational purposes only - always consult healthcare professionals

## Project Structure

```
frontend/
├── api/                 # Vercel serverless functions
│   └── chat.js         # Main chat API endpoint
├── src/
│   ├── components/     # React components
│   ├── utils/          # Utility functions (OpenAI integration)
│   └── App.tsx         # Main application component
├── vercel.json         # Vercel configuration
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is for educational purposes only. All responses should be verified with qualified healthcare professionals.

## Disclaimer

This application provides general health information for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.