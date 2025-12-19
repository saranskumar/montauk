'use client';

import { useMemo, useRef } from 'react';
import { Clock, Radio, Zap } from 'lucide-react';

interface HeaderProps {
    isUpsideDownMode: boolean;
    onToggleUpsideDown: (x: number, y: number) => void;
    onCreateIncident: () => void;
    threatStats: {
        CRITICAL: number;
        SEVERE: number;
        MODERATE: number;
        LOW: number;
    };
}

export default function Header({
    isUpsideDownMode,
    onToggleUpsideDown,
    onCreateIncident,
    threatStats,
}: HeaderProps) {
    // Real-time clock
    const currentTime = useMemo(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false });
    }, []);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            onToggleUpsideDown(x, y);
        } else {
            onToggleUpsideDown(0, 0);
        }
    };

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
                        <div
                            className={`w-3 h-3 rounded-full ${isUpsideDownMode ? 'bg-upside-down-accent animate-pulse' : 'bg-green-500'
                                }`}
                        />
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
                            ref={buttonRef}
                            onClick={handleToggle}
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

                {/* Threat Stats Bar */}
                <div className="grid grid-cols-4 gap-2">
                    <ThreatBadge
                        level="CRITICAL"
                        count={threatStats.CRITICAL}
                        isUpsideDownMode={isUpsideDownMode}
                    />
                    <ThreatBadge
                        level="SEVERE"
                        count={threatStats.SEVERE}
                        isUpsideDownMode={isUpsideDownMode}
                    />
                    <ThreatBadge
                        level="MODERATE"
                        count={threatStats.MODERATE}
                        isUpsideDownMode={isUpsideDownMode}
                    />
                    <ThreatBadge
                        level="LOW"
                        count={threatStats.LOW}
                        isUpsideDownMode={isUpsideDownMode}
                    />
                </div>
            </div>
        </header>
    );
}

interface ThreatBadgeProps {
    level: 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'LOW';
    count: number;
    isUpsideDownMode: boolean;
}

function ThreatBadge({ level, count, isUpsideDownMode }: ThreatBadgeProps) {
    const colors = {
        CRITICAL: isUpsideDownMode
            ? 'bg-pink-900/50 border-pink-600 text-pink-300'
            : 'bg-red-900/50 border-red-600 text-red-300',
        SEVERE: isUpsideDownMode
            ? 'bg-purple-900/50 border-purple-600 text-purple-300'
            : 'bg-orange-900/50 border-orange-600 text-orange-300',
        MODERATE: isUpsideDownMode
            ? 'bg-indigo-900/50 border-indigo-600 text-indigo-300'
            : 'bg-yellow-900/50 border-yellow-600 text-yellow-300',
        LOW: isUpsideDownMode
            ? 'bg-blue-900/50 border-blue-600 text-blue-300'
            : 'bg-blue-900/50 border-blue-600 text-blue-300',
    };

    return (
        <div
            className={`p-2 rounded text-center border ${colors[level]} ${level === 'CRITICAL' && count > 0 ? 'critical-pulse' : ''
                }`}
        >
            <div className="text-[10px] font-mono opacity-75">{level}</div>
            <div className="text-2xl font-bold">{count}</div>
        </div>
    );
}

