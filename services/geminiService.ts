import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (name: string, category: string, keywords: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. Please add your Gemini API Key to use AI features.";

  try {
    const prompt = `
      Write a compelling, luxurious, and SEO-friendly product description (approx 40-60 words) for a e-commerce item.
      Product Name: ${name}
      Category: ${category}
      Keywords/Vibe: ${keywords}
      Tone: Sophisticated, modern, appealing to fashion-conscious women.
      Output: Just the description text, no quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      }
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};

export const generateMarketingTagline = async (): Promise<string> => {
    if (!apiKey) return "Elevate Your Style.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a short, punchy, 5-word luxury fashion tagline for a bag and accessory store.",
        });
        return response.text.replace(/"/g, '') || "Elevate Your Style.";
    } catch (e) {
        return "Elevate Your Style.";
    }
}