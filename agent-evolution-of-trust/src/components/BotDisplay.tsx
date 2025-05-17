import type { Bot, GameAction, BegRequest as BegRequestType } from '../types/game';
import HealthBar from './HealthBar';
import BegRequest from './BegRequest';
import { Shield, Swords, HandMetal, Circle, HelpingHand, Copy } from 'lucide-react';
import './BotDisplay.css';

interface BotDisplayProps {
  bot: Bot;
  side: 'left' | 'right';
  intendedAction?: GameAction;
  observedAction?: GameAction;
  satChange?: number;
  begStatus?: 'approved' | 'rejected' | 'pending';
  pendingBegRequest?: BegRequestType;
  onBegResponse?: (approved: boolean, comment: string) => void;
  playerNumber?: 1 | 2;
  playerCredits?: number;
}

const getActionIcon = (action: string, begStatus?: string) => {
  switch (action) {
    case 'HighFive':
      return <HandMetal size={24} />;
    case 'Attack':
      return <Swords size={24} />;
    case 'Block':
      return <Shield size={24} />;
    case 'DoNothing':
      return <Circle size={24} />;
    case 'Beg':
      return <HelpingHand size={24} color={begStatus === 'approved' ? '#22c55e' : begStatus === 'rejected' ? '#ef4444' : undefined} />;
    case 'Replicate':
      return <Copy size={24} />;
    default:
      return null;
  }
};

const BotDisplay = ({ bot, side, intendedAction, observedAction, satChange, begStatus, pendingBegRequest, onBegResponse, playerNumber = 1, playerCredits }: BotDisplayProps) => {
  const MAX_SATS = 100;
  const healthPercentage = (bot.sats / MAX_SATS) * 100;
  
  // Determine which image to show based on last action
  const getPlayerImage = () => {
    if (!bot.isAlive) {
      return `/player${playerNumber}-dead.png`;
    }
    
    const lastAction = observedAction?.action || intendedAction?.action;
    switch (lastAction) {
      case 'Attack':
        return `/player${playerNumber}-attack.png`;
      case 'Block':
        return `/player${playerNumber}-block.png`;
      case 'Beg':
        // Use mercy image if health is below 50%
        return bot.sats < 50 ? `/player${playerNumber}-mercy.png` : `/player${playerNumber}-beg.png`;
      case 'HighFive':
        return `/player${playerNumber}-highfive.png`;
      default:
        return `/player${playerNumber}-neutral.png`;
    }
  };
  
  const playerImage = getPlayerImage();

  return (
    <div className={`bot-display ${side}`}>
      <div className={`bot-dynamic-content ${side}`}>
        {!pendingBegRequest && (intendedAction || observedAction) && (
          <div className="action-display">
            {intendedAction?.action === 'HighFive' && observedAction?.action === 'Attack' && (
              <div className="missed-badge">MISSED!</div>
            )}
            
            <div className="action-row">
              <span className="action-icon">
                {getActionIcon(observedAction?.action || intendedAction?.action || '', begStatus)}
              </span>
              <span className="action-label">
                {observedAction?.action || intendedAction?.action}
              </span>
              {satChange !== undefined && (
                <span className={`sats-change ${satChange >= 0 ? 'positive' : 'negative'}`}>
                  {satChange >= 0 ? '+' : ''}{satChange}
                </span>
              )}
            </div>
            
            {intendedAction?.action === 'Beg' && begStatus && (
              <span className={`beg-status ${begStatus}`}>
                ({begStatus})
              </span>
            )}
            
            {intendedAction?.action === 'HighFive' && observedAction?.action === 'Attack' && (
              <span className="intended-action">(tried to HighFive)</span>
            )}
          </div>
        )}
        
        {pendingBegRequest && onBegResponse && (
          <BegRequest
            amount={pendingBegRequest.amount}
            reason={pendingBegRequest.reason}
            onAccept={(comment) => onBegResponse(true, comment)}
            onDecline={(comment) => onBegResponse(false, comment)}
            playerCredits={playerCredits}
          />
        )}
      </div>
      
      <div className="bot-static-content">
        <div className="bot-visual">
          <div className="bot-icon-wrapper">
            <img
              src={playerImage}
              alt={bot.name}
              className={`bot-icon ${!bot.isAlive ? 'bot-dead' : ''}`}
            />
          </div>
          
          <div className="bot-name">{bot.name}</div>
        </div>
        
        <HealthBar 
          current={bot.sats}
          max={MAX_SATS}
          percentage={healthPercentage}
        />
      </div>
    </div>
  );
};

export default BotDisplay;