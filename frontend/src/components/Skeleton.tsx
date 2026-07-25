import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', lines = 1, variant = 'text' }) => {
  if (variant === 'circle') {
    return (
      <div className={`rounded-full bg-[#222a3d] animate-pulse ${className}`} />
    );
  }

  if (variant === 'rect') {
    return (
      <div className={`rounded-lg bg-[#222a3d] animate-pulse ${className}`} />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-[#222a3d] rounded animate-pulse"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#171f33] border border-[#434655]/40 rounded-xl p-4 space-y-3 ${className}`}>
    <div className="flex items-center gap-3">
      <Skeleton variant="circle" className="w-10 h-10" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-1/2 h-2.5" />
      </div>
    </div>
    <Skeleton lines={3} />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; className?: string }> = ({ rows = 5, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center p-2">
        <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
        <Skeleton className="flex-1 h-3" />
        <Skeleton className="w-16 h-3" />
      </div>
    ))}
  </div>
);
