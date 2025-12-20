'use client';

import { useState, useEffect, useRef } from 'react';

interface SystemMonitorGraphProps {
    isUpsideDownMode: boolean;
    className?: string; // Add className prop to allow external sizing/positioning
}

export default function SystemMonitorGraph({ isUpsideDownMode, className = '' }: SystemMonitorGraphProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dataPoints, setDataPoints] = useState<number[]>([]);

    // Theme colors
    const primaryColorHex = isUpsideDownMode ? '#ef4444' : '#f59e0b'; // Red-500 : Amber-500
    const gridColorHex = isUpsideDownMode ? '#7f1d1d' : '#78350f'; // Red-900 : Amber-900
    const primaryColorClass = isUpsideDownMode ? 'text-red-500' : 'text-amber-500';
    const borderColorClass = isUpsideDownMode ? 'border-red-900' : 'border-amber-900';

    // Data generation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prev => {
                const newData = [...prev, Math.random() * 100];
                if (newData.length > 50) newData.shift();
                return newData;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    // Drawing loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw Grid
        ctx.strokeStyle = gridColorHex;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Verticals
        for (let x = 0; x <= width; x += width / 10) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        // Horizontals
        for (let y = 0; y <= height; y += height / 5) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Draw Data Line
        if (dataPoints.length > 1) {
            ctx.strokeStyle = primaryColorHex;
            ctx.lineWidth = 2;
            ctx.beginPath();

            const stepX = width / 50; // max 50 points

            dataPoints.forEach((point, index) => {
                const x = index * stepX;
                const y = height - (point / 100 * height);
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Draw area under line
            ctx.fillStyle = isUpsideDownMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)';
            ctx.lineTo(dataPoints.length * stepX, height);
            ctx.lineTo(0, height);
            ctx.fill();
        }

    }, [dataPoints, isUpsideDownMode, gridColorHex, primaryColorHex]);


    return (
        <div className={`flex flex-col border-2 ${borderColorClass} bg-black/80 h-full ${className}`}>
            <div className={`flex justify-between items-center px-2 py-1 border-b ${borderColorClass} bg-black/50`}>
                <span className={`font-mono text-xs font-bold ${primaryColorClass}`}>PSI-ENERGY LEVEL</span>
                <span className={`font-mono text-[10px] ${primaryColorClass}`}>LIVE MONITOR</span>
            </div>
            <div className="flex-1 relative min-h-0">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="absolute inset-0 w-full h-full"
                />
            </div>
            <div className={`flex justify-between items-center px-2 py-1 border-t ${borderColorClass} bg-black/50 text-[10px] font-mono ${primaryColorClass}`}>
                <span>MIN: 0.0</span>
                <span>MAX: 100.0</span>
                <span>AVG: 56.4</span>
            </div>
        </div>
    );
}
