import React from 'react';
import type { ParsedMessage } from '../types';

interface MessageBubbleProps {
  message: ParsedMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isHeidie = message.sender === 'Heidie Signature';

  return (
    <div className={`flex ${isHeidie ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg ${
          isHeidie
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="text-xs font-semibold mb-1 opacity-75">
          {message.sender}
        </div>
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.message}
        </div>
      </div>
    </div>
  );
};
