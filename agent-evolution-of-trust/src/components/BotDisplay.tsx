import type { Bot } from '../types/game';
import HealthBar from './HealthBar';
import { Bot as BotIcon } from 'lucide-react';
import './BotDisplay.css';

interface BotDisplayProps {
  bot: Bot;
  side: 'left' | 'right';
}

const BotDisplay = ({ bot, side }: BotDisplayProps) => {
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
    </div>
  );
};

export default BotDisplay;