
export const makeGeminiRequest = async (prompt: string, b64: string | null, key: string, isJson: boolean = true): Promise<any> => {
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

    // Increased attempts for robustness
    for (let attempt = 1; attempt <= 4; attempt++) {
        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`,
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
                if (res.status === 429 || res.status === 503) {
                    // Exponential backoff: 2s, 4s, 8s, 16s + Random Jitter
                    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                    console.warn(`Rate limit hit (429). Retrying in ${Math.round(delay)}ms...`);
                    await new Promise((r) => setTimeout(r, delay));
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
            // Wait a bit before network retry
            await new Promise((r) => setTimeout(r, 2000));
        }
    }

    throw new Error(lastError || "API_ERROR");
};
