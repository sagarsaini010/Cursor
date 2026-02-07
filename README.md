# AI Website Builder (Node.js + Gemini)

This project is a simple **AI-powered website builder** that can create frontend websites using **HTML, CSS, and JavaScript** by executing terminal commands automatically.

The AI understands user instructions and builds the project step-by-step.

---

## Features

* Builds simple frontend websites
* Creates project folders and files automatically
* Executes terminal commands using Node.js
* Uses Gemini API for AI reasoning
* Works with HTML, CSS, and JavaScript only

---

## Technologies Used

* Node.js
* Gemini API (@google/genai)
* readline-sync
* dotenv
* child_process

---

## Project Structure

```
project-folder/
│
├── index.js
├── .env
├── package.json
└── node_modules/
```

Generated websites will be created inside new folders automatically.

---

## Installation

### 1. Clone or download the project

```
git clone <your-repo-url>
cd project-folder
```

### 2. Install dependencies

```
npm install
```

### 3. Create a .env file

```
GENAI_API_KEY=your_api_key_here
```

---

## Run the Project

```
node index.js
```

Then type:

```
build a calculator website
```

The AI will start creating files and folders automatically.

---

## Important Notes

* Free Gemini API has rate limits.
* Wait a few seconds between requests if you hit quota errors.
* The agent is designed for frontend projects only.

---

## Supported Commands

The AI is allowed to:

* Create folders
* Create HTML files
* Create CSS files
* Create JavaScript files

The AI will NOT:

* Install npm packages
* Use frameworks like React or Angular
* Create backend code

---

## Future Improvements

* Auto-write HTML, CSS, JS content
* Preview website automatically
* Better command validation
* Project state tracking

---

## Author

Sagar Saini
