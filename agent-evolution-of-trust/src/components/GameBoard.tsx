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
  isLoading?: boolean;
}

const GameBoard = ({ gameState, onNextRound, onBegResponse, onReset, isLoading }: GameBoardProps) => {
  // Get all bots from all teams
  const allBots = gameState.teams.flatMap(team => team.bots);
  const aliveBots = allBots.filter(bot => bot.isAlive);
  
  // For now, display the first two bots
  const [botLeft, botRight] = aliveBots.length >= 2 
    ? aliveBots 
    : [...aliveBots, null];
    
  // Get last round data
  const lastRound = gameState.history[gameState.history.length - 1];
  // Get both intended and observed actions
  const intendedActions = lastRound?.actions || [];
  const observedActions = lastRound?.observedActions || lastRound?.actions || [];
  
  const leftBotIntended = intendedActions.find(a => a.botId === botLeft?.id);
  const leftBotObserved = observedActions.find(a => a.botId === botLeft?.id);
  const rightBotIntended = intendedActions.find(a => a.botId === botRight?.id);
  const rightBotObserved = observedActions.find(a => a.botId === botRight?.id);
  let leftBotSatChange = lastRound?.satChanges[botLeft?.id || ''];
  let rightBotSatChange = lastRound?.satChanges[botRight?.id || ''];
  
  // Adjust sat changes for approved beg requests
  if (lastRound?.begRequests) {
    const leftBegRequest = lastRound.begRequests.find(req => req.botId === botLeft?.id && req.status === 'approved');
    const rightBegRequest = lastRound.begRequests.find(req => req.botId === botRight?.id && req.status === 'approved');
    
    if (leftBegRequest && leftBotSatChange !== undefined) {
      leftBotSatChange += leftBegRequest.amount;
    }
    if (rightBegRequest && rightBotSatChange !== undefined) {
      rightBotSatChange += rightBegRequest.amount;
    }
  }
  
  // Get beg status for display
  const leftBegStatus = lastRound?.begRequests?.find(req => req.botId === botLeft?.id)?.status;
  const rightBegStatus = lastRound?.begRequests?.find(req => req.botId === botRight?.id)?.status;
  
  // Get pending beg requests for inline display
  const leftPendingBeg = gameState.pendingBegRequests.find(req => req.botId === botLeft?.id);
  const rightPendingBeg = gameState.pendingBegRequests.find(req => req.botId === botRight?.id);

  return (
    <div className="game-board">
      <div className="game-info">
        <div className="round-display">
          ROUND {gameState.currentRound} / {gameState.maxRounds}
        </div>
        {gameState.isGameOver ? (
          <div className="game-status ended">
            {gameState.winner} WINS!
          </div>
        ) : (
          <div className="game-status active">
            First to 100 sats wins!
          </div>
        )}
      </div>
      
      <div className="game-field">
        <div className="bot-area bot-area-left">
          {botLeft && (
            <BotDisplay 
              bot={botLeft} 
              side="left" 
              intendedAction={leftBotIntended}
              observedAction={leftBotObserved}
              satChange={leftBotSatChange}
              begStatus={leftBegStatus}
              pendingBegRequest={leftPendingBeg}
              onBegResponse={(approved, comment) => onBegResponse(botLeft.id, approved, comment)}
              playerNumber={1}
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
              intendedAction={rightBotIntended}
              observedAction={rightBotObserved}
              satChange={rightBotSatChange}
              begStatus={rightBegStatus}
              pendingBegRequest={rightPendingBeg}
              onBegResponse={(approved, comment) => onBegResponse(botRight.id, approved, comment)}
              playerNumber={2}
            />
          )}
        </div>
      </div>
      
      <div className="game-controls-overlay">
        <GameControls 
          gameState={gameState} 
          onNextRound={onNextRound}
          onReset={onReset}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default GameBoard;