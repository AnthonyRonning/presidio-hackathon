import './GameHeader.css';

interface GameHeaderProps {
  round: number;
  maxRounds: number;
  gameStatus: 'waiting' | 'active' | 'ended';
}

const GameHeader = ({ round, maxRounds, gameStatus }: GameHeaderProps) => {
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
        </div>
      </div>
    </header>
  );
};

export default GameHeader;