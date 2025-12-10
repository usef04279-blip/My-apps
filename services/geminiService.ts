import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize safe AI instance
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Keep track of chat sessions in memory
const chatSessions: Record<string, Chat> = {};

export const sendMessageToAI = async (
  chatId: string,
  userMessage: string,
  history: Message[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  if (!ai) {
    // Fallback generator if no API key
    return (async function* () {
      yield "I'm currently offline (No API Key provided). Please configure the environment variable.";
    })();
  }

  try {
    let chatSession = chatSessions[chatId];

    if (!chatSession) {
      // Create a new session
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `You are meChat AI, a helpful, witty, and friendly assistant inside a modern messaging app called meChat. 
          Keep your responses concise and conversational, like a text message. Use emojis occasionally.`,
        },
      });
      chatSessions[chatId] = chatSession;
    }

    const resultStream = await chatSession.sendMessageStream({
        message: userMessage
    });

    // Generator function to yield chunks
    async function* streamResponse() {
        for await (const chunk of resultStream) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    }

    return streamResponse();

  } catch (error) {
    console.error("Gemini API Error:", error);
    return (async function* () {
      yield "Sorry, I'm having trouble connecting right now.";
    })();
  }
};
