import type { Bot, GameAction } from '../types/game';
import HealthBar from './HealthBar';
import { Bot as BotIcon, Shield, Swords, HandMetal, Circle, HelpingHand, Copy } from 'lucide-react';
import './BotDisplay.css';

interface BotDisplayProps {
  bot: Bot;
  side: 'left' | 'right';
  lastAction?: GameAction;
  satChange?: number;
  begStatus?: 'approved' | 'rejected' | 'pending';
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

const BotDisplay = ({ bot, side, lastAction, satChange, begStatus }: BotDisplayProps) => {
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
      
      {lastAction && (
        <div className="last-action">
          <div className="action-container">
            <span className="action-icon">{getActionIcon(lastAction.action, begStatus)}</span>
            <div className="action-details">
              <div className="action-line">
                <span className="action-label">{lastAction.action}</span>
                {lastAction.action === 'Beg' && begStatus && (
                  <span className={`beg-status ${begStatus}`}>
                    {` (${begStatus})`}
                  </span>
                )}
              </div>
              {lastAction.action === 'Beg' && lastAction.reason && (
                <div className="beg-reason">{`"${lastAction.reason}"`}</div>
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
    </div>
  );
};

export default BotDisplay;