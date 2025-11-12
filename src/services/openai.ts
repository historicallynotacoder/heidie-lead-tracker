export async function generateResponseSuggestions(messages: string[]): Promise<string[]> {
  try {
    const response = await fetch('/.netlify/functions/generate-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate suggestions');
    }

    const data = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    throw error;
  }
}
