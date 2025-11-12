import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Note: In production, you'd want to use a backend proxy
});

export async function generateResponseSuggestions(messages: string[]): Promise<string[]> {
  try {
    const conversationText = [...messages].reverse().join('\n');

    const prompt = `Based on the following conversation, generate 2 response options that Heidie Signature could send next to either re-engage or follow up on a message, depending on who sent the last message and the context. The responses should be professional, friendly, and relevant to the conversation context in a mix of Alex Hormozi and Dan Martell style.

Conversation:
${conversationText}

Please provide 2 distinct response options, labeled as "Option 1:" and "Option 2:".`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful social media and marketing assistant that generates professional and friendly message responses for a business owner who paints custom watercolors of homes for real estate agents.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    // Parse the response to extract the two options
    const options: string[] = [];
    const option1Match = responseText.match(/Option 1:([\s\S]*?)(?=Option 2:|$)/i);
    const option2Match = responseText.match(/Option 2:([\s\S]*?)$/i);

    if (option1Match) {
      options.push(option1Match[1].trim());
    }
    if (option2Match) {
      options.push(option2Match[1].trim());
    }

    // If parsing failed, just return the whole response split by paragraphs
    if (options.length === 0) {
      const paragraphs = responseText.split('\n\n').filter(p => p.trim().length > 0);
      return paragraphs.slice(0, 2);
    }

    return options;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    throw error;
  }
}
