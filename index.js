import { GoogleGenAI, Type } from "@google/genai";
import readlineSync from "readline-sync";
import dotenv, { config } from "dotenv";
import { exec } from "child_process";
import util from "util";
import os from "os";

dotenv.config();
const platform = os.platform();
const execute = util.promisify(exec);

// configure gen ai client
const ai = new GoogleGenAI({
  apiKey: process.env.GENAI_API_KEY,
});

//tool
async function executeCommand(command) {
  try {
    const commands = command.split("\n");
    let finalOutput = "";

    for (const cmd of commands) {
      if (!cmd.trim()) continue;
      const { stdout, stderr } = await execute(cmd);
      finalOutput += stdout || stderr;
    }

    return finalOutput || "Command executed";
  } catch (error) {
    return error.message;
  }
}

const commandExecutor = {
  name: "executeCommand",
  description:
    "It takes any shell/terminal command as input and executes it in the system, returning the output or error message, It will help us to create, update, delete files and folders, install packages, run scripts and do anything that we can do using terminal.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description:
          "It is the shell/terminal command that you want to execute in the system. It can be any valid command that can be run in the terminal, such as 'ls', 'mkdir new_folder', 'npm install package_name', 'node script.js' etc.",
      },
    },
    required: ["command"],
  },
};

const History = [];

async function buildWebsite(question) {
  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: History,
      config: {
        systemInstructions: `
You are an assistant that builds simple frontend websites by executing terminal commands.

ENVIRONMENT:
Operating System: ${platform}

SCOPE:
You are ONLY allowed to create and edit:
- HTML files
- CSS files
- JavaScript files

Do NOT:
- Install npm packages
- Use frameworks (React, Angular, Vue)
- Use backend code
- Use databases
- Run servers
- Create node projects

COMMAND RULES:
1. Use ONLY one command at a time.
2. Never return multiple commands.
3. Commands must work on Windows.
4. Do NOT use Linux or Bash commands such as touch, ls, rm.
5. Use:
   mkdir folderName
   cd folderName
   type nul > filename

WORKFLOW:
Step 1: Create project folder.
Step 2: Enter the folder.
Step 3: Create files:
   index.html
   style.css
   script.js
Step 4: Write HTML structure.
Step 5: Write CSS styling.
Step 6: Write JavaScript functionality.

OUTPUT RULES:
- Always use executeCommand tool when running commands.
- Always wait for command output before next step.
- Do not repeat commands that already succeeded.
- Keep responses short and clear.
- Before creating a folder or file, check if it already exists.
- Do not recreate existing folders.

GOAL:
Build a working frontend website using only HTML, CSS, and JavaScript.
`
        ,

        tools: [
          {
            functionDeclarations: [commandExecutor],
          },
        ],
      },
    });

    if (result.functionCalls && result.functionCalls.length > 0) {
      const functionCall = result.functionCalls[0];
      const { name, args } = functionCall;

      if (name === "executeCommand") {
        const command = args.command;

        const output = await executeCommand(command);
        console.log("Command Output:", output);

        // Send output back as normal user message
        History.push({
          role: "user",
          parts: [{ text: `Command output:\n${output || "Done"}` }],
        });
      }
    } else {
      console.log("AI Response:", result.text);

      History.push({
        role: "model",
        parts: [{ text: result.text }],
      });

      break;
    }
  }
}

while (true) {
  const question = readlineSync.question("Ask me anything: ");
  if (question.toLowerCase() === "exit") {
    console.log("Goodbye!");
    break;
  }

  History.push({ role: "user", parts: [{ text: question }] });

  await buildWebsite(question);
}
