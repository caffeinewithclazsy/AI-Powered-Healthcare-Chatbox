import React from 'react';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender, timestamp }) => {
  return (
    <div
      className={`max-w-xs md:max-w-md rounded-lg p-4 ${
        sender === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-blue-100 text-gray-800'
      }`}
    >
      <p className="whitespace-pre-wrap">{text}</p>
      <p className="text-xs mt-2 opacity-70">
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

export default MessageBubble;