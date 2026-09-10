import React from 'react';
import { cn } from '../../lib/utils';
import type { Band } from '../../types';

export const Badge: React.FC<{ band: Band | string, className?: string }> = ({ band, className }) => {
  let bgColor = 'bg-band-stable';
  let textColor = 'text-muted';
  let label = 'Stable';

  switch (band) {
    case 'MONITOR':
      bgColor = 'bg-band-monitor';
      textColor = 'text-muted';
      label = 'Monitor';
      break;
    case 'CHECK_IN_RECOMMENDED':
      bgColor = 'bg-band-checkin';
      textColor = 'text-primary';
      label = 'Check-in recommended';
      break;
    case 'PRIORITY_CHECK_IN':
      bgColor = 'bg-band-priority';
      textColor = 'text-white';
      label = 'Priority check-in';
      break;
    case 'STABLE':
    default:
      if (typeof band === 'string' && !['STABLE', 'MONITOR', 'CHECK_IN_RECOMMENDED', 'PRIORITY_CHECK_IN'].includes(band)) {
          label = band;
      }
      break;
  }

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider', bgColor, textColor, className)}>
      {label}
    </span>
  );
};
