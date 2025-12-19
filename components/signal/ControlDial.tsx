'use client';

import { useState, useRef, useEffect } from 'react';

interface ControlDialProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    isUpsideDownMode: boolean;
    type?: 'dial' | 'slider';
}

export default function ControlDial({ label, value, onChange, isUpsideDownMode, type = 'slider' }: ControlDialProps) {
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => setIsDragging(true);

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            onChange(percentage);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onChange]);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className={`text-xs uppercase tracking-wider font-bold ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                    }`}>
                    {label}
                </label>
                <span className={`text-sm font-mono ${isUpsideDownMode ? 'text-upside-down-glow' : 'text-hawkins-text-primary'
                    }`}>
                    {Math.round(value)}
                </span>
            </div>

            {type === 'slider' ? (
                <div
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    className={`relative h-12 rounded border-2 cursor-pointer ${isUpsideDownMode ? 'bg-upside-down-bg border-upside-down-border' : 'bg-hawkins-bg border-hawkins-border'
                        }`}
                >
                    {/* Track fill */}
                    <div
                        className={`absolute inset-y-0 left-0 rounded ${isUpsideDownMode ? 'bg-upside-down-accent/30' : 'bg-hawkins-accent/30'
                            }`}
                        style={{ width: `${value}%` }}
                    />

                    {/* Thumb */}
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-8 rounded border-2 ${isUpsideDownMode
                                ? 'bg-upside-down-accent border-upside-down-glow'
                                : 'bg-hawkins-accent border-hawkins-accent-bright'
                            } transition-all ${isDragging ? 'scale-110' : ''}`}
                        style={{ left: `calc(${value}% - 8px)` }}
                    />

                    {/* Tick marks */}
                    <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none">
                        {[0, 25, 50, 75, 100].map((tick) => (
                            <div
                                key={tick}
                                className={`w-px h-2 ${isUpsideDownMode ? 'bg-upside-down-border' : 'bg-hawkins-border'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                // Rotary dial (simplified as slider for now)
                <div
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    className={`relative w-24 h-24 mx-auto rounded-full border-4 cursor-pointer ${isUpsideDownMode ? 'bg-upside-down-bg border-upside-down-border' : 'bg-hawkins-bg border-hawkins-border'
                        }`}
                >
                    <div
                        className={`absolute top-1/2 left-1/2 w-1 h-8 origin-bottom ${isUpsideDownMode ? 'bg-upside-down-accent' : 'bg-hawkins-accent'
                            }`}
                        style={{
                            transform: `translate(-50%, -100%) rotate(${(value / 100) * 270 - 135}deg)`,
                        }}
                    />
                </div>
            )}
        </div>
    );
}

