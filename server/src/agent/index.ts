import { Agent, run } from '@openai/agents';
import { executeCommand } from './tools/executeCommand';
import model from './llmProvider/ollama';
import { systemPrompt } from './prompts/systemPrompt';
import { RedisSession } from './redisMemory';

const advisor = new Agent({
  name: 'Advisor',
  instructions: systemPrompt ,
  tools: [executeCommand],
  model,
});

const sessionStore = new RedisSession(); 

export async function getAgentResponse(userInput: string, userId: string): Promise<string> {
  try {
    if (userId) {
      sessionStore.setSessionId(userId); // TODO when user auth is implemented.
    }else {
      console.warn('No user ID provided, using default session');
      throw new Error('User ID is required to maintain session context');
    }

    const userRequestWithUserId = `User (${userId}): ${userInput}`;
    const response = await run(advisor, userRequestWithUserId, {session: sessionStore});
    const usage = response.state.usage
    console.log("total tokens used:", usage.totalTokens);
    console.log("input tokens used:", usage.inputTokens);
    console.log("output tokens used:", usage.outputTokens);

    return response.finalOutput ?? 'No response generated';

  } catch (error) {
    console.error('Error getting agent response:', error);
    throw new Error('Failed to get agent response');
  }
}