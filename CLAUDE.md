# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Agent Evolution of Trust Game
```bash
cd agent-evolution-of-trust
bun install         # Install dependencies
bun run dev        # Start development server
bun run build      # Build for production
bun run lint       # Run linting
```

### Backend Server
```bash
cd backend
bun install         # Install dependencies
bun run dev        # Start development server
bun run build      # Build for production
bun run lint       # Run linting
```

### Development Environment
```bash
# Uses Nix flake for environment setup
nix develop        # Enter development shell
```

## Architecture Overview

### Project Structure
- `agent-evolution-of-trust/`: Main React game implementation
  - `src/components/`: UI components (BotDisplay, GameBoard, GameControls, etc.)
  - `src/types/game.ts`: Core game type definitions
  - `src/hooks/`: React hooks for game logic (to be implemented)
  - `src/utils/`: Utility functions for game mechanics (to be implemented)

### Game Mechanics
Based on Evolution of Trust principles with LLM agents:
- **Actions**: HighFive, Block, Attack, DoNothing, Beg, Replicate
- **Starting Sats**: Each agent begins with 50 sats
- **Goal**: Survive by maintaining sats > 0, accumulate sats to replicate
- **Replication**: Available at 100 sats, costs 50 sats, spawns team member with 25 sats
- **Max Rounds**: 30 (configurable)

### Action Resolution Table
| Action 1 | Action 2 | Result |
|----------|----------|--------|
| HighFive | HighFive | Both +3 sats |
| HighFive | Other | -2 sats for HighFiver |
| Attack | Non-Block | +4/-4 sats |
| Attack | Block | -3 attacker, +1 blocker |
| Block | No Attack | -1 sat |
| Beg | Any | User decision required |

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Icons**: Lucide React

## Key Documentation

### Game Rules
Complete game mechanics and rules are documented in `docs/rules.md`. This includes:
- Detailed action resolution tables
- Payoff values for all action combinations
- Replication mechanics and team dynamics
- Begging system interactions
- Winning conditions and elimination rules

## Next Implementation Steps

1. **LLM Integration**: Implement agent decision-making using language models
2. **Game Logic**: Complete action resolution mechanics in utils
3. **State Management**: Create game state hooks and context
4. **Beg Functionality**: Implement user interaction for beg requests
5. **Team Mechanics**: Handle replication and multi-unit teams
6. **Game History**: Track and display action history

## Key Game Theory Concepts

- **Iterated Prisoner's Dilemma**: Repeated interactions where trust can emerge
- **Tit for Tat Strategy**: Cooperate first, then mirror opponent's previous action
- **Forgiveness**: Some strategies perform better by occasionally forgiving betrayals
- **Noise/Miscommunication**: Real-world uncertainty affects strategy effectiveness
