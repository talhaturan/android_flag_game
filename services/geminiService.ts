
import { GoogleGenAI } from "@google/genai";

export const getFunFact = async (countryName: string): Promise<string> => {
  try {
    // Initializing Gemini client strictly using the provided API key environment variable
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me one short, interesting, and surprising fun fact about ${countryName}. Keep it under 100 characters. No intro, just the fact.`,
    });
    // Accessing the .text property directly as it is a getter, not a method
    return response.text || "Did you know this country has a fascinating history?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Exploring this country is always an adventure!";
  }
};
