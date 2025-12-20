'use client';

import { useEffect, useRef, useState } from 'react';

interface MiniSignalWaveProps {
    isUpsideDownMode: boolean;
}

export default function MiniSignalWave({ isUpsideDownMode }: MiniSignalWaveProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);

    // Simulate live signal data
    const [signalStrength, setSignalStrength] = useState(85);

    // Theme colors
    const primaryColor = isUpsideDownMode ? '#ef4444' : '#f59e0b'; // Red or Amber
    const secondaryColor = isUpsideDownMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)';
    const gridColor = isUpsideDownMode ? 'rgba(127, 29, 29, 0.3)' : 'rgba(120, 53, 15, 0.3)';

    useEffect(() => {
        // Randomly fluctuate signal strength around 85-98%
        const interval = setInterval(() => {
            setSignalStrength(prev => {
                const change = (Math.random() - 0.5) * 5;
                const next = Math.min(99, Math.max(80, prev + change));
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const draw = () => {
            const width = canvas.width / window.devicePixelRatio;
            const height = canvas.height / window.devicePixelRatio;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Draw Background Grid
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x <= width; x += 20) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            // Horizontal lines
            for (let y = 0; y <= height; y += 15) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw Sine Wave
            ctx.beginPath();
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 1.5;

            const amplitude = 15;
            const frequency = 0.05;
            const speed = 0.08;

            for (let x = 0; x < width; x++) {
                const y = height / 2 +
                    Math.sin(x * frequency + timeRef.current * speed) * amplitude * (signalStrength / 100) +
                    (Math.random() - 0.5) * 2; // Noise

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw Fill
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.fillStyle = secondaryColor;
            ctx.fill();

            timeRef.current++;
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isUpsideDownMode, signalStrength, primaryColor, secondaryColor, gridColor]);

    return (
        <div className={`fixed bottom-12 right-4 z-40 w-64 h-32 bg-black/90 border-2 ${isUpsideDownMode ? 'border-red-900' : 'border-amber-900'} shadow-lg backdrop-blur flex flex-col overflow-hidden`}>
            {/* Header */}
            <div className={`flex justify-between items-center px-2 py-1 border-b ${isUpsideDownMode ? 'border-red-900' : 'border-amber-900'} bg-black/50`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isUpsideDownMode ? 'text-red-500' : 'text-amber-500'}`}>
                    Signal Coherence
                </span>
                <span className={`text-[10px] font-mono font-bold ${isUpsideDownMode ? 'text-red-400' : 'text-amber-400'}`}>
                    {signalStrength.toFixed(1)}%
                </span>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 relative">
                <canvas ref={canvasRef} className="w-full h-full block" />

                {/* Overlay Text */}
                <div className="absolute bottom-1 left-2 text-[8px] font-mono text-gray-500">
                    FREQ: 14.2MHz | MOD: SINE
                </div>
            </div>
        </div>
    );
}
