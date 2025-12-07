
import { makeGeminiRequest } from './apiClient';

// --- TRAINING DATA ---
const INSTRUCTION_RUNWAY = `
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

// --- HELPER LOGIC ---
function cleanClause(text: string) {
    if (!text) return "";
    text = text.replace(/\([^)]*\)/g, " ");
    text = text.replace(/a smooth dolly camera/ig, " ");
    text = text.replace(/cinematic live-action/ig, " ");
    text = text.replace(/\s+/g, " ").trim();
    text = text.replace(/^and\s+/i, "");
    return text;
}

function chooseCameraPrefix(motion: string, clause: string) {
    const t = (clause || "").toLowerCase();
    const m = motion === "low" ? "low" : (motion === "high" ? "high" : "medium");

    const hasVerticalUp = /\b(rise|rises|rising|ascending|ascends|lift|lifting|soar|soars|climb|climbing)\b/.test(t);
    const hasVerticalDown = /\b(fall|falls|falling|drops|dropping|descend|descending)\b/.test(t);
    const isCircular = /\b(circle|circles|circling|orbit|orbits|orbiting|swirl|swirls|spins|spinning)\b/.test(t);
    const isWide = /\b(landscape|horizon|valley|mountain|sky|skyline|street|road|highway|city|town|panorama|wide)\b/.test(t);
    const isAction = /\b(run|runs|running|race|races|racing|rush|rushes|charging|explodes|explosion|fast)\b/.test(t);

    if (hasVerticalUp) return m === "low" ? "a gentle tilt up moves slowly as " : "a smooth crane shot rises steadily as ";
    if (hasVerticalDown) return m === "low" ? "a soft tilt down moves slowly as " : "a controlled crane shot descends steadily as ";
    if (isCircular) return m === "low" ? "a smooth orbiting camera moves slowly around " : "a steady orbiting camera moves steadily around ";
    if (isWide) return m === "low" ? "a wide cinematic camera pans slowly across " : "a wide cinematic camera pans steadily across ";
    if (isAction) return m === "low" ? "a smooth tracking camera moves slowly alongside " : "a dynamic tracking camera moves steadily alongside ";

    return m === "low" ? "a smooth dolly camera moves slowly toward " : "a steady tracking camera moves forward toward ";
}

function buildRunwayPrompt(motion: string, clause: string) {
    clause = cleanClause(clause);
    if (!clause) return "";
    if (!/^(the|a|an)\b/i.test(clause)) clause = "the subject " + clause;
    const prefix = chooseCameraPrefix(motion, clause);
    return (prefix + clause + " cinematic live-action").replace(/\s+/g, " ").trim();
}

// --- EXPORTED FUNCTION ---
export const generateRunwayPrompts = async (base64Data: string | null, apiKey: string) => {
    const rawJson = await makeGeminiRequest(INSTRUCTION_RUNWAY, base64Data, apiKey, true);
    
    return {
        low: buildRunwayPrompt("low", rawJson.low || ""),
        medium: buildRunwayPrompt("medium", rawJson.medium || ""),
        high: buildRunwayPrompt("high", rawJson.high || "")
    };
};
