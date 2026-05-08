# Frontend - How to Use

This frontend is built with [Next.js](https://nextjs.org/) and connects to the backend API of this repository.

## Requirements

- Node.js 18 or higher
- npm, yarn, pnpm, or bun

## Installation

```bash
npm install
```

## Run the App

Start the development server:

```bash
npm run dev
```

The frontend is available at [http://localhost:3001](http://localhost:3001).

## Notes

- Make sure the backend is running before using the UI.
- By default, the frontend expects the backend API on `http://localhost:3000`.
- Main page source: `src/app/page.tsx`

## Build for Production

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```
