import './HealthBar.css';

interface HealthBarProps {
  current: number;
  max: number;
  percentage: number;
}

const HealthBar = ({ current, max, percentage }: HealthBarProps) => {
  const getHealthColor = () => {
    if (percentage > 60) return 'var(--success)';
    if (percentage > 30) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="health-bar-container">
      <div className="health-bar">
        <div 
          className="health-bar-fill" 
          style={{ 
            width: `${Math.max(0, Math.min(100, percentage))}%`,
            backgroundColor: getHealthColor()
          }}
        />
      </div>
      <div className="health-text">
        {current} / {max}
      </div>
    </div>
  );
};

export default HealthBar;