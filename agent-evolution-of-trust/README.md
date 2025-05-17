# Agent Evolution of Trust

A web-based game implementation inspired by "The Evolution of Trust" where LLM agents face each other in repeated rounds of strategic interactions.

## Overview

This project implements a game where two agents start with 50 sats (in-game currency) and must survive through strategic choices across multiple rounds. The game features actions like High Five (cooperation), Attack, Block, Do Nothing, Beg, and Replicate.

## Current Status

### ✅ Completed Features
- **Full-stack architecture**: Express backend with session-based game state, React frontend
- **Core game mechanics**: All basic actions implemented (HighFive, Attack, Block, DoNothing, Beg)
- **Action resolution**: Proper sat calculations based on action combinations
- **DoNothing penalty**: Tracks consecutive DoNothing actions, applies -3 sat penalty on third consecutive use
- **Beg functionality**: User-interactive modal for approving/rejecting beg requests
- **Game flow**: Round progression, game end conditions, winner determination
- **Visual feedback**: Bot displays with health bars, last action display, sat changes
- **Session management**: Each user gets their own isolated game session

### 🚧 In Progress
- **Replicate action**: Team formation and multi-bot mechanics (partially implemented)

### 🎯 Next Priority: LLM Integration
The highest priority is implementing intelligent agent decision-making using LLMs:
- Replace random action selection with strategic AI behavior
- Implement memory of past interactions and opponent behavior
- Create different agent personalities/strategies (Tit for Tat, Cooperator, Defector, etc.)
- Add reasoning capabilities for complex decisions (when to beg, when to replicate)
- Implement trust scoring and relationship tracking between agents

### 💭 Nice to Have (After LLM Integration)
- **Noise/Miscommunication**: 5-10% chance of action mis-execution
- **Visual History**: Graphs and statistics of game progression
- **Environmental Triggers**: Random events affecting all players
- **Begging Cost**: Optional -1 sat cost for begging

## Project Structure

```
agent-evolution-of-trust/
├── src/
│   ├── components/         # React UI components
│   │   ├── BotDisplay      # Individual bot with stats and actions
│   │   ├── GameBoard       # Main game layout
│   │   ├── GameControls    # Next round and reset buttons
│   │   ├── GameHeader      # Round counter and status
│   │   ├── HealthBar       # Visual sat display
│   │   └── BegModal        # User interaction for beg requests
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # API client utilities
│   └── App.tsx             # Root component

backend/
├── src/
│   ├── types/              # Shared type definitions
│   ├── services/           # Game logic implementation
│   │   └── GameManager.ts  # Core game mechanics
│   └── index.ts            # Express server setup
```

## Setup

### Frontend
```bash
cd agent-evolution-of-trust
bun install
bun run dev        # Development server on port 5173
bun run build      # Production build
```

### Backend
```bash
cd backend
bun install
bun run dev        # Development server on port 3001
bun run build      # Production build
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Lucide React icons
- **Backend**: Express, TypeScript, express-session
- **Runtime**: Bun
- **State Management**: Session-based backend state

## Game Rules

Based on the comprehensive rules in `docs/rules.md`:
- Each agent starts with 50 sats
- Game lasts maximum 30 rounds
- Last surviving agent/team wins
- Actions include:
  - **HighFive**: Mutual cooperation (+3 each), unreciprocated (-2)
  - **Attack**: Successful (+4/-4), blocked (-3/+1)
  - **Block**: Costs -1, gains +1 if blocks attack
  - **DoNothing**: Free, but -3 penalty on third consecutive use
  - **Beg**: Request sats from user (not opponent)
  - **Replicate**: Create team member (requires 100 sats, costs 50)

## API Endpoints

- `GET /api/game` - Get current game state (creates new if none exists)
- `POST /api/game/next-round` - Advance to next round
- `POST /api/game/beg-response` - Handle user response to beg request
- `POST /api/game/reset` - Start a new game

## Contributing

The immediate focus should be on LLM integration. Key areas to implement:
1. Replace `chooseAction()` in `GameManager.ts` with LLM-based decision making
2. Add agent memory and state tracking
3. Implement different strategy patterns
4. Create a reasoning system for complex decisions
5. Add configuration for different LLM providers (OpenAI, Anthropic, etc.)