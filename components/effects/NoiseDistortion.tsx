'use client';

import { useEffect, useRef } from 'react';

interface NoiseDistortionProps {
    intensity?: number;
    speed?: number;
}

export default function NoiseDistortion({
    intensity = 0.03,
    speed = 0.5
}: NoiseDistortionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = (): void => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Simple noise function
        const noise = (x: number, y: number, t: number) => {
            return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5) * 0.5 + 0.5;
        };

        const animate = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear with slight transparency for trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Draw noise pattern
            const gridSize = 20;
            for (let x = 0; x < width; x += gridSize) {
                for (let y = 0; y < height; y += gridSize) {
                    const n = noise(x, y, timeRef.current * speed);
                    const alpha = n * intensity;

                    // Dark red noise
                    ctx.fillStyle = `rgba(139, 0, 0, ${alpha})`;
                    ctx.fillRect(x, y, gridSize, gridSize);
                }
            }

            // Chromatic aberration effect (subtle color shift)
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = `rgba(75, 0, 0, ${intensity * 0.5})`;
            ctx.fillRect(2, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';

            timeRef.current += 0.01;
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [intensity, speed]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none mix-blend-screen"
            style={{ zIndex: 3, opacity: 0.4 }}
        />
    );
}
