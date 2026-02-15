// execute command tool
import { tool } from '@openai/agents';
import { z } from 'zod';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export const executeCommand = tool({
  name: 'executeCommand',
  description: 'Execute a shell command and return the output',
  parameters: z.object({
    command: z.string(),
  }),
  execute: executeCmd
});


async function executeCmd(input: { [key: string]: any }): Promise<string> {
    const command = input["command"];
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stderr) {
            return `Error: ${stderr}`;
        }
        return stdout;
    } catch (error) {
        if (error instanceof Error) {
            return `Execution failed: ${error.message}`;
        }
        return 'Execution failed: Unknown error';
    }
}

