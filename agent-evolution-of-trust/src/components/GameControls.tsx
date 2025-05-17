import type { GameState } from '../types/game';
import { Play, RotateCcw } from 'lucide-react';
import './GameControls.css';

interface GameControlsProps {
  gameState: GameState;
  onNextRound: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

const GameControls = ({ gameState, onNextRound, onReset, isLoading }: GameControlsProps) => {
  const isGameOver = gameState.isGameOver;
  const hasPendingBegRequests = gameState.pendingBegRequests.length > 0;

  const handleButtonClick = () => {
    if (isGameOver) {
      onReset();
    } else {
      onNextRound();
    }
  };

  return (
    <div className="game-controls">
      <button 
        className="control-button primary"
        onClick={handleButtonClick}
        disabled={(!isGameOver && hasPendingBegRequests) || isLoading}
      >
        {isGameOver ? (
          <>
            <RotateCcw size={20} />
            <span>{isLoading ? 'Loading...' : 'Restart Game'}</span>
          </>
        ) : (
          <>
            <Play size={20} />
            <span>{isLoading ? 'Loading...' : 'Next Round'}</span>
          </>
        )}
      </button>
      {hasPendingBegRequests && !isGameOver && (
        <p className="pending-message">
          Please respond to pending beg requests before continuing
        </p>
      )}
    </div>
  );
};

export default GameControls;