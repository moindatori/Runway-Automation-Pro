
export const makeOpenAIRequest = async (prompt: string, b64: string | null, key: string, isJson: boolean = true): Promise<any> => {
    const url = "https://api.openai.com/v1/chat/completions";
    let lastError = null;

    // Retry loop
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const messages: any[] = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt }
                    ]
                }
            ];

            // If image exists, add it to content array
            if (b64) {
                // The b64 coming from imageUtils usually lacks the prefix, but check to be sure
                const imageUrl = b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}`;
                
                messages[0].content.push({
                    type: "image_url",
                    image_url: {
                        url: imageUrl,
                        detail: "low" // 'low' is faster and cheaper, sufficient for metadata/prompting
                    }
                });
            }

            const body: any = {
                model: "gpt-4o-mini",
                messages: messages,
                max_tokens: isJson ? 1000 : 500,
                temperature: 0.4
            };

            // Enforce JSON object if requested
            if (isJson) {
                body.response_format = { type: "json_object" };
            }

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + key
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                lastError = `HTTP_${res.status}`;
                if (res.status === 429 || res.status === 503) {
                    // Exponential backoff for rate limits
                    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                    console.warn(`Rate limit hit (${res.status}). Retrying in ${Math.round(delay)}ms...`);
                    await new Promise((r) => setTimeout(r, delay));
                    continue;
                }
                const errText = await res.text();
                throw new Error(`API Error: ${res.status} - ${errText}`);
            } else {
                const j = await res.json();
                const msg = j.choices?.[0]?.message;
                let txt = "";

                if (msg?.content) {
                    txt = msg.content;
                }

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
            await new Promise((r) => setTimeout(r, 2000));
        }
    }

    throw new Error(lastError || "API_ERROR");
};
