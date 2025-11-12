import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import type { LeadTracker, ParsedMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { SuggestButton } from './SuggestButton';

interface ChatPanelProps {
  lead: LeadTracker;
}

const parseMessages = (messages: string[]): ParsedMessage[] => {
  return [...messages].reverse().map((msg) => {
    // Split by first colon to separate sender from message
    const colonIndex = msg.indexOf(':');
    if (colonIndex === -1) {
      // If no colon found, treat entire message as unknown sender
      return {
        sender: 'Unknown',
        message: msg,
      };
    }

    const sender = msg.substring(0, colonIndex).trim();
    const message = msg.substring(colonIndex + 1).trim();

    return {
      sender,
      message,
    };
  });
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ lead }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const parsedMessages = parseMessages(lead.messages || []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lead.id]);

  const lastMessageDate = lead.recent_timestamp
    ? format(new Date(lead.recent_timestamp), 'MMMM dd, yyyy')
    : 'N/A';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 capitalize">
          {lead.username}
        </h2>
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p>Last message sent: {lastMessageDate}</p>
          <p>Last sender: {lead.latest_sender}</p>
          <p>
            Status:{' '}
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                lead.action_item === 'Follow up'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {lead.action_item}
            </span>
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {parsedMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages in this conversation
          </div>
        ) : (
          <>
            {parsedMessages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* AI Suggestion Button */}
      {lead.messages && lead.messages.length > 0 && (
        <SuggestButton messages={lead.messages} />
      )}
    </div>
  );
};
