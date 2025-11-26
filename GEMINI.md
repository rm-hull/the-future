# Project Context: The Future

## Project Overview
This project is a React-based web application that implements a retro-futuristic terminal interface. Its core feature is running a Large Language Model (LLM) locally in the browser using **WebGPU** via `@mlc-ai/web-llm`.

The application simulates a terminal session where the user (or a script) interacts with an AI model ("Llama-3.2-1B-Instruct-q4f16_1-MLC"). It includes a custom terminal emulator capable of handling basic ANSI escape codes (like clear screen) and rendering text in a grid layout.

### Key Technologies
*   **Frontend Framework:** React 19 + Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS 4
*   **AI/Inference:** `@mlc-ai/web-llm` (Requires WebGPU)
*   **Testing:** Vitest

## Architecture & Core Concepts

### 1. The Terminal Pipeline
The application uses a pipeline pattern to feed text into the UI:
*   **Generators (`src/generators.ts`):** Async generators produce streams of strings. These can be simple text (`letterGenerator`), pauses (`waitFor`), control codes (`clear`), or streams from the LLM.
*   **Typer (`src/Typer.tsx`):** Orchestrates the generator sequence defined in `App.tsx`. It consumes the async generator and accumulates the text.
*   **Terminal (`src/Terminal.tsx`):** A logical terminal emulator. It takes the raw text stream, parses ANSI control codes (e.g., `\x1b[2J` for clear screen), handles cursor movement/wrapping, and maintains a 2D buffer of the screen state.
*   **CellGrid (`src/CellGrid.tsx`):** The visual layer. It renders the 2D buffer into the DOM using a fixed-width font (VT220 style), handling window resizing and character metrics.

### 2. LLM Integration (`src/llm.tsx`)
*   **Model Loading:** Uses `MLCEngine` to download and cache the model (`Llama-3.2-1B-Instruct-q4f16_1-MLC`) within the browser.
*   **Inference:** The `systemPrompt` function sends messages to the model and yields the streamed response.
*   **WebGPU:** The application strictly requires a WebGPU-compatible browser environment.

## Building and Running

### Prerequisites
*   Node.js
*   Yarn (Package Manager, v4.12.0)
*   **Browser with WebGPU support** (Chrome/Edge 113+, or other browsers with flags enabled).

### Commands
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Lint code
yarn lint
```

## Directory Structure Key Files

*   **`src/App.tsx`**: The main entry point that defines the "script" of the terminal session (download model -> clear -> prompt -> credits).
*   **`src/llm.tsx`**: Wrapper around `@mlc-ai/web-llm` for model initialization and chat completion.
*   **`src/Terminal.tsx`**: Logic for the terminal buffer, cursor tracking, and escape code parsing.
*   **`src/CellGrid.tsx`**: React component responsible for rendering the grid of characters.
*   **`src/generators.ts`**: Helper functions to create async generators for sequencing text/actions.
*   **`vite.config.ts`**: Vite configuration, including Git commit hash injection.

## Development Conventions
*   **Async Generators:** The project relies heavily on async generators to manage the flow of time and text. New "events" in the terminal should be implemented as generators.
*   **Environment Variables:** Git commit information is injected via `VITE_GIT_COMMIT_DATE` and `VITE_GIT_COMMIT_HASH`.
*   **Styling:** The terminal uses a hardcoded VT220 font style and color scheme (#FFAA00 on #242424).
