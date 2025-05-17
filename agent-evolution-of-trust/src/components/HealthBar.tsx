import './HealthBar.css';

interface HealthBarProps {
  current: number;
  max: number;
  percentage: number;
}

const HealthBar = ({ current, max, percentage }: HealthBarProps) => {
  const getBackgroundPosition = () => {
    // Gradient is from green to yellow to red
    // We want to show green when health is high, red when low
    const position = ((100 - percentage) / 100) * 100;
    return `${position}% 0`;
  };

  return (
    <div className="health-bar-container">
      <div className="health-bar">
        <div 
          className="health-bar-fill" 
          style={{ 
            width: `${Math.max(0, Math.min(100, percentage))}%`,
            backgroundPosition: getBackgroundPosition()
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