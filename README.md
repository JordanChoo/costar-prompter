# CO-STAR Prompt Builder

A web application that helps users create structured prompts for Large Language Models (LLMs) using the CO-STAR framework.

## Overview

The CO-STAR Prompt Builder guides users through creating well-structured prompts by breaking them down into six key components:

- **Context**: Background information on the task
- **Objective**: The specific task you want the LLM to perform
- **Style**: The writing style for the response
- **Tone**: The attitude of the response
- **Audience**: Who the response is intended for
- **Response**: The desired output format

## Features

- Step-by-step prompt building interface
- Save and reuse templates for each component
- Save complete prompts for future use
- Dark mode support
- Keyboard shortcuts (Cmd/Ctrl + Enter to advance)
- Copy to clipboard functionality
- XML-formatted output
- Responsive design

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI Toast
- Geist Font

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/costar.git
cd costar
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

1. Create a production build:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

2. Start the production server:
```bash
npm start
# or
yarn start
# or
pnpm start
```

## Deployment

### Replit (Recommended)
The easiest way to deploy is using [Replit](https://replit.com) via GitHub:

1. Go to [Replit](https://replit.com) and log in or create an account.
2. Click on the "Create" button and select "Import from GitHub."
3. Enter the URL of your GitHub repository and click "Import."
4. Once the project is imported, ensure that your `package.json` file includes the necessary scripts:
   - `"start": "next start"`
5. Set the environment variable `PORT` to `3000` in the Replit settings.
6. Click the "Run" button to start your application.
7. Your app will be accessible via the URL provided by Replit.

## Local Storage

The application uses browser local storage to persist:
- Saved templates for each component
- Complete saved prompts
- No server-side storage is required

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.