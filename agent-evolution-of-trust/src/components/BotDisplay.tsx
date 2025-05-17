import type { Bot, GameAction, BegRequest as BegRequestType } from '../types/game';
import HealthBar from './HealthBar';
import BegRequest from './BegRequest';
import { Bot as BotIcon, Shield, Swords, HandMetal, Circle, HelpingHand, Copy } from 'lucide-react';
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

const BotDisplay = ({ bot, side, intendedAction, observedAction, satChange, begStatus, pendingBegRequest, onBegResponse }: BotDisplayProps) => {
  const MAX_SATS = 100;
  const healthPercentage = (bot.sats / MAX_SATS) * 100;

  return (
    <div className={`bot-display ${side}`}>
      <div className="bot-name">{bot.name}</div>
      
      <div className="bot-icon-container">
        <BotIcon 
          size={80} 
          className={`bot-icon ${!bot.isAlive ? 'bot-dead' : ''}`}
        />
      </div>
      
      <HealthBar 
        current={bot.sats}
        max={MAX_SATS}
        percentage={healthPercentage}
      />
      
      <div className="bot-stats">
        <div className="stat">
          <span className="stat-label">Sats</span>
          <span className="stat-value">{bot.sats}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Status</span>
          <span className={`stat-value status-${bot.isAlive ? 'alive' : 'dead'}`}>
            {bot.isAlive ? 'Alive' : 'Dead'}
          </span>
        </div>
      </div>
      
      {(intendedAction || observedAction) && (
        <div className="last-action">
          <div className="action-container">
            {/* Show if HighFive missed */}
            {intendedAction?.action === 'HighFive' && observedAction?.action === 'Attack' && (
              <div className="missed-highfive">
                <span className="missed-label">MISSED!</span>
              </div>
            )}
            
            <span className="action-icon">
              {getActionIcon(observedAction?.action || intendedAction?.action || '', begStatus)}
            </span>
            
            <div className="action-details">
              <div className="action-line">
                <span className="action-label">
                  {observedAction?.action || intendedAction?.action}
                </span>
                
                {/* Show intended action if it differs */}
                {intendedAction?.action === 'HighFive' && observedAction?.action === 'Attack' && (
                  <span className="intended-action">(tried to HighFive)</span>
                )}
                
                {intendedAction?.action === 'Beg' && begStatus && (
                  <span className={`beg-status ${begStatus}`}>
                    {` (${begStatus})`}
                  </span>
                )}
              </div>
              
              {intendedAction?.action === 'Beg' && intendedAction.reason && (
                <div className="beg-reason">{`"${intendedAction.reason}"`}</div>
              )}
            </div>
            
            {satChange !== undefined && (
              <span className={`sats-change ${satChange >= 0 ? 'positive' : 'negative'}`}>
                {satChange >= 0 ? '+' : ''}{satChange}
              </span>
            )}
          </div>
        </div>
      )}
      
      {pendingBegRequest && onBegResponse && (
        <BegRequest
          amount={pendingBegRequest.amount}
          reason={pendingBegRequest.reason}
          onAccept={(comment) => onBegResponse(true, comment)}
          onDecline={(comment) => onBegResponse(false, comment)}
        />
      )}
    </div>
  );
};

export default BotDisplay;