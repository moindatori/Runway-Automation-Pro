
import { makeOpenAIRequest } from './apiClient';

// --- TRAINING DATA ---
const METADATA_EXAMPLES = `
Example 1:
Image: A happy young child with curly blonde hair sits on grass, surrounded by two playful baby goats. Sunlight filters through the trees.
Output: {
 "title": "Joyful child with adorable baby goats on a sunny farm",
 "keywords": "child,kid,girl,blonde hair,curly hair,smiling,happy,joyful,goat,baby goat,kid goat,farm,animal,pet,outdoors,grass,sunny,daylight,summer,countryside,rural,nature,cute,adorable,young,childhood,innocence,playful,livestock,farm animal",
 "category_id": 1
}

Example 2:
Image: A man in a suit and glasses smiles while holding a tablet, standing in a dealership filled with tractors.
Output: {
 "title": "Smiling businessman holding tablet in agricultural machinery dealership",
 "keywords": "businessman,tablet,dealership,agriculture,machinery,tractors,farming,equipment,sales,retail,professional,technology,modern,industry,rural,outdoors,transportation,vehicles,heavy equipment,farm equipment,agricultural vehicles,business owner,manager,employee,customer service,showroom,indoor,man,glasses,smiling,confident",
 "category_id": 3
}

Example 3:
Image: A vibrant orange Formula 1 car navigates a darkened race track, illuminated by stadium lights, showcasing speed and competition.
Output: {
 "title": "Orange formula 1 race car speeds down track at dusk",
 "keywords": "Formula 1,F1 car,race car,motorsport,racing,speed,track,circuit,dusk,night racing,automotive,sports,competition,driver,cockpit,aerodynamics,tire,wheel,asphalt,grandstand,stadium lights,motion blur,low light,action shot,professional racing,single seater,open wheel,fast,powerful",
 "category_id": 18
}
`;

const ADOBE_CATEGORIES = "1. Animals, 2. Buildings and Architecture, 3. Business, 4. Drinks, 5. The Environment, 6. States of Mind, 7. Food, 8. Graphic Resources, 9. Hobbies and Leisure, 10. Industry, 11. Landscape, 12. Lifestyle, 13. People, 14. Plants and Flowers, 15. Culture and Religion, 16. Science, 17. Social Issues, 18. Sports, 19. Technology, 20. Transport, 21. Travel";

// --- INTERFACES ---
export interface MetadataSettings {
    titleLen: number;
    kwCount: number;
    isSilhouette: boolean;
    isWhiteBg: boolean;
    isTransparent: boolean;
    isSingleWord: boolean;
    customPrompt: string;
    prohibitedWords: string;
    isEps: boolean;
    filename: string;
}

// --- LOGIC ---
export const generateMetadata = async (base64Data: string | null, apiKey: string, settings: MetadataSettings) => {
    
    // Build Prompt
    let instructions = [];
    if(settings.isSilhouette) instructions.push("This is a silhouette.");
    if(settings.isWhiteBg) instructions.push("This has a white background.");
    
    const keywordInstruction = settings.isSingleWord 
        ? `Generate exactly ${settings.kwCount} SINGLE-WORD keywords only.` 
        : `Generate exactly ${settings.kwCount} relevant keywords.`;

    let basePrompt = `Analyze image for Adobe Stock metadata. 
    1. Generate a descriptive Title (aim for ${settings.titleLen} characters). Do not use special characters. ${settings.isTransparent ? 'Append "isolated on transparent background" to the title.' : ''} 
    2. ${keywordInstruction} Comma separated. No special characters.
    3. Choose Category ID from: ${ADOBE_CATEGORIES}. 
    Info: ${instructions.join(" ")} ${settings.customPrompt ? "Custom: "+settings.customPrompt : ""} ${settings.prohibitedWords ? "Avoid: "+settings.prohibitedWords : ""}
    
    Use these examples as a guide for style and formatting:
    ${METADATA_EXAMPLES}

    Return JSON: "title", "keywords", "category_id" (number).`;

    let finalPrompt = basePrompt;
    let finalData = base64Data;

    if(settings.isEps) {
        finalPrompt = `Generate stock metadata for an EPS vector file named "${settings.filename}". ` + basePrompt;
    }

    const data = await makeOpenAIRequest(finalPrompt, finalData, apiKey, true);
    return data;
};
