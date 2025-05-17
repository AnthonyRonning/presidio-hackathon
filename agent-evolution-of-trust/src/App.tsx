import { useState, useEffect, useCallback } from 'react';
import './index.css';
import type { GameState } from './types/game';
import GameBoard from './components/GameBoard';
import PaymentModal from './components/PaymentModal';
import { api } from './utils/api';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isTopUp, setIsTopUp] = useState(false);
  const [playerCredits, setPlayerCredits] = useState(0);

  const checkPaymentStatus = useCallback(async () => {
    try {
      const status = await api.checkInvoiceStatus();
      if (status.isPaid) {
        setPlayerCredits(status.playerCredits);
        setShowPaymentModal(false);
        return true;
      }
    } catch {
      // No invoice yet, that's fine
      console.log('No active invoice');
    }
    return false;
  }, []);

  useEffect(() => {
    const checkAndLoadGame = async () => {
      const isPaid = await checkPaymentStatus();
      await loadGame(); // Always load the game
      if (!isPaid) {
        setShowPaymentModal(true); // Show modal if not paid
      }
    };
    
    checkAndLoadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Check if user has paid before allowing to play
    try {
      const status = await api.checkInvoiceStatus();
      if (!status.isPaid) {
        setIsTopUp(false);
        setShowPaymentModal(true);
        return;
      }
    } catch {
      // No invoice, show payment modal
      setIsTopUp(false);
      setShowPaymentModal(true);
      return;
    }

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
      const response = await api.respondToBeg(botId, approved, comment);
      setGameState(response.game);
      setPlayerCredits(response.playerCredits);
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

  const handlePaymentComplete = async () => {
    const status = await api.checkInvoiceStatus();
    setPlayerCredits(status.playerCredits);
    setShowPaymentModal(false);
    setIsTopUp(false);
  };

  const handleTopUp = () => {
    setIsTopUp(true);
    setShowPaymentModal(true);
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
        playerCredits={playerCredits}
        onTopUp={handleTopUp}
      />
      {showPaymentModal && (
        <PaymentModal 
          onPaymentComplete={handlePaymentComplete}
          onClose={() => {
            setShowPaymentModal(false);
            setIsTopUp(false);
          }}
          isTopUp={isTopUp}
        />
      )}
    </div>
  );
}

export default App;