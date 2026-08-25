# TrainTally

TrainTally is a scoring and game-tracking app for Ticket to Ride and related game variants.

This project is a web-based rethinking of the original iOS version:

https://github.com/kalebhings/TrainTally-ios

The original app started as an iOS project, but distributing and maintaining a personal iOS app comes with platform-specific constraints such as Apple developer program requirements and limited sideloading options.

TrainTally Web is an effort to rebuild the idea in a more accessible, cross-platform form that can run on phones, tablets, and computers through the browser.

## Goals

The web version is not intended to be a direct one-to-one port of the iOS app.

It is being rebuilt with a focus on:

- cross-platform accessibility
- mobile-first use
- configurable scoring for different Ticket to Ride versions
- clean separation between game data and scoring logic
- local-first storage
- future game history and analytics
- future support for more advanced features such as route recognition and automated scoring assistance

## Current Status

The project is currently focused on rebuilding the core scoring engine.

Implemented so far:

- game-version configuration loading
- route scoring
- destination ticket scoring
- simple bonuses
- multiple-region bonuses
- player-ranked bonuses
- bonus aggregation
- player total score calculation
- game score calculation

The current UI is still primarily used for configuration and scoring development rather than as the final player-facing experience.

## Tech Stack

- React
- TypeScript
- Vite
- Vitest
- Oxlint

The scoring/domain logic is intentionally kept separate from React so that game rules can be tested independently of the UI.

## Project Structure

The project is organized around configuration, domain logic, and presentation.

```text
src/
├── components/
├── config/
├── domain/
│   ├── game-version.ts
│   └── scoring/
│       ├── bonus/
│       ├── game/
│       ├── player/
│       ├── route/
│       └── ticket/
├── storage/
├── App.tsx
└── main.tsx
```

Game-specific configuration is stored separately from the scoring algorithms so that different Ticket to Ride versions can share the same scoring engine where possible.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm run test:run
```

Run the linter:

```bash
npm run lint
```

Build the project:

```bash
npm run build
```

## Original Project

TrainTally Web grew out of the original iOS implementation:

https://github.com/kalebhings/TrainTally-ios

The web version keeps the core idea while reworking much of the architecture, data model, scoring system, and eventual user experience for a browser-based, cross-platform application.
