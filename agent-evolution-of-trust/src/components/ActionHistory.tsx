import type { RoundResult } from '../types/game';
import { Shield, Swords, HandMetal, Circle, HelpingHand, Copy } from 'lucide-react';
import './ActionHistory.css';

interface ActionHistoryProps {
  history: RoundResult[];
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'HighFive':
      return <HandMetal size={20} />;
    case 'Attack':
      return <Swords size={20} />;
    case 'Block':
      return <Shield size={20} />;
    case 'DoNothing':
      return <Circle size={20} />;
    case 'Beg':
      return <HelpingHand size={20} />;
    case 'Replicate':
      return <Copy size={20} />;
    default:
      return null;
  }
};

const ActionHistory = ({ history }: ActionHistoryProps) => {
  const lastRound = history[history.length - 1];

  if (!lastRound) {
    return null;
  }

  return (
    <div className="action-history">
      <h3>Last Round Actions</h3>
      <div className="last-actions">
        {lastRound.actions.map((action) => (
          <div key={action.botId} className="bot-action">
            <span className="action-icon">{getActionIcon(action.action)}</span>
            <span className="action-name">{action.action}</span>
            <span className={`sats-change ${lastRound.satChanges[action.botId] >= 0 ? 'positive' : 'negative'}`}>
              {lastRound.satChanges[action.botId] >= 0 ? '+' : ''}{lastRound.satChanges[action.botId]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionHistory;