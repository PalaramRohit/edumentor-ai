interface ReadinessGaugeProps {
  percentage: number;
}

const ReadinessGauge = ({ percentage }: ReadinessGaugeProps) => {
  const radius = 80;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="glow-ring transform -rotate-90"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
            <stop offset="100%" stopColor="hsl(193, 95%, 62%)" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          className="progress-ring-bg"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          className="progress-ring-fill"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-foreground">{percentage}%</span>
        <span className="text-sm text-muted-foreground">Readiness</span>
      </div>
    </div>
  );
};

export default ReadinessGauge;
