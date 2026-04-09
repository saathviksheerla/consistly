import * as React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  heightClass?: string;
  colorClass?: string;
}

export function ProgressBar({
  progress,
  className = '',
  heightClass = 'h-2.5',
  colorClass = 'bg-primary',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${heightClass} ${className}`}>
      <div
        className={`${colorClass} h-full rounded-full transition-all duration-500 ease-in-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 6,
  className = '',
  colorClass = 'text-primary',
  trackColorClass = 'text-muted',
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  colorClass?: string;
  trackColorClass?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className={trackColorClass}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-500 ease-in-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  );
}
