import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const baseStyles =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent';

  const variants = {
    default: 'border-transparent bg-primary/20 text-accent',
    secondary: 'border-transparent bg-muted text-foreground',
    outline: 'text-foreground border-border',
    success: 'border-transparent bg-green-500/20 text-green-400',
    warning: 'border-transparent bg-yellow-500/20 text-yellow-400',
    danger: 'border-transparent bg-red-500/20 text-red-400',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
}
