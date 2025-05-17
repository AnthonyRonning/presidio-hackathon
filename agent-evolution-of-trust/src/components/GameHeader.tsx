import './GameHeader.css';

interface GameHeaderProps {
  round: number;
  maxRounds: number;
  gameStatus: 'waiting' | 'active' | 'ended';
  winner?: string;
}

const GameHeader = ({ round, maxRounds, gameStatus, winner }: GameHeaderProps) => {
  return (
    <header className="game-header">
      <h1 className="game-title">Agent Evolution of Trust</h1>
      <div className="game-info">
        <div className="round-info">
          <span className="round-label">Round</span>
          <span className="round-value">
            {round} / {maxRounds}
          </span>
        </div>
        <div className={`game-status status-${gameStatus}`}>
          {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}
          {winner && ` - Winner: ${winner}`}
        </div>
      </div>
    </header>
  );
};

export default GameHeader;