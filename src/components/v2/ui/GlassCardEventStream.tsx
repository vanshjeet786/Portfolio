import React, { useEffect, useRef } from 'react';

interface GlassCardEventStreamProps {
  type: 'exiles' | 'leaderboard';
  isHovered: boolean;
  isActive: boolean;
}

interface StreamLine {
  x: number;
  y: number;
  speed: number;
  length: number;
  width: number;
  color: string;
  headGlow: string;
  badge?: {
    text: string;
    offsetY: number;
    color: string;
  };
}

export const GlassCardEventStream: React.FC<GlassCardEventStreamProps> = ({
  type,
  isHovered,
  isActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const parent = canvas.parentElement;

    let width = 340;
    let height = 460;
    let dpr = window.devicePixelRatio || 1;

    const setupCanvasSize = () => {
      if (!canvas || !parent) return;
      width = parent.clientWidth || 340;
      height = parent.clientHeight || 460;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setupCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      setupCanvasSize();
    });
    if (parent) resizeObserver.observe(parent);

    const isExiles = type === 'exiles';

    // Color definitions
    const exilesPrimary = 'rgba(0, 240, 255, 0.9)';
    const exilesSecondary = 'rgba(59, 130, 246, 0.75)';
    const exilesAccent = 'rgba(16, 185, 129, 0.85)';

    const lbPrimary = 'rgba(245, 158, 11, 0.9)';
    const lbSecondary = 'rgba(234, 179, 8, 0.8)';
    const lbAccent = 'rgba(168, 85, 247, 0.85)';

    const exilesBadges = [
      'DELIVERY',
      'ORDERED',
      'PRESENCE',
      'SOCKET',
      'IDEMPOTENT',
      'STREAM',
      'SIGNAL',
      'RECONNECT',
    ];

    const lbBadges = [
      'INGEST',
      'MUTATION',
      'TOP 1%',
      'RANK #1',
      'EVENT',
      'RECORD',
      'STATE',
      '+250 PTS',
    ];

    const badges = isExiles ? exilesBadges : lbBadges;
    const streamCount = 14;

    // Create Stream Columns
    const streams: StreamLine[] = Array.from({ length: streamCount }, (_, i) => {
      const colX = (width / (streamCount + 1)) * (i + 1) + (Math.random() - 0.5) * 8;
      const isPrimary = i % 3 === 0;
      const isSecondary = i % 3 === 1;

      const streamColor = isExiles
        ? isPrimary
          ? exilesPrimary
          : isSecondary
          ? exilesSecondary
          : exilesAccent
        : isPrimary
        ? lbPrimary
        : isSecondary
        ? lbSecondary
        : lbAccent;

      const hasBadge = Math.random() > 0.45;

      return {
        x: colX,
        y: -100 - Math.random() * 500,
        speed: 1.8 + Math.random() * 2.2,
        length: 70 + Math.random() * 90,
        width: isPrimary ? 2 : 1.2,
        color: streamColor,
        headGlow: isPrimary ? '#ffffff' : streamColor,
        badge: hasBadge
          ? {
              text: badges[i % badges.length],
              offsetY: 20 + Math.random() * 40,
              color: streamColor,
            }
          : undefined,
      };
    });

    // Mouse events inside card
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mousePosRef.current;
      const hoverSpeedBoost = isHovered ? 1.5 : 1.0;

      // Draw subtle horizontal grid scanning lines
      ctx.strokeStyle = isExiles ? 'rgba(0, 240, 255, 0.04)' : 'rgba(245, 158, 11, 0.04)';
      ctx.lineWidth = 1;
      const gridStep = 40;
      for (let gy = gridStep; gy < height; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Check for horizontal signal connections between passing stream heads
      ctx.lineWidth = 0.8;
      for (let i = 0; i < streams.length; i++) {
        for (let j = i + 1; j < streams.length; j++) {
          const s1 = streams[i];
          const s2 = streams[j];
          const dy = Math.abs(s1.y - s2.y);
          const dx = Math.abs(s1.x - s2.x);

          if (dy < 12 && dx < 65 && s1.y > 0 && s1.y < height) {
            const opacity = (1 - dy / 12) * (1 - dx / 65) * 0.5;
            ctx.strokeStyle = isExiles
              ? `rgba(0, 240, 255, ${opacity})`
              : `rgba(245, 158, 11, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      // Update & Render Streams
      for (const s of streams) {
        s.y += s.speed * hoverSpeedBoost;

        // Reset stream when it leaves bottom
        if (s.y - s.length > height + 20) {
          s.y = -50 - Math.random() * 150;
          s.speed = 1.8 + Math.random() * 2.2;
        }

        // Apply gentle mouse force displacement
        let renderX = s.x;
        if (mouse.active) {
          const dx = renderX - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90 && dist > 0) {
            const force = (90 - dist) / 90;
            renderX += (dx / dist) * force * 16;
          }
        }

        // Draw Stream Tail (Linear Gradient from bright head to transparent tail)
        const tailY = s.y - s.length;
        const grad = ctx.createLinearGradient(renderX, tailY, renderX, s.y);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.7, s.color.replace('0.9', '0.25').replace('0.85', '0.25').replace('0.75', '0.2'));
        grad.addColorStop(1, s.color);

        ctx.lineWidth = s.width;
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(renderX, tailY);
        ctx.lineTo(renderX, s.y);
        ctx.stroke();

        // Draw Head Glowing Spark
        if (s.y >= 0 && s.y <= height) {
          ctx.save();
          ctx.shadowColor = s.color;
          ctx.shadowBlur = isHovered ? 14 : 8;

          ctx.fillStyle = s.headGlow;
          ctx.beginPath();
          ctx.arc(renderX, s.y, s.width * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw Micro Architectural Signal Badge
        if (s.badge && s.y - s.badge.offsetY > 10 && s.y - s.badge.offsetY < height - 10) {
          const badgeY = s.y - s.badge.offsetY;
          ctx.save();
          ctx.font = '700 8px monospace';
          const textWidth = ctx.measureText(s.badge.text).width;
          const padX = 5;
          const bw = textWidth + padX * 2;
          const bh = 14;

          // Glass Badge Box
          ctx.shadowColor = s.color;
          ctx.shadowBlur = isHovered ? 10 : 4;
          ctx.fillStyle = 'rgba(8, 10, 20, 0.85)';
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.roundRect(renderX - bw / 2, badgeY - bh / 2, bw, bh, 3);
          ctx.fill();
          ctx.stroke();

          // Badge Text
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(s.badge.text, renderX, badgeY);

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      if (parent) {
        resizeObserver.unobserve(parent);
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [type, isHovered, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-90 transition-opacity duration-700"
    />
  );
};
