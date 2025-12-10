import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// We assume this variable is pre-configured, valid, and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Keep track of chat sessions in memory
const chatSessions: Record<string, Chat> = {};

export const sendMessageToAI = async (
  chatId: string,
  userMessage: string,
  history: Message[]
): Promise<AsyncGenerator<string, void, unknown>> => {
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
            const c = chunk as GenerateContentResponse;
            if (c.text) {
                yield c.text;
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