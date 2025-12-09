
export interface PromptResult {
    low: string;
    medium: string;
    high: string;
    description: string;
}

export const apiCall = async (prompt: string, b64: string | null, key: string, isJson: boolean = true): Promise<any> => {
    const generationConfig = isJson
        ? { responseMimeType: "application/json" }
        : { responseMimeType: "text/plain" };

    let lastError = null;

    const parts: any[] = [{ text: prompt }];
    if (b64) {
        parts.push({
            inlineData: {
                mimeType: "image/jpeg",
                data: b64
            }
        });
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: parts
                            }
                        ],
                        generationConfig: generationConfig
                    })
                }
            );

            if (!res.ok) {
                lastError = `HTTP_${res.status}`;
                if (res.status === 429) {
                    await new Promise((r) => setTimeout(r, 4000)); // Longer wait for rate limit
                    continue;
                }
            } else {
                const j = await res.json();
                const txt =
                    j.candidates?.[0]?.content?.parts?.[0]?.text ||
                    (isJson ? "{}" : "");

                if (!txt || !txt.trim()) {
                    lastError = "EMPTY_RESPONSE";
                } else if (isJson) {
                    const clean = txt.replace(/```json|```/g, "").trim();
                    try {
                        return JSON.parse(clean);
                    } catch (e) {
                        lastError = "JSON_PARSE_ERROR";
                    }
                } else {
                    return txt.trim();
                }
            }
        } catch (e: any) {
            lastError = (e && e.message) ? e.message : "NETWORK_ERROR";
        }

        if (attempt < 3) {
            await new Promise((r) => setTimeout(r, 2000));
        }
    }

    throw new Error(lastError || "API_ERROR");
};

export const instructionRunway = () => `
You see a still image. Your task is to describe motion at three intensities: low, medium, and high.

ABSOLUTE RULES:
- Describe ONLY motion of things that are visible or obviously implied.
- Do NOT invent new locations.
- Do NOT mention any camera movement.
- Do NOT write "a smooth dolly camera".
- Do NOT write "cinematic live-action".
- Do NOT wrap anything in parentheses.

OUTPUT FORMAT (JSON ONLY):
{
  "low":    "<low-motion clause>",
  "medium": "<medium-motion clause>",
  "high":   "<high-motion clause>"
}
`;

export const instructionDescribe = () => `
You see a still image. Write a detailed, natural-language description of the image roughly 80–220 words.
Describe scene, subject, lighting, style.
`;

export const metadataExamples = `
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
