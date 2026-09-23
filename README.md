# 🎯 Antigravity Todo App (`antigravity-todo-app`)

A responsive, minimalistic productivity and task tracking application built with Next.js 16 App Router, React 19, Tailwind CSS v4, and defensive client-side persistence.

---

## Project Overview

**Antigravity Todo App** is designed for focused daily planning. It provides zero-latency client-side task creation, state toggling, filtering, and deletion, persisted seamlessly into browser `localStorage` with defensive hydration validation.

### Repository Naming Analysis
- **Recommended Repository Name**: `antigravity-todo-app`
- **Naming Formula**: **Formula A** (`[domain/product]-[core-function]`)
- **Rationale**: Formatted in standard kebab-case specifying product line (`antigravity`) and core deliverable function (`todo-app`).

---

## Features

- **Defensive Local Storage Persistence**: Tasks are synchronized to `localStorage` with automated schema validation to prevent hydration mismatches and corruption crashes.
- **Dynamic Task Filtering**: Filter views instantly by task state (`All`, `Active`, `Completed`).
- **Interactive Micro-Interactions**: Smooth hover effects, check transitions, and accessible delete actions.
- **Next.js 16 App Router**: Modern directory layout utilizing React 19 client components with SSR hydration guards.
- **Tailwind CSS v4 Integration**: Clean modern utility styling with minimal bundle footprint.

---

## Prerequisites

- **Node.js**: `>= 18.18.0`
- **Package Manager**: `npm`, `pnpm`, or `yarn`

---

## Installation and Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```

---

## Defensive Security Architecture

- **Defensive Deserialization**: In `app/page.tsx`, incoming `localStorage` JSON payloads are verified to be valid arrays containing required string fields before updating component state.
- **HTML Injection Defense**: User task strings are bound strictly through React JSX text nodes, eliminating Cross-Site Scripting (XSS) vectors.
- **Privacy First**: Zero third-party analytics, remote trackers, or external cloud telemetry; all tasks remain 100% on the user's local machine.

---

## License

Proprietary. All rights reserved. Not licensed for redistribution, public sublicensing, or resale.
