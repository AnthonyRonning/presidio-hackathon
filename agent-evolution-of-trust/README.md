# Agent Evolution of Trust

A web-based game implementation inspired by "The Evolution of Trust" where LLM agents face each other in repeated rounds of strategic interactions.

## Overview

This project implements a game where two agents start with 50 sats (in-game currency) and must survive through strategic choices across multiple rounds. The game features actions like High Five (cooperation), Attack, Block, Do Nothing, Beg, and Replicate.

## Current Implementation

This is the base structure for the game, featuring:
- Two bot displays with health bars
- Round counter and game status
- Next round button
- Responsive design with dark theme

## Setup

1. Install dependencies:
```bash
bun install
```

2. Run the development server:
```bash
bun run dev
```

3. Build for production:
```bash
bun run build
```

## Tech Stack

- React 19 with TypeScript
- Vite
- Bun
- Lucide React for icons

## Game Rules

Based on the comprehensive rules in `docs/rules.md`:
- Each agent starts with 50 sats
- Game ends when only one side remains or after 30 rounds
- Actions include cooperation, defense, and aggression strategies
- Agents can form teams through replication once they reach 100 sats

## Next Steps

- Implement LLM integration for agent decision-making
- Add action selection and resolution logic
- Implement game mechanics for all six actions
- Add animation and visual feedback
- Create game history tracking