import React, { useEffect, useRef } from 'react';

interface GlassCardOrbitalCoreProps {
  type: 'exiles' | 'leaderboard';
  isHovered: boolean;
  isActive: boolean;
}

interface OrbitParticle {
  radius: number; // distance from core
  angle: number; // current angle in radians
  speed: number; // orbital speed
  tiltX: number; // 3D plane tilt angle X
  tiltY: number; // 3D plane tilt angle Y
  size: number;
  color: string;
  label?: string;
  pulsePhase: number;
}

interface EnergyPulse {
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

export const GlassCardOrbitalCore: React.FC<GlassCardOrbitalCoreProps> = ({ type, isHovered, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 340);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const isExiles = type === 'exiles';

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

    // Colors
    const primaryColor = isExiles ? 'rgba(0, 240, 255, 0.85)' : 'rgba(245, 158, 11, 0.85)';
    const secondaryColor = isExiles ? 'rgba(147, 51, 234, 0.75)' : 'rgba(234, 179, 8, 0.75)';
    const accentColor = isExiles ? 'rgba(59, 130, 246, 0.8)' : 'rgba(239, 68, 68, 0.8)';

    const exilesLabels = ['WS', 'SYNC', 'PING', 'ACK', 'ROOM', 'IDEM', 'DATA', 'STREAM'];
    const lbLabels = ['#01', '99.4k', '#02', 'RANK', '#03', 'TOP 1%', 'LIVE', 'MUTATE'];

    const labels = isExiles ? exilesLabels : lbLabels;

    // Create 3D Orbiting Nodes
    const particleCount = 10;
    const particles: OrbitParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      radius: 65 + (i % 3) * 28 + Math.random() * 10,
      angle: (i / particleCount) * Math.PI * 2 + Math.random() * 0.5,
      speed: (0.012 + Math.random() * 0.015) * (i % 2 === 0 ? 1 : -1),
      tiltX: (Math.PI / 6) + (Math.random() - 0.5) * 0.4,
      tiltY: (i % 2 === 0 ? 1 : -1) * (Math.PI / 8 + Math.random() * 0.3),
      size: isExiles ? 5 + Math.random() * 6 : 7 + Math.random() * 5,
      color: i % 3 === 0 ? primaryColor : i % 3 === 1 ? secondaryColor : accentColor,
      label: labels[i % labels.length],
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Energy shockwave pulses emanating from core
    const pulses: EnergyPulse[] = [];
    let lastPulseTime = Date.now();

    // Core Rotation Angles
    let coreRotationX = 0;
    let coreRotationY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mousePosRef.current = { x: mx, y: my, active: true };
      targetRotY = ((mx - width / 2) / (width / 2)) * 0.45;
      targetRotX = ((my - height / 2) / (height / 2)) * -0.45;
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
      targetRotX = 0;
      targetRotY = 0;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Main Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth interpolation for 3D tilt
      coreRotationX += (targetRotX - coreRotationX) * 0.06;
      coreRotationY += (targetRotY - coreRotationY) * 0.06;

      const hoverSpeedMult = isHovered ? 1.8 : 1.0;

      // Trigger periodic core energy pulse
      const now = Date.now();
      if (now - lastPulseTime > (isHovered ? 1200 : 2200)) {
        pulses.push({
          radius: 10,
          maxRadius: Math.min(width, height) * 0.42,
          opacity: 0.8,
          color: primaryColor,
        });
        lastPulseTime = now;
      }

      // --- 1. Draw Energy Pulses ---
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += isHovered ? 2.5 : 1.4;
        p.opacity = 0.8 * (1 - p.radius / p.maxRadius);

        if (p.opacity <= 0 || p.radius >= p.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = p.color.replace('0.85', p.opacity.toFixed(2));
        ctx.lineWidth = 1.5;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      // --- 2. Draw 3D Orbit Rings ---
      const drawOrbitRing = (radius: number, tiltX: number, tiltY: number, strokeStyle: string, dashPattern: number[] = []) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(coreRotationY + tiltY);
        ctx.scale(1, Math.cos(coreRotationX + tiltX));

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1.2;
        if (dashPattern.length > 0) ctx.setLineDash(dashPattern);
        ctx.shadowColor = strokeStyle;
        ctx.shadowBlur = isHovered ? 14 : 6;
        ctx.stroke();
        ctx.restore();
      };

      // Dual Concentric Orbit Rings
      drawOrbitRing(70, Math.PI / 5, 0.2, primaryColor.replace('0.85', '0.4'), [6, 8]);
      drawOrbitRing(105, -Math.PI / 6, -0.3, secondaryColor.replace('0.75', '0.35'), [4, 12]);
      if (isHovered) {
        drawOrbitRing(135, Math.PI / 4, 0.5, accentColor.replace('0.8', '0.3'), [2, 6]);
      }

      // --- 3. Draw Central Core Engine ---
      ctx.save();
      ctx.translate(centerX, centerY);

      // Core Ambient Radial Glow
      const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, isHovered ? 55 : 42);
      coreGlow.addColorStop(0, primaryColor);
      coreGlow.addColorStop(0.4, secondaryColor.replace('0.75', '0.4'));
      coreGlow.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(0, 0, isHovered ? 55 : 42, 0, Math.PI * 2);
      ctx.fill();

