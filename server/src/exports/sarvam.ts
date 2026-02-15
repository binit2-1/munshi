import { SarvamAIClient } from "sarvamai";

export const sarvamClient = new SarvamAIClient({ 
    apiSubscriptionKey: process.env["SARVAM_API_KEY"] || "", 
});