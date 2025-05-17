import { useState } from 'react';
import './index.css';
import type { GameState, Bot } from './types/game';
import GameBoard from './components/GameBoard';

const initialBots: Bot[] = [
  {
    id: 'bot-1',
    name: 'Agent Alpha',
    sats: 50,
    initialSats: 50,
    isAlive: true,
    teamId: 'team-1',
    history: [],
  },
  {
    id: 'bot-2',
    name: 'Agent Beta',
    sats: 50,
    initialSats: 50,
    isAlive: true,
    teamId: 'team-2',
    history: [],
  },
];

const initialGameState: GameState = {
  round: 0,
  maxRounds: 30,
  bots: initialBots,
  gameStatus: 'waiting',
  winner: null,
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const handleNextRound = () => {
    setGameState((prev) => ({
      ...prev,
      round: prev.round + 1,
      gameStatus: 'active',
    }));
  };

  return (
    <div className="app">
      <GameBoard gameState={gameState} onNextRound={handleNextRound} />
    </div>
  );
}

export default App;