      // Solid Core Sphere
      ctx.beginPath();
      ctx.arc(0, 0, isHovered ? 18 : 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(5, 5, 12, 0.9)';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.stroke();

      // Inner Core Specular Spec
      ctx.beginPath();
      ctx.arc(-4, -4, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fill();

      ctx.restore();

      // --- 4. Project & Render 3D Orbiting Particles ---
      const projectedParticles = particles.map((p) => {
        p.angle += p.speed * hoverSpeedMult;
        p.pulsePhase += 0.05;

        // 3D Orbital Calculation around Center
        const cosA = Math.cos(p.angle);
        const sinA = Math.sin(p.angle);

        // Position in un-rotated orbit plane
        let x = p.radius * cosA;
        let y = 0;
        let z = p.radius * sinA;

        // Apply plane tilts & mouse rotation
        const rx = coreRotationX + p.tiltX;
        const ry = coreRotationY + p.tiltY;

        // Rotate Y
        const x1 = x * Math.cos(ry) + z * Math.sin(ry);
        const z1 = -x * Math.sin(ry) + z * Math.cos(ry);

        // Rotate X
        const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
        const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);

        // Perspective Projection
        const fov = 350;
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        return {
          ...p,
          projX,
          projY,
          scale,
          z: z2,
        };
      });

      // Sort by Z for proper 3D depth rendering
      projectedParticles.sort((a, b) => b.z - a.z);

      // Render Connection Beams between closest orbital nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projectedParticles.length; i++) {
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p1 = projectedParticles[i];
          const p2 = projectedParticles[j];
          const dist = Math.hypot(p2.projX - p1.projX, p2.projY - p1.projY);
          if (dist < 95) {
            ctx.strokeStyle = primaryColor.replace('0.85', (0.45 * (1 - dist / 95)).toFixed(2));
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw Orbiting Nodes & Badges
      for (const p of projectedParticles) {
        const drawRadius = Math.max(3, p.size * p.scale);
        const opacity = Math.min(1, Math.max(0.2, (p.scale - 0.6) * 2));

        ctx.save();
        ctx.translate(p.projX, p.projY);

        if (isExiles) {
          // --- Exiles Glass Node ---
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12 * p.scale;

          ctx.beginPath();
          ctx.arc(0, 0, drawRadius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(8, 12, 24, 0.85)';
          ctx.strokeStyle = p.color.replace('0.85', opacity.toFixed(2));
          ctx.lineWidth = 1.4;
          ctx.fill();
          ctx.stroke();

          // Label
          if (p.label && drawRadius >= 5) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.font = `${Math.round(8 * p.scale)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, 0, 0);
          }
        } else {
          // --- Leaderboard Rank Badge ---
          const bw = 38 * p.scale;
          const bh = 18 * p.scale;

          ctx.shadowColor = p.color;
          ctx.shadowBlur = 14 * p.scale;

          ctx.beginPath();
          ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 4 * p.scale);
          ctx.fillStyle = 'rgba(14, 10, 24, 0.85)';
          ctx.strokeStyle = p.color.replace('0.85', opacity.toFixed(2));
          ctx.lineWidth = 1.3;
          ctx.fill();
          ctx.stroke();

          if (p.label) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.font = `700 ${Math.round(8 * p.scale)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, 0, 0);
          }
        }

        ctx.restore();
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
      className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-90 transition-opacity duration-700"
    />
  );
};
