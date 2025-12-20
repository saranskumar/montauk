'use client';

import { useMemo } from 'react';
import { Clock, Radio, Zap } from 'lucide-react';

interface HeaderProps {
    isUpsideDownMode: boolean;
    onToggleUpsideDown: () => void;
    onCreateIncident: () => void;
}

export default function Header({
    isUpsideDownMode,
    onToggleUpsideDown,
    onCreateIncident,
}: HeaderProps) {
    // Real-time clock
    const currentTime = useMemo(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false });
    }, []);

    return (
        <header
            className={`border-b-2 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-500 ${isUpsideDownMode
                ? 'border-upside-down-border bg-upside-down-bg/95'
                : 'border-hawkins-border bg-hawkins-bg/95'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Top Row */}
                <div className="flex items-center justify-between mb-4">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-4">
                        <div>
                            <h1
                                className={`text-xl font-bold tracking-[0.2em] uppercase ${isUpsideDownMode ? 'text-upside-down-accent glitch-text' : 'text-hawkins-accent'
                                    }`}
                                data-text="HAWKINS COMMAND"
                            >
                                HAWKINS COMMAND
                            </h1>
                            <p className="text-[10px] uppercase tracking-widest opacity-60">
                                Incident Management System
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        {/* Clock */}
                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-mono ${isUpsideDownMode
                                ? 'bg-upside-down-bg border border-upside-down-border text-upside-down-accent'
                                : 'bg-hawkins-bg-secondary border border-hawkins-border text-hawkins-text-primary'
                                }`}
                        >
                            <Clock className="w-4 h-4" />
                            <span className={isUpsideDownMode ? 'animate-glitch' : ''}>{currentTime}</span>
                        </div>

                        {/* UPSIDE DOWN Toggle */}
                        <button
                            onClick={onToggleUpsideDown}
                            className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm uppercase tracking-wider transition-all ${isUpsideDownMode
                                ? 'bg-upside-down-accent text-black hover:bg-upside-down-glow'
                                : 'bg-hawkins-bg-secondary border border-hawkins-border text-hawkins-text-primary hover:border-hawkins-accent'
                                }`}
                        >
                            <Radio className="w-4 h-4" />
                            {isUpsideDownMode ? 'EXIT UPSIDE DOWN' : 'UPSIDE DOWN'}
                        </button>

                        {/* Create Incident */}
                        <button
                            onClick={onCreateIncident}
                            className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm uppercase tracking-wider transition-all ${isUpsideDownMode
                                ? 'bg-upside-down-danger text-white hover:bg-pink-400'
                                : 'bg-hawkins-accent text-black hover:bg-hawkins-accent-bright'
                                }`}
                        >
                            <Zap className="w-4 h-4" />
                            LOG INCIDENT
                        </button>
                    </div>
                </div>

            </div>
        </header>
    );
}
