import { useState } from 'react';
import { X, Check } from 'lucide-react';
import './BegModal.css';

interface BegModalProps {
  botName: string;
  amount: number;
  reason: string;
  onAccept: (comment: string) => void;
  onDecline: (comment: string) => void;
}

const BegModal = ({ botName, amount, reason, onAccept, onDecline }: BegModalProps) => {
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
    <div className="beg-modal-overlay">
      <div className="beg-modal">
        <div className="beg-modal-header">
          <h3>Beg Request</h3>
        </div>
        
        <div className="beg-modal-content">
          <p className="beg-info">
            <strong>{botName}</strong> is requesting <strong>{amount} sats</strong>
          </p>
          <p className="beg-reason">"{reason}"</p>
          
          <div className="comment-section">
            <label htmlFor="comment">Your response (optional):</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter a reason for your decision..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="beg-modal-actions">
          <button
            className="modal-button accept"
            onClick={handleAccept}
          >
            <Check size={20} />
            Accept
          </button>
          <button
            className="modal-button decline"
            onClick={handleDecline}
          >
            <X size={20} />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default BegModal;