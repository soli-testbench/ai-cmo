import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps): React.ReactElement {
  return <span className={`badge badge-${status} ${className}`}>{status}</span>;
}
