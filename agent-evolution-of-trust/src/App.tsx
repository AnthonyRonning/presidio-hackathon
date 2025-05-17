import { useState, useEffect } from 'react';
import './index.css';
import type { GameState } from './types/game';
import GameBoard from './components/GameBoard';
import BegModal from './components/BegModal';
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

  // Get the current pending beg request (if any)
  const currentBegRequest = gameState.pendingBegRequests[0];
  const requestingBot = currentBegRequest 
    ? gameState.teams
        .flatMap(team => team.bots)
        .find(bot => bot.id === currentBegRequest.botId)
    : null;

  return (
    <div className="app">
      <GameBoard 
        gameState={gameState} 
        onNextRound={handleNextRound}
        onBegResponse={handleBegResponse}
        onReset={handleReset}
        isLoading={isActionLoading}
      />
      
      {currentBegRequest && requestingBot && (
        <BegModal
          botName={requestingBot.name}
          amount={currentBegRequest.amount}
          reason={currentBegRequest.reason}
          onAccept={(comment) => handleBegResponse(currentBegRequest.botId, true, comment)}
          onDecline={(comment) => handleBegResponse(currentBegRequest.botId, false, comment)}
        />
      )}
    </div>
  );
}

export default App;