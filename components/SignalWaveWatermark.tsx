'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SignalWaveWatermarkProps {
    isUpsideDownMode?: boolean;
}

export default function SignalWaveWatermark({ isUpsideDownMode = false }: SignalWaveWatermarkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);
    const [isMinimized, setIsMinimized] = useState(false);

    // Simulated signal parameters (you can make these dynamic if needed)
    const signalStrength = 80;
    const frequency = 75;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || isMinimized) return;

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
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, width, height);

            // Draw grid (lighter for watermark)
            ctx.strokeStyle = isUpsideDownMode
                ? 'rgba(220, 38, 38, 0.08)'
                : 'rgba(217, 119, 6, 0.08)';
            ctx.lineWidth = 1;

            // Vertical grid lines
            for (let x = 0; x < width; x += 15) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal grid lines
            for (let y = 0; y < height; y += 15) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Center line
            ctx.strokeStyle = isUpsideDownMode
                ? 'rgba(220, 38, 38, 0.2)'
                : 'rgba(217, 119, 6, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            // Calculate wave parameters
            const amplitude = (signalStrength / 100) * (height / 2 - 10);
            const waveFrequency = (frequency / 100) * 0.05 + 0.01;
            const speed = 0.05;

            // Draw main signal wave
            ctx.beginPath();
            ctx.strokeStyle = isUpsideDownMode
                ? 'rgba(220, 38, 38, 0.7)'
                : 'rgba(16, 185, 129, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 5;
            ctx.shadowColor = isUpsideDownMode ? '#dc2626' : '#10b981';

            for (let x = 0; x < width; x += 2) {
                const y = height / 2 +
                    Math.sin((x * waveFrequency) + (timeRef.current * speed)) * amplitude;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Draw secondary harmonic wave (fainter)
            ctx.beginPath();
            ctx.strokeStyle = isUpsideDownMode
                ? 'rgba(220, 38, 38, 0.3)'
                : 'rgba(16, 185, 129, 0.3)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 3;

            for (let x = 0; x < width; x += 2) {
                const y = height / 2 +
                    Math.sin((x * waveFrequency * 2) + (timeRef.current * speed * 1.5)) * (amplitude * 0.3);

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

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
    }, [signalStrength, frequency, isMinimized, isUpsideDownMode]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`fixed bottom-4 right-4 z-20 ${isMinimized ? 'w-12 h-12' : 'w-64 h-32'} transition-all duration-300`}
        >
            <div
                className={`relative w-full h-full border ${isUpsideDownMode
                        ? 'border-upside-down-accent/30 bg-black/60'
                        : 'border-hawkins-accent/30 bg-black/60'
                    } rounded backdrop-blur-sm overflow-hidden group hover:border-opacity-60 transition-all`}
                style={{
                    boxShadow: isUpsideDownMode
                        ? '0 0 10px rgba(220, 38, 38, 0.2)'
                        : '0 0 10px rgba(217, 119, 6, 0.2)',
                }}
            >
                {!isMinimized && (
                    <>
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full"
                            style={{ display: 'block' }}
                        />

                        {/* Signal status overlay */}
                        <div className={`absolute top-1 left-1 text-[8px] font-mono ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                            } bg-black/80 px-1 py-0.5 rounded`}>
                            ● SIGNAL
                        </div>

                        {/* Signal strength percentage */}
                        <div className={`absolute top-1 right-1 text-[8px] font-mono ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                            } bg-black/80 px-1 py-0.5 rounded font-bold`}>
                            {signalStrength}%
                        </div>
                    </>
                )}

                {/* Toggle button */}
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className={`absolute bottom-1 right-1 text-[8px] font-mono ${isUpsideDownMode ? 'text-upside-down-accent hover:text-upside-down-glow' : 'text-hawkins-accent hover:text-hawkins-text-primary'
                        } bg-black/80 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity`}
                    title={isMinimized ? 'Expand' : 'Minimize'}
                >
                    {isMinimized ? '□' : '_'}
                </button>

                {isMinimized && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-xs font-mono ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                            }`}>
                            ●
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
