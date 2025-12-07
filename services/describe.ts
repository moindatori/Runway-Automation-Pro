
import { makeGeminiRequest } from './apiClient';

// --- TRAINING DATA ---
const INSTRUCTION_DESCRIBE = `
You see a still image. Write a detailed, natural-language description of the image suitable as a high-quality text prompt for an image-to-image or image generation model.

REQUIREMENTS:
- 1 single paragraph, roughly 80–220 words.
- Professional, clear, neutral English.
- Describe:
  • Overall scene and setting.
  • Main subject(s) and their appearance.
  • Important objects and composition.
  • Lighting, color palette, mood, and atmosphere.
  • Camera angle and perspective if obvious.
  • Style: photo, digital illustration, 3D render, medical diagram, etc.
- Stay strictly inside what can reasonably be seen in the image.

STYLE:
Your style should be similar in richness and structure to descriptions like the examples provided.`;

// --- EXPORTED FUNCTION ---
export const generateImageDescription = async (base64Data: string | null, apiKey: string) => {
    const rawText = await makeGeminiRequest(INSTRUCTION_DESCRIBE, base64Data, apiKey, false);
    return rawText;
};
