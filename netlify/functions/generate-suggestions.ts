import OpenAI from 'openai';

export async function handler(event: any) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { messages } = JSON.parse(event.body);

    // Initialize OpenAI with server-side API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Reverse messages to get chronological order (oldest first)
    const conversationText = [...messages].reverse().join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful social media and marketing assistant that generates professional and friendly message responses for a business owner who paints custom watercolors of homes for real estate agents.'
        },
        {
          role: 'user',
          content: `Based on the following conversation, generate 2 response options that Heidie Signature could send next to either re-engage or follow up on a message, depending on who sent the last message and the context. The responses should be professional, friendly, and relevant to the conversation context in a mix of Alex Hormozi and Dan Martell style.

Conversation:
${conversationText}

Please provide 2 distinct response options, labeled as "Option 1:" and "Option 2:".`
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
      return {
        statusCode: 200,
        body: JSON.stringify({ suggestions: paragraphs.slice(0, 2) }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ suggestions: options }),
    };
  } catch (error: any) {
    console.error('Error in generate-suggestions function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to generate suggestions' }),
    };
  }
}
