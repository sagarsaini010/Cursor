# AI Website Builder Agent  
### Planner–Executor based AI agent that generates frontend websites automatically

This project is an **AI-powered website builder agent** that can generate a complete frontend website using **HTML, CSS, and JavaScript** from a simple text prompt.

The agent understands the user's request, plans the steps required to build the website, and then executes those steps by creating files and folders automatically.

This project was built to understand how **AI agents, tool calling, and autonomous workflows** work internally.

---

## Demo

Example of the agent generating a website:
## A calculator
<img width="1919" height="1038" alt="demo" src="https://github.com/user-attachments/assets/a6e2ad31-432b-40db-8f7b-8e125472976a" />
---
## Leetcode-clone
<img width="1919" height="1079" alt="Screenshot 2026-02-16 094113" src="https://github.com/user-attachments/assets/3320b557-7632-47af-bf80-231fcb548421" />
---
## Spotify-clone
<img width="1918" height="1041" alt="Screenshot 2026-02-16 094054" src="https://github.com/user-attachments/assets/1b394b75-8790-42ef-ac27-b115d7fb416f" />
---
## Login page
<img width="1919" height="1078" alt="Screenshot 2026-02-16 094104" src="https://github.com/user-attachments/assets/b0fe2bf5-4e30-4cbb-a4df-0a75d09cb3a1" />


## Key Highlights

- AI Agent architecture (Planner → Executor workflow)
- Automatic file and folder generation
- Terminal command execution from AI decisions
- Rate limit handling and retry logic
- State-aware execution to reduce hallucinations
- Strict environment rules to prevent framework usage

---

## How It Works

The system follows a simplified AI agent architecture:

1. User provides a prompt  
2. AI plans the steps required  
3. Executor runs commands step-by-step  
4. Files and folders are generated automatically  

This mimics how modern AI coding assistants work internally.

---

## Tech Stack

- Node.js  
- Google Gemini API (@google/genai)  
- readline-sync  
- dotenv  
- child_process  
- File System (fs)

---

## Project Structure
```
Cursor/
│
├── index.js
├── .env
├── package.json
└── node_modules/
```

Generated websites are created dynamically inside new folders.

---

## Installation

### 1. Clone the repository
```
git clone <your-repo-url>
cd Cursor
```


### 2. Install dependencies
```
npm install
```
### 3. Configure environment variables

Create a `.env` file:
```
GENAI_API_KEY=your_api_key_here
```

---

## Run the Project
```
node index.js
```

Example input:
```
Create a calculator website
```

The agent will automatically generate the website.

---

## Features

- Builds frontend websites automatically
- Creates project structure
- Writes HTML, CSS, JS files
- Executes terminal commands safely
- Handles API limits and retries
- Prevents use of frameworks

---

## Limitations

- Designed for small frontend projects
- Free API quota may cause delays
- No live preview (yet)

---

## Future Improvements

- Automatic preview server
- Evaluator agent for validation
- Improved planning accuracy
- UI for controlling the agent
- Multi-step planning support

---

## What I Learned

Through this project, I gained hands-on experience with:

- AI agent design
- Tool calling workflows
- Planner–Executor pattern
- Handling hallucinations in LLMs
- Node.js automation

--- 

## Author

Sagar Saini
B.Tech Student | Aspiring Software Engineer | Learning AI Agents and Full Stack Development
