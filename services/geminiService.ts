
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getClient = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key not found");
      // In a real app, handle this gracefully. For MVP, we assume it exists.
    }
    genAI = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return genAI;
};

export const initChatSession = () => {
  const client = getClient();
  chatSession = client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (text: string): Promise<string> => {
  if (!chatSession) {
    initChatSession();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  try {
    const result = await chatSession.sendMessage({ message: text });
    return result.text || "I apologize, I am having trouble responding right now. Let us pray for a moment of clarity.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing a technical issue. Please try again in a moment.";
  }
};

export const generatePrayer = async (topic: string): Promise<{ prayer: string; scripture: string }> => {
    const client = getClient();
    try {
        const result = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, heartfelt, personalized prayer addressing God directly (use "I" or "We", e.g., "Lord, I come to you...") regarding: ${topic}. Start with a petition or conversation with God, and end with a short declaration of faith. CRITICAL: Include one specific bible verse (text and reference) that is NOT generic, but strictly aligns with the specific nuances of the request regarding "${topic}" and anchors this prayer.`,
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
            prayer: "Lord, I ask for Your peace to guard my heart and mind. I declare that You are faithful to complete the good work You began in me.",
            scripture: "Philippians 1:6"
        };
    }
}
