import type { GameState } from '../types/game';
import BotDisplay from './BotDisplay';
import GameControls from './GameControls';
import GameHeader from './GameHeader';
import './GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  onNextRound: () => void;
  onBegResponse: (botId: string, approved: boolean, comment: string) => void;
  onReset: () => void;
}

const GameBoard = ({ gameState, onNextRound, onReset }: GameBoardProps) => {
  // Get all bots from all teams
  const allBots = gameState.teams.flatMap(team => team.bots);
  const aliveBots = allBots.filter(bot => bot.isAlive);
  
  // For now, display the first two bots
  const [botLeft, botRight] = aliveBots.length >= 2 
    ? aliveBots 
    : [...aliveBots, null];
    
  // Get last round data
  const lastRound = gameState.history[gameState.history.length - 1];
  const leftBotAction = lastRound?.actions.find(a => a.botId === botLeft?.id);
  const rightBotAction = lastRound?.actions.find(a => a.botId === botRight?.id);
  const leftBotSatChange = lastRound?.satChanges[botLeft?.id || ''];
  const rightBotSatChange = lastRound?.satChanges[botRight?.id || ''];

  return (
    <div className="game-board">
      <GameHeader 
        round={gameState.currentRound} 
        maxRounds={gameState.maxRounds} 
        gameStatus={gameState.isGameOver ? 'ended' : 'active'} 
        winner={gameState.winner}
      />
      
      <div className="game-field">
        <div className="bot-area bot-area-left">
          {botLeft && (
            <BotDisplay 
              bot={botLeft} 
              side="left" 
              lastAction={leftBotAction}
              satChange={leftBotSatChange}
            />
          )}
        </div>
        
        <div className="game-center">
          <div className="vs-indicator">VS</div>
        </div>
        
        <div className="bot-area bot-area-right">
          {botRight && (
            <BotDisplay 
              bot={botRight} 
              side="right" 
              lastAction={rightBotAction}
              satChange={rightBotSatChange}
            />
          )}
        </div>
      </div>
      
      <GameControls 
        gameState={gameState} 
        onNextRound={onNextRound}
        onReset={onReset}
      />
    </div>
  );
};

export default GameBoard;