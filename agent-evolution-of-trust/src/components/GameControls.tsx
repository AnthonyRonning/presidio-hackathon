import type { GameState } from '../types/game';
import { Play, RotateCcw } from 'lucide-react';
import './GameControls.css';

interface GameControlsProps {
  gameState: GameState;
  onNextRound: () => void;
}

const GameControls = ({ gameState, onNextRound }: GameControlsProps) => {
  const isGameOver = gameState.gameStatus === 'ended' || 
    gameState.round >= gameState.maxRounds ||
    gameState.bots.filter(bot => bot.isAlive).length <= 1;

  const handleButtonClick = () => {
    if (isGameOver) {
      window.location.reload();
    } else {
      onNextRound();
    }
  };

  return (
    <div className="game-controls">
      <button 
        className="control-button primary"
        onClick={handleButtonClick}
        disabled={false}
      >
        {isGameOver ? (
          <>
            <RotateCcw size={20} />
            <span>Restart Game</span>
          </>
        ) : (
          <>
            <Play size={20} />
            <span>Next Round</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GameControls;