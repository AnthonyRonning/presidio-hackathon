import type { GameState } from '../types/game';
import BotDisplay from './BotDisplay';
import GameControls from './GameControls';
import GameHeader from './GameHeader';
import './GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  onNextRound: () => void;
}

const GameBoard = ({ gameState, onNextRound }: GameBoardProps) => {
  const [botLeft, botRight] = gameState.bots;

  return (
    <div className="game-board">
      <GameHeader 
        round={gameState.round} 
        maxRounds={gameState.maxRounds} 
        gameStatus={gameState.gameStatus} 
      />
      
      <div className="game-field">
        <div className="bot-area bot-area-left">
          <BotDisplay bot={botLeft} side="left" />
        </div>
        
        <div className="game-center">
          <div className="vs-indicator">VS</div>
        </div>
        
        <div className="bot-area bot-area-right">
          <BotDisplay bot={botRight} side="right" />
        </div>
      </div>
      
      <GameControls 
        gameState={gameState} 
        onNextRound={onNextRound} 
      />
    </div>
  );
};

export default GameBoard;