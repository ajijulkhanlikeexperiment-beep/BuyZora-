import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize safely to avoid crashes if env is missing during dev (though strictly required by prompt)
const ai = new GoogleGenAI({ apiKey });

export const generateSEOData = async (productName: string, description: string) => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate SEO tags and a short catchy marketing title for a product named "${productName}". Description: "${description}". Return JSON.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seoTitle: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            qualityScore: { type: Type.INTEGER, description: "A score from 1-100 based on description quality" }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini SEO Error:", error);
    return { seoTitle: productName, tags: ['Trending', 'New'], qualityScore: 50 };
  }
};

export const analyzeWebsiteLink = async (url: string) => {
  try {
    // Using search grounding to "visit" or get info about the link
    const model = 'gemini-2.5-flash';
    const prompt = `Analyze this website/product link: ${url}. Categorize the main product found, compare estimated pricing if available, and give 3 suggestions to sell it better.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            productList: { type: Type.ARRAY, items: { type: Type.STRING } },
            priceComparison: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Link Analysis Error:", error);
    return {
      category: "Unknown",
      productList: ["Unable to fetch"],
      priceComparison: "N/A",
      suggestions: ["Check the URL and try again"]
    };
  }
};

export const optimizeReelMetadata = async (title: string, description: string, category: string) => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Act as an e-commerce SEO expert for a short-video shopping app.
      Analyze this product reel metadata:
      Title: "${title}"
      Description: "${description}"
      Category: "${category}"

      Return a JSON object with:
      1. "optimizedTitle": A more catchy, SEO-friendly title (keep it under 50 chars).
      2. "optimizedDescription": An improved, persuasive description (under 150 chars).
      3. "suggestedTags": An array of 5-7 viral hashtags specific to the niche.
      4. "reasoning": A very short explanation of why these changes help.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedTitle: { type: Type.STRING },
            optimizedDescription: { type: Type.STRING },
            suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return null;
  }
};

export const validateProductLink = async (url: string) => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze this URL: ${url}
      
      Task: Determine if this is a valid direct product page for an e-commerce item. 
      It should NOT be a homepage or a blog post. It must be a page where a user can buy something.
      
      Return JSON:
      {
        "isValid": boolean,
        "reason": "Short explanation of why valid or invalid (e.g. 'Looks like a homepage', 'Valid product page')",
        "platform": "Shopify" | "Amazon" | "Generic" | "Unknown"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            platform: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Link Validation Error:", error);
    // Fallback: If AI fails, we trust the regex validation done on client side
    return { isValid: true, reason: "AI Check Skipped", platform: "Unknown" };
  }
};