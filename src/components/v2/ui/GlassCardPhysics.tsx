import React, { useEffect, useRef } from 'react';

interface GlassCardPhysicsProps {
  type: 'exiles' | 'leaderboard';
  isHovered: boolean;
  isActive: boolean;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label?: string;
  pulsePhase: number;
}

interface RankBlock {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  vAngle: number;
  color: string;
  rankText: string;
  scoreText: string;
}

export const GlassCardPhysics: React.FC<GlassCardPhysicsProps> = ({ type, isHovered, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 340);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const isExiles = type === 'exiles';

    // Resize listener
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (canvas) {
          width = canvas.width = entry.contentRect.width;
          height = canvas.height = entry.contentRect.height;
        }
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initialize Exiles Orbs
    const exilesColors = [
      'rgba(0, 240, 255, 0.7)',
      'rgba(59, 130, 246, 0.7)',
      'rgba(6, 182, 212, 0.7)',
      'rgba(147, 51, 234, 0.6)',
      'rgba(255, 255, 255, 0.8)',
    ];

    const labels = ['WS', 'PING', 'ACK', 'ROOM', 'SYNC', 'LOG', 'NODE'];

    const orbs: Orb[] = Array.from({ length: 9 }, (_, i) => ({
      x: 30 + Math.random() * (width - 60),
      y: -20 - i * 45,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1 + Math.random() * 2,
      radius: 12 + Math.random() * 12,
      color: exilesColors[i % exilesColors.length],
      label: labels[i % labels.length],
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Initialize Leaderboard Blocks
    const lbColors = [
      'rgba(245, 158, 11, 0.8)',
      'rgba(234, 179, 8, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(239, 68, 68, 0.7)',
      'rgba(16, 185, 129, 0.7)',
    ];

    const rankData = [
      { r: '#01', s: '99.4k' },
      { r: '#02', s: '88.1k' },
      { r: '#03', s: '76.9k' },
      { r: '#04', s: '65.2k' },
      { r: '#05', s: '54.0k' },
      { r: '#06', s: '42.8k' },
      { r: '#07', s: '31.5k' },
    ];

    const blocks: RankBlock[] = rankData.map((data, i) => ({
      x: 40 + Math.random() * (width - 80),
      y: -30 - i * 55,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1.5 + Math.random() * 2,
      width: 54 + (i === 0 ? 12 : 0),
      height: 28,
      angle: (Math.random() - 0.5) * 0.4,
      vAngle: (Math.random() - 0.5) * 0.04,
      color: lbColors[i % lbColors.length],
      rankText: data.r,
      scoreText: data.s,
    }));

    const gravity = 0.18;
    const bounce = 0.62;
    const friction = 0.985;

    // Mouse tracking inside canvas parent
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

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mousePosRef.current;

      if (isExiles) {
        // --- Render Exiles Glass Orbs ---
        // Render signal connection lines between nearby orbs
        ctx.lineWidth = 1;
        for (let i = 0; i < orbs.length; i++) {
          for (let j = i + 1; j < orbs.length; j++) {
            const dx = orbs[j].x - orbs[i].x;
            const dy = orbs[j].y - orbs[i].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 90) {
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 * (1 - dist / 90)})`;
              ctx.beginPath();
              ctx.moveTo(orbs[i].x, orbs[i].y);
              ctx.lineTo(orbs[j].x, orbs[j].y);
              ctx.stroke();
            }
          }
        }

        // Update & Render Orbs
        for (const orb of orbs) {
          orb.vy += gravity;
          orb.vx *= friction;
          orb.vy *= friction;

          orb.x += orb.vx;
          orb.y += orb.vy;
          orb.pulsePhase += 0.04;

          // Mouse Repulsion Force
          if (mouse.active) {
            const dx = orb.x - mouse.x;
            const dy = orb.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 100 && dist > 0) {
              const force = (100 - dist) / 100;
              orb.vx += (dx / dist) * force * 2.5;
              orb.vy += (dy / dist) * force * 2.5 - 0.5;
            }
          }

          // Card Boundary Floor Bounce
          const floorY = height - orb.radius - 12;
          if (orb.y > floorY) {
            orb.y = floorY;
            orb.vy = -Math.abs(orb.vy) * bounce;
            if (Math.abs(orb.vy) < 0.3) orb.vy = -0.8 - Math.random() * 0.5; // continuous gentle float
          }

          // Wall Bounces
          if (orb.x - orb.radius < 12) {
            orb.x = 12 + orb.radius;
            orb.vx = Math.abs(orb.vx) * bounce;
          }
          if (orb.x + orb.radius > width - 12) {
            orb.x = width - 12 - orb.radius;
            orb.vx = -Math.abs(orb.vx) * bounce;
          }

          // Render Outer Glass Sphere Glow
          const glowGrad = ctx.createRadialGradient(
            orb.x,
            orb.y,
            0,
            orb.x,
            orb.y,
            orb.radius * 1.8
          );
          glowGrad.addColorStop(0, orb.color);
          glowGrad.addColorStop(0.5, orb.color.replace('0.7', '0.25'));
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius * 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Glass Circle Core
          ctx.save();
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(10, 15, 30, 0.65)';
          ctx.strokeStyle = orb.color;
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();

          // Glass Highlight Specular Refraction
          ctx.beginPath();
          ctx.arc(orb.x - orb.radius * 0.3, orb.y - orb.radius * 0.3, orb.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.fill();

          // Label Text
          if (orb.label && orb.radius >= 14) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.font = '600 8px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(orb.label, orb.x, orb.y);
          }

          ctx.restore();
        }
      } else {
        // --- Render Leaderboard Falling Rank Blocks ---
        for (const block of blocks) {
          block.vy += gravity;
          block.vx *= friction;
          block.vy *= friction;
          block.angle += block.vAngle;

          block.x += block.vx;
          block.y += block.vy;

          // Mouse Force Repulsion
          if (mouse.active) {
            const dx = block.x - mouse.x;
            const dy = block.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110 && dist > 0) {
              const force = (110 - dist) / 110;
              block.vx += (dx / dist) * force * 3;
              block.vy += (dy / dist) * force * 3 - 0.6;
              block.vAngle += (Math.random() - 0.5) * 0.08;
            }
          }

          // Floor Bounce
          const floorY = height - block.height - 14;
          if (block.y > floorY) {
            block.y = floorY;
            block.vy = -Math.abs(block.vy) * bounce;
            block.vAngle *= 0.5;
            if (Math.abs(block.vy) < 0.3) block.vy = -0.9 - Math.random() * 0.6; // gentle re-float stack
          }

          // Wall Bounce
          if (block.x < 14) {
            block.x = 14;
            block.vx = Math.abs(block.vx) * bounce;
          }
          if (block.x + block.width > width - 14) {
            block.x = width - 14 - block.width;
            block.vx = -Math.abs(block.vx) * bounce;
          }

          // Draw Glass Rank Block
          ctx.save();
          ctx.translate(block.x + block.width / 2, block.y + block.height / 2);
          ctx.rotate(block.angle);

          // Glow Shadow
          ctx.shadowColor = block.color;
          ctx.shadowBlur = isHovered ? 18 : 8;

          // Block Fill
          ctx.beginPath();
          const r = 6;
          const w = block.width;
          const h = block.height;
          const hw = w / 2;
          const hh = h / 2;

          ctx.roundRect(-hw, -hh, w, h, r);
          ctx.fillStyle = 'rgba(12, 10, 24, 0.75)';
          ctx.strokeStyle = block.color;
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();

          // Rank Badge Text
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 9px monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(block.rankText, -hw + 7, 0);

          // Score Text
          ctx.fillStyle = block.color;
          ctx.font = '600 8px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(block.scoreText, hw - 7, 0);

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
        canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
        canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [type, isHovered, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-85 transition-opacity duration-700"
    />
  );
};
