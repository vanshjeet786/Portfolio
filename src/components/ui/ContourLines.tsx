import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

interface ContourLinesProps {
  isFracturing: boolean;
}

export const ContourLines = ({ isFracturing }: ContourLinesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise3D = createNoise3D();

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with very slight transparency to leave trails when fracturing
      ctx.fillStyle = isFracturing ? 'rgba(21, 22, 24, 0.8)' : '#151618';
      ctx.fillRect(0, 0, width, height);

      const scale = isFracturing ? 0.005 : 0.003; // Harsher scaling on fracture
      const levels = 8;

      // Draw grid points for contour mapping
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 10) {
        for (let y = 0; y < height; y += 10) {
           const noiseVal = noise3D(x * scale, y * scale, time);
           // Map noise from [-1, 1] to [0, 1]
           const normalizedNoise = (noiseVal + 1) / 2;

           // Multiply by number of levels to get bands
           const level = Math.floor(normalizedNoise * levels);
           const threshold = (level / levels);

           // Only draw points if they are close to the threshold to form lines
           if (Math.abs(normalizedNoise - threshold) < (isFracturing ? 0.02 : 0.01)) {
             // Jitter during fracture
             const jitterX = isFracturing ? (Math.random() - 0.5) * 5 : 0;
             const jitterY = isFracturing ? (Math.random() - 0.5) * 5 : 0;

             ctx.fillStyle = isFracturing ? 'rgba(255, 255, 255, 0.15)' : 'rgba(44, 47, 51, 0.4)'; // Dark Ash
             ctx.fillRect(x + jitterX, y + jitterY, 1.5, 1.5);
           }
        }
      }

      // Advance time for drift
      time += isFracturing ? 0.02 : 0.002;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isFracturing]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
