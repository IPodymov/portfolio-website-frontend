import React from 'react';
import { ProjectStatus } from '../../types';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const STATUS_LABELS: Record<string, string> = {
  [ProjectStatus.PENDING]: 'Ожидает',
  [ProjectStatus.IN_PROGRESS]: 'В работе',
  [ProjectStatus.COMPLETED]: 'Завершён',
  [ProjectStatus.CANCELLED]: 'Отменён',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const label = STATUS_LABELS[status] || status;
  
  return (
    <span className={`status-badge status-badge--${status} status-badge--${size}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
