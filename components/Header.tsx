'use client';

import { useMemo } from 'react';
import { Clock, Radio, Zap } from 'lucide-react';

interface HeaderProps {
    isRiftMode: boolean;
    onToggleRift: () => void;
    onCreateIncident: () => void;
    threatStats: {
        CRITICAL: number;
        SEVERE: number;
        MODERATE: number;
        LOW: number;
    };
}

export default function Header({
    isRiftMode,
    onToggleRift,
    onCreateIncident,
    threatStats,
}: HeaderProps) {
    // Real-time clock
    const currentTime = useMemo(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false });
    }, []);

    return (
        <header
            className={`border-b-2 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-500 ${isRiftMode
                    ? 'border-rift-border bg-rift-bg/95'
                    : 'border-montauk-border bg-montauk-bg/95'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Top Row */}
                <div className="flex items-center justify-between mb-4">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-3 h-3 rounded-full ${isRiftMode ? 'bg-rift-accent animate-pulse' : 'bg-green-500'
                                }`}
                        />
                        <div>
                            <h1
                                className={`text-xl font-bold tracking-[0.2em] uppercase ${isRiftMode ? 'text-rift-accent glitch-text' : 'text-montauk-accent'
                                    }`}
                                data-text="MONTAUK COMMAND"
                            >
                                MONTAUK COMMAND
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
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-mono ${isRiftMode
                                    ? 'bg-rift-bg border border-rift-border text-rift-accent'
                                    : 'bg-montauk-bg-secondary border border-montauk-border text-montauk-text-primary'
                                }`}
                        >
                            <Clock className="w-4 h-4" />
                            <span className={isRiftMode ? 'animate-glitch' : ''}>{currentTime}</span>
                        </div>

                        {/* Rift Mode Toggle */}
                        <button
                            onClick={onToggleRift}
                            className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm uppercase tracking-wider transition-all ${isRiftMode
                                    ? 'bg-rift-accent text-black hover:bg-rift-glow'
                                    : 'bg-montauk-bg-secondary border border-montauk-border text-montauk-text-primary hover:border-montauk-accent'
                                }`}
                        >
                            <Radio className="w-4 h-4" />
                            {isRiftMode ? 'EXIT RIFT' : 'RIFT MODE'}
                        </button>

                        {/* Create Incident */}
                        <button
                            onClick={onCreateIncident}
                            className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm uppercase tracking-wider transition-all ${isRiftMode
                                    ? 'bg-rift-danger text-white hover:bg-pink-400'
                                    : 'bg-montauk-accent text-black hover:bg-montauk-accent-bright'
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
                        isRiftMode={isRiftMode}
                    />
                    <ThreatBadge
                        level="SEVERE"
                        count={threatStats.SEVERE}
                        isRiftMode={isRiftMode}
                    />
                    <ThreatBadge
                        level="MODERATE"
                        count={threatStats.MODERATE}
                        isRiftMode={isRiftMode}
                    />
                    <ThreatBadge
                        level="LOW"
                        count={threatStats.LOW}
                        isRiftMode={isRiftMode}
                    />
                </div>
            </div>
        </header>
    );
}

interface ThreatBadgeProps {
    level: 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'LOW';
    count: number;
    isRiftMode: boolean;
}

function ThreatBadge({ level, count, isRiftMode }: ThreatBadgeProps) {
    const colors = {
        CRITICAL: isRiftMode
            ? 'bg-pink-900/50 border-pink-600 text-pink-300'
            : 'bg-red-900/50 border-red-600 text-red-300',
        SEVERE: isRiftMode
            ? 'bg-purple-900/50 border-purple-600 text-purple-300'
            : 'bg-orange-900/50 border-orange-600 text-orange-300',
        MODERATE: isRiftMode
            ? 'bg-indigo-900/50 border-indigo-600 text-indigo-300'
            : 'bg-yellow-900/50 border-yellow-600 text-yellow-300',
        LOW: isRiftMode
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

