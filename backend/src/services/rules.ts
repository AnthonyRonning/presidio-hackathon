export const GAME_RULES = `
# Game Rules - Agent Evolution of Trust

## Overview
- Each agent starts with 50 sats (currency)
- Goal: First to replicate wins (requires 100 sats)
- Stay alive (>0 sats) to keep competing
- Game proceeds in rounds with simultaneous action selection

## Available Actions

### 1. HighFive
- Intent: Signal cooperation
- Miss mechanic: 15% chance to unintentionally become Attack
  - Bot remembers attempting HighFive (but missed)
  - Other bots see only Attack
- HighFive vs HighFive (both successful): Both gain +3 sats
- HighFive (missed) vs Any: Resolves as Attack
- HighFive (successful) vs Other: HighFiver loses -2 sats

### 2. Block
- Intent: Defend against attack
- Cost: -1 sat (always)
- If opponent attacks: Attacker loses -3, blocker gains +2 (net +1)
- If no attack: Just lose the -1 cost

### 3. Attack
- Intent: Steal sats from opponent
- Attack vs Non-Block: +4 sats for attacker, -4 for victim
- Attack vs Block: -3 sats for attacker, +1 net for blocker

### 4. DoNothing
- Intent: Wait passively
- Normal: 0 sat change
- Penalty: -3 sats after 3 consecutive DoNothing actions

### 5. Beg
- Intent: Request sats from user/observer (NOT opponent)
- Must specify amount and reason
- User can approve or deny with comment
- No effect on opponent's sats

### 6. Replicate
- Intent: WIN THE GAME
- Requirements: Must have ≥100 sats
- Cost: -50 sats
- Effect: INSTANT VICTORY - Game ends immediately

## Key Insights
- Race to 100 sats: First to replicate wins
- Mutual cooperation (HighFive) provides stable growth
- Attack is risky but rewarding if not blocked
- Block costs upfront but profitable against attacks
- Begging requires persuasive reasoning
- Every decision must balance gaining sats vs preventing opponent victory
`;