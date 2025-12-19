'use client';

import { useEffect, useRef } from 'react';

interface SignalWaveProps {
    signalStrength: number;
    frequency: number;
    isCalibrated: boolean;
}

export default function SignalWave({ signalStrength, frequency, isCalibrated }: SignalWaveProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
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

            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Draw grid
            ctx.strokeStyle = 'rgba(217, 119, 6, 0.1)';
            ctx.lineWidth = 1;

            // Vertical grid lines
            for (let x = 0; x < width; x += 20) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal grid lines
            for (let y = 0; y < height; y += 20) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Center line
            ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            // Calculate wave parameters
            const amplitude = (signalStrength / 100) * (height / 2 - 20);
            const waveFrequency = (frequency / 100) * 0.05 + 0.01;
            const speed = 0.05;

            // Add random noise based on signal strength (simulating interference)
            const noise = (100 - signalStrength) / 100 * 10;

            // Draw main signal wave
            ctx.beginPath();
            ctx.strokeStyle = isCalibrated
                ? 'rgba(16, 185, 129, 0.9)' // Green when calibrated
                : 'rgba(251, 191, 36, 0.9)'; // Amber when calibrating
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = isCalibrated ? '#10b981' : '#fbbf24';

            for (let x = 0; x < width; x += 2) {
                // Main wave
                const y = height / 2 +
                    Math.sin((x * waveFrequency) + (timeRef.current * speed)) * amplitude +
                    // Add random noise
                    (Math.random() - 0.5) * noise;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Draw secondary harmonic wave (fainter)
            ctx.beginPath();
            ctx.strokeStyle = isCalibrated
                ? 'rgba(16, 185, 129, 0.4)'
                : 'rgba(217, 119, 6, 0.4)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 5;

            for (let x = 0; x < width; x += 2) {
                const y = height / 2 +
                    Math.sin((x * waveFrequency * 2) + (timeRef.current * speed * 1.5)) * (amplitude * 0.3) +
                    (Math.random() - 0.5) * noise * 0.5;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Draw signal strength indicator bars
            const barWidth = 4;
            const barSpacing = 8;
            const maxBars = 20;
            const activeBars = Math.floor((signalStrength / 100) * maxBars);

            for (let i = 0; i < maxBars; i++) {
                const x = width - (maxBars - i) * (barWidth + barSpacing) - 10;
                const barHeight = (i + 1) * 3;
                const y = height - barHeight - 5;

                if (i < activeBars) {
                    // Active bars
                    const color = isCalibrated ? '#10b981' :
                        i < maxBars * 0.7 ? '#fbbf24' :
                            i < maxBars * 0.9 ? '#f59e0b' : '#dc2626';
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = color;
                } else {
                    // Inactive bars
                    ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
                    ctx.shadowBlur = 0;
                }

                ctx.fillRect(x, y, barWidth, barHeight);
            }

            // Reset shadow
            ctx.shadowBlur = 0;

            // Increment time
            timeRef.current += 1;

            // Continue animation
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [signalStrength, frequency, isCalibrated]);

    return (
        <div className="relative w-full h-48 border-2 border-hawkins-accent/50 rounded bg-black overflow-hidden"
            style={{
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 0 10px rgba(217, 119, 6, 0.3)',
            }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: 'block' }}
            />

            {/* Signal status overlay */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-hawkins-accent bg-black/80 px-2 py-1 rounded">
                {isCalibrated ? '● SIGNAL LOCKED' : '○ CALIBRATING...'}
            </div>

            {/* Signal strength percentage */}
            <div className="absolute top-2 right-2 text-xs font-mono text-hawkins-accent bg-black/80 px-2 py-1 rounded font-bold">
                {signalStrength}%
            </div>
        </div>
    );
}
