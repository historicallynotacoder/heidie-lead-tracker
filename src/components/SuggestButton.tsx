import React, { useState } from 'react';
import { generateResponseSuggestions } from '../services/openai';

interface SuggestButtonProps {
  messages: string[];
}

export const SuggestButton: React.FC<SuggestButtonProps> = ({ messages }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const results = await generateResponseSuggestions(messages);
      setSuggestions(results);
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <button
        onClick={handleGenerateSuggestions}
        disabled={loading}
        className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Generating...' : 'Suggest a draft response'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold text-gray-700">Suggested Responses:</h3>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="text-xs font-semibold text-gray-500 mb-2">
                Option {index + 1}
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">
                {suggestion}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
