import { GoogleGenAI, Type } from "@google/genai";
import readlineSync from "readline-sync";
import dotenv, { config } from "dotenv";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import os from "os";

dotenv.config();
const platform = os.platform();
const execute = util.promisify(exec);
console.log(platform);
// configure gen ai client
const ai = new GoogleGenAI({
  apiKey: process.env.GENAI_API_KEY,
});

//tool
let currentDir = process.cwd();

async function executeCommand(command) {
  try {
    const commands = command.split("\n");
    let finalOutput = "";

    for (const cmd of commands) {
      if (!cmd.trim()) continue;

      const trimmed = cmd.trim();

      if (trimmed.toLowerCase().startsWith("mkdir ")) {
        const dirArg = trimmed.slice(6).trim();
        const dirName = dirArg.replace(/^["']|["']$/g, "");
        const dirPath = path.resolve(dirName);

        if (fs.existsSync(dirPath)) {
          finalOutput += `Skipped: directory already exists (${dirName})\n`;
          continue;
        }
      }

      const { stdout, stderr } = await execute(cmd, { cwd: currentDir });
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
    "It takes any shell/terminal command as input and executes it in the system, returning the output or error message, It will help us to create, update, delete files and folders, run scripts and do anything that we can do using terminal.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description:
          "It is the shell/terminal command that you want to execute in the system. It can be any valid command that can be run in the terminal, such as 'ls', 'mkdir new_folder' etc.",
      },
    },
    required: ["command"],
  },
};

async function writeFile(filePath, content) {
  try {
    const resolvedPath = path.resolve(filePath);
    const dirName = path.dirname(resolvedPath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    fs.writeFileSync(resolvedPath, content, "utf8");
    return `Wrote file: ${filePath}`;
  } catch (error) {
    return error.message;
  }
}

const writeFileTool = {
  name: "writeFile",
  description:
    "Writes content to a file using the filesystem. Use this to write HTML, CSS, or JS code into created files.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      filePath: {
        type: Type.STRING,
        description: "Path to the file to write.",
      },
      content: {
        type: Type.STRING,
        description: "The full content to write into the file.",
      },
    },
    required: ["filePath", "content"],
  },
};

const History = [];
const requestTimestamps = [];
const MAX_REQUESTS_PER_MINUTE = 100;
const REQUEST_WINDOW_MS = 60_000;

async function waitForRateLimit() {
  while (true) {
    const now = Date.now();
    while (
      requestTimestamps.length > 0 &&
      now - requestTimestamps[0] > REQUEST_WINDOW_MS
    ) {
      requestTimestamps.shift();
    }
    if (requestTimestamps.length < MAX_REQUESTS_PER_MINUTE) {
      return;
    }
    const waitMs = REQUEST_WINDOW_MS - (now - requestTimestamps[0]);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

async function buildWebsite(question) {
  while (true) {
    await waitForRateLimit();
    const result = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: History,
      config: {
        systemInstructions: `
You are an assistant that builds simple frontend websites by executing terminal commands.

ENVIRONMENT:
Operating System: ${platform}

SCOPE:
- Allowed files: HTML, CSS, JavaScript only.
- Forbidden: npm installs, frameworks, backend, databases, servers, node projects.

COMMAND RULES:
- One command at a time (never multiple).
- Commands must be Windows-compatible.
- Do not use Linux/Bash commands (touch, ls, rm).
- Use only: mkdir, cd, type nul > filename.
- Write file contents using the writeFile tool (do not use shell redirection).

STRICT RULES:
  To write HTML, CSS, or JavaScript files:

    Use this format:
    echo line1 > file
    echo line2 >> file
    echo line3 >> file

    Do NOT use:
    cat <<EOF
    const html =
    heredoc syntax

    Do not repeat successful commands.
    Check existence before creating files/folders.
WORKFLOW:
1) Create project folder.
2) Enter folder.
3) Create index.html, style.css, script.js.
4) Write HTML, then CSS, then JS.

OUTPUT RULES:
- Use executeCommand for all commands.
- Use writeFile to add or update file contents.
- Wait for command output before next step.
- Do not repeat successful commands.
- Check existence before creating files/folders.
- Keep responses short and clear.

GOAL:
Build a working frontend website using only HTML/CSS/JS.
`,
        tools: [
          {
            functionDeclarations: [commandExecutor, writeFileTool],
          },
        ],
      },
    });
    requestTimestamps.push(Date.now());

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

      if (name === "writeFile") {
        const { filePath, content } = args;
        const output = await writeFile(filePath, content);
        console.log("Write Output:", output);

        History.push({
          role: "user",
          parts: [{ text: `Write output:\n${output || "Done"}` }],
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
