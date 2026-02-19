import React, { useState, useRef, useEffect } from 'react';

// Define the message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Define the bot response structure
interface BotResponse {
  causes: string;
  medicine_categories: string[];
  home_remedies: string[];
  red_flags: string[];
  next_steps: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your healthcare assistant. Please describe your symptoms and I\'ll provide general advice.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format bot response into readable format
  const formatBotResponse = (response: BotResponse): string => {
    // Special handling for conversational responses
    if (response.causes.includes('Hello there!') || 
        response.causes.includes('You\'re very welcome!') || 
        response.causes.includes('I\'m doing well') || 
        response.causes.includes('Thank you for this health conversation') ||
        response.causes.includes('I\'m here to help you understand')) {
      return [response.causes, '', response.home_remedies.join('\n'), '', response.next_steps].join('\n');
    }
    
    return `
CAUSES:
${response.causes}

MEDICINE CATEGORIES:
• ${response.medicine_categories.join('\n• ')}

HOME REMEDIES:
• ${response.home_remedies.join('\n• ')}

RED FLAGS (SEEK IMMEDIATE CARE):
• ${response.red_flags.join('\n• ')}

NEXT STEPS:
${response.next_steps}
    `.trim();
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputValue })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to get response');
      }

      const data: BotResponse = await res.json();
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: formatBotResponse(data),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages((prev: Message[]) => [...prev, botMessage]);
    } catch (error: any) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error.message || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">AI-Powered Healthcare Chatbox</h1>
          <p className="text-sm mt-1 opacity-90">
            Get safe, general advice about your symptoms. This is not a substitute for professional medical advice.
          </p>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-grow container mx-auto p-4 pb-20">
        <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto h-[calc(100vh-180px)] flex flex-col">
          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-blue-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..."
                className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className={`px-6 py-2 rounded-r-lg transition-colors ${
                  isLoading || !inputValue.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Disclaimer: This tool provides general advice only. Always consult a healthcare professional for medical concerns.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;