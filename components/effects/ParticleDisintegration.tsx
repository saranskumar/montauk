'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
}

interface ParticleDisintegrationProps {
    count?: number;
    performanceTier?: 'high' | 'medium' | 'low';
}

export default function ParticleDisintegration({
    count: propCount,
    performanceTier = 'high'
}: ParticleDisintegrationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | undefined>(undefined);

    // Adjust particle count based on performance
    const count = propCount ?? (performanceTier === 'high' ? 200 : performanceTier === 'medium' ? 100 : 50);

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

        // Initialize particles
        particlesRef.current = Array.from({ length: count }, (): Particle => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5 - 0.2, // Slight upward drift
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.3 + 0.1,
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particlesRef.current.forEach((particle) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around screen
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Draw particle (dark red spore)
                ctx.fillStyle = `rgba(139, 0, 0, ${particle.opacity})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                // Add subtle glow
                ctx.fillStyle = `rgba(75, 0, 0, ${particle.opacity * 0.5})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 2 }}
        />
    );
}
