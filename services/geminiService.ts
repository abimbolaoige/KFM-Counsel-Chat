
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getClient = () => {
  if (!genAI) {
    // SECURITY NOTE: In a static no-build deployment, we cannot access process.env.
    // Using the hardcoded key provided.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Gemini API Key missing.");
      throw new Error("Missing Gemini API Key");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const initChatSession = () => {
  try {
    const client = getClient();
    chatSession = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to init chat session:", error);
    return null;
  }
};

export const sendMessageToGemini = async (text: string): Promise<string> => {
  if (!chatSession) {
    initChatSession();
  }

  if (!chatSession) {
    return "Configuration Error: API Key missing or client failed to initialize.";
  }

  try {
    const result = await chatSession.sendMessage({ message: text });
    return result.text || "I apologize, I am having trouble responding right now. Let us pray for a moment of clarity.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Surface specific error messages for debugging
    if (error.status === 403) return "Error 403: API Key Invalid or Quota Exceeded.";
    if (error.status === 429) return "Error 429: Rate limit exceeded. Please wait a moment.";
    if (error.message?.includes('API key not valid')) return "Error: Invalid API Key provided.";

    return `(Error: ${error.message || 'Unknown API Error'}). Please try again.`;
  }
};

export const generatePrayer = async (topic: string): Promise<{ prayer: string; scripture: string }> => {
  try {
    const client = getClient();
    const result = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, heartfelt, personalized prayer addressing God directly (use "I" or "We", e.g., "Lord, I come to you...") regarding: ${topic}. Start with a petition or conversation with God, and end with a short declaration of faith. 
            
            Instructions:
            1. Use "Jesus Christ", "Jesus", or "Christ" specifically where necessary and required to anchor the prayer.
            2. CRITICAL: Include one specific bible verse (text and reference) that is NOT generic, but strictly aligns with the specific nuances of the request regarding "${topic}" and anchors this prayer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prayer: { type: Type.STRING, description: "The personalized prayer text (Prayer to God + Declaration line)" },
            scripture: { type: Type.STRING, description: "The full scripture text and reference (e.g. 'Trust in the Lord... - Proverbs 3:5') that specifically supports the prayer topic." }
          }
        }
      },
    });

    if (result.text) {
      return JSON.parse(result.text);
    }
    throw new Error("No response text");
  } catch (e) {
    console.error("Prayer generation error", e);
    return {
      prayer: "Lord Jesus, I ask for Your peace to guard my heart and mind. I declare that You are faithful to complete the good work You began in me.",
      scripture: "Philippians 1:6"
    };
  }
}
