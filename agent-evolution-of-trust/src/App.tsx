import { useState, useEffect } from 'react';
import './index.css';
import type { GameState } from './types/game';
import GameBoard from './components/GameBoard';
import { api } from './utils/api';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      setLoading(true);
      const game = await api.getGame();
      setGameState(game);
      setError(null);
    } catch (err) {
      setError('Failed to load game');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextRound = async () => {
    try {
      setIsActionLoading(true);
      const game = await api.nextRound();
      setGameState(game);
      setError(null);
    } catch (err) {
      setError('Failed to advance round');
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBegResponse = async (botId: string, approved: boolean, comment: string) => {
    try {
      const game = await api.respondToBeg(botId, approved, comment);
      setGameState(game);
      setError(null);
    } catch (err) {
      setError('Failed to respond to beg request');
      console.error(err);
    }
  };

  const handleReset = async () => {
    try {
      setIsActionLoading(true);
      const game = await api.resetGame();
      setGameState(game);
      setError(null);
    } catch (err) {
      setError('Failed to reset game');
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="app-error">
        <p>{error}</p>
        <button onClick={loadGame}>Retry</button>
      </div>
    );
  }

  if (!gameState) {
    return null;
  }

  return (
    <div className="app">
      <GameBoard 
        gameState={gameState} 
        onNextRound={handleNextRound}
        onBegResponse={handleBegResponse}
        onReset={handleReset}
        isLoading={isActionLoading}
      />
    </div>
  );
}

export default App;