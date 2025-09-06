import { GoogleGenAI } from "@google/genai";
import { Trade } from '../types';

// FIX: Initialize GoogleGenAI with apiKey from environment variables using a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getAIInsight = async (trades: Trade[]): Promise<string> => {
  try {
    // Remove 'id' for a cleaner prompt and stringify the trade data.
    const tradesString = JSON.stringify(trades.map(({id, ...rest}) => rest), null, 2);
    
    const prompt = `
      Analyze the following trading data of a retail trader and provide concise, actionable insights.
      The trader wants to understand their psychological patterns, strengths, and weaknesses.
      Focus on patterns related to instruments, direction (Long/Short), P&L, and tags.
      For example, do they perform better on certain days, with certain setups (tags), or instruments?
      Provide 3-4 bullet points of key takeaways.

      Trading Data:
      ${tradesString}
    `;

    // FIX: Use the correct model 'gemini-2.5-flash' and method 'ai.models.generateContent' as per guidelines.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    // FIX: Access the generated text directly from the 'text' property of the response as per guidelines.
    return response.text;
  } catch (error) {
    console.error("Error getting AI insight:", error);
    throw new Error("Failed to generate insight from Gemini API.");
  }
};
