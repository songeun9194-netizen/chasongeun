import { GoogleGenAI } from '@google/genai';
import { ImageFile } from '../App';

let ai: GoogleGenAI | null = null;
let apiKey: string | null = null;

// Lazily initialize and get the AI client
function getAiClient(): GoogleGenAI {
  if (ai) {
    return ai;
  }

  // Check sessionStorage first
  apiKey = sessionStorage.getItem('gemini-api-key');

  if (!apiKey) {
    // If not in session, prompt the user
    apiKey = prompt("Please enter your Google Gemini API Key to use AI features:");
    if (!apiKey) {
      throw new Error("errorApiKeyMissing");
    }
    // Store the key in sessionStorage for this session only
    sessionStorage.setItem('gemini-api-key', apiKey);
  }
  
  ai = new GoogleGenAI({ apiKey });
  return ai;
}

export async function generateImageFromPrompt(prompt: string): Promise<ImageFile> {
  let client: GoogleGenAI;
  try {
    client = getAiClient();
  } catch (error) {
    console.error("Gemini client initialization failed:", error);
    throw error;
  }
  
  try {
    const response = await client.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const newSrc = `data:image/png;base64,${base64ImageBytes}`;
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            src: newSrc,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };
        img.onerror = () => {
            reject(new Error("errorLoadAIImage"));
        };
        img.src = newSrc;
      });
    } else {
        throw new Error("errorNoImage");
    }

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error && (error.message.includes('400') || error.message.includes('SAFETY'))) {
        throw new Error("errorSafety");
    }
    // If API key is invalid, clear it from session storage so the user can re-enter
    if (error instanceof Error && error.message.includes('API key not valid')) {
      sessionStorage.removeItem('gemini-api-key');
      ai = null; // Reset the client
      throw new Error("errorInvalidApiKey");
    }
    throw new Error("errorGemini");
  }
}
