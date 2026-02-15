import { createAnthropic } from "@ai-sdk/anthropic";
import { aisdk } from '@openai/agents-extensions';

if(!process.env["CLAUDE_API_KEY"]) {
    throw new Error("CLAUDE_API_KEY is not set in environment variables");
}

const anthropicClient = createAnthropic({
    apiKey: process.env["CLAUDE_API_KEY"] 
});

const model = aisdk(anthropicClient("claude-haiku-4-5-20251001"));
export default model;


