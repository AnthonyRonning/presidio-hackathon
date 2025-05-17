import { useState } from 'react';
import { Check, X } from 'lucide-react';
import './BegRequest.css';

interface BegRequestProps {
  amount: number;
  reason: string;
  onAccept: (comment: string) => void;
  onDecline: (comment: string) => void;
}

const BegRequest = ({ amount, reason, onAccept, onDecline }: BegRequestProps) => {
  const [comment, setComment] = useState('');

  const handleAccept = () => {
    onAccept(comment);
    setComment('');
  };

  const handleDecline = () => {
    onDecline(comment);
    setComment('');
  };

  return (
    <div className="beg-request">
      <div className="beg-request-info">
        <span className="beg-amount">{amount} sats</span>
        <span className="beg-reason">"{reason}"</span>
      </div>
      
      <div className="beg-comment-box">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment (optional)..."
          rows={2}
        />
      </div>
      
      <div className="beg-request-actions">
        <button
          className="beg-button accept"
          onClick={handleAccept}
          title="Accept"
        >
          <Check size={16} />
        </button>
        <button
          className="beg-button decline"
          onClick={handleDecline}
          title="Decline"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default BegRequest;