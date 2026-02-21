import { SarvamAIClient } from "sarvamai";

if (!process.env["SARVAMAI_API_KEY"]) {
    console.warn("Warning: SARVAM_API_KEY is not set. Sarvam AI features will be disabled.");
}
export const sarvamClient = new SarvamAIClient({ 
    apiSubscriptionKey: process.env["SARVAMAI_API_KEY"] || "", 
});