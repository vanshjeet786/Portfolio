import type { ReactNode, FC } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard: FC<GlassCardProps> = ({ children, className = '' }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: isMobile ? 'rgba(10, 10, 10, 0.92)' : 'rgba(255, 255, 255, 0.02)',
        backdropFilter: isMobile ? 'blur(8px)' : 'blur(16px)',
        WebkitBackdropFilter: isMobile ? 'blur(8px)' : 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Subtle top glare effect */}
      <div 
        className="absolute top-0 left-0 w-full h-[1px] opacity-30" 
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)'
        }}
      />
      {children}
    </div>
  );
};
