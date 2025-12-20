'use client';

import { Activity } from 'lucide-react';

interface ThreatStats {
    CRITICAL: number;
    SEVERE: number;
    MODERATE: number;
    LOW: number;
}

interface MiniThreatStatsProps {
    threatStats: ThreatStats;
    isUpsideDownMode: boolean;
}

export default function MiniThreatStats({ threatStats, isUpsideDownMode }: MiniThreatStatsProps) {
    const totalThreats = threatStats.CRITICAL + threatStats.SEVERE + threatStats.MODERATE + threatStats.LOW;

    // Theme
    const borderColor = isUpsideDownMode ? 'border-red-900' : 'border-amber-900';
    const bgColor = 'bg-black/90';
    const textColor = isUpsideDownMode ? 'text-red-500' : 'text-amber-500';
    const labelColor = isUpsideDownMode ? 'text-red-400' : 'text-amber-400';

    return (
        <div className={`fixed bottom-48 right-4 z-40 w-64 h-32 ${bgColor} border-2 ${borderColor} shadow-lg backdrop-blur flex flex-col`}>
            {/* Header */}
            <div className={`flex justify-between items-center px-2 py-1 border-b ${borderColor} bg-black/50`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${textColor} flex items-center gap-2`}>
                    <Activity className="w-3 h-3" />
                    Threat Matrix
                </span>
                <span className={`text-[10px] font-mono font-bold ${labelColor}`}>
                    TOTAL: {totalThreats}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 p-2 grid grid-cols-2 gap-2">
                <StatBox
                    label="CRITICAL"
                    value={threatStats.CRITICAL}
                    color={isUpsideDownMode ? 'text-pink-500' : 'text-red-500'}
                    borderColor={isUpsideDownMode ? 'border-pink-900' : 'border-red-900'}
                    pulse={threatStats.CRITICAL > 0}
                />
                <StatBox
                    label="SEVERE"
                    value={threatStats.SEVERE}
                    color={isUpsideDownMode ? 'text-purple-500' : 'text-orange-500'}
                    borderColor={isUpsideDownMode ? 'border-purple-900' : 'border-orange-900'}
                />
                <StatBox
                    label="MODERATE"
                    value={threatStats.MODERATE}
                    color={isUpsideDownMode ? 'text-indigo-500' : 'text-yellow-500'}
                    borderColor={isUpsideDownMode ? 'border-indigo-900' : 'border-yellow-900'}
                />
                <StatBox
                    label="LOW"
                    value={threatStats.LOW}
                    color={isUpsideDownMode ? 'text-yellow-600' : 'text-yellow-600'}
                    borderColor={isUpsideDownMode ? 'border-yellow-900' : 'border-yellow-900'}
                />
            </div>

            {/* Footer */}
            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-gray-500">
                SC-892 // MONITORING
            </div>
        </div>
    );
}

function StatBox({ label, value, color, borderColor, pulse = false }: { label: string, value: number, color: string, borderColor: string, pulse?: boolean }) {
    return (
        <div className={`border ${borderColor} bg-black/30 flex flex-col items-center justify-center relative overflow-hidden`}>
            {pulse && <div className={`absolute inset-0 bg-current opacity-10 animate-pulse ${color}`}></div>}
            <span className={`text-[8px] font-mono uppercase opacity-70 ${color}`}>{label}</span>
            <span className={`text-xl font-bold font-mono leading-none ${color}`}>{value}</span>
        </div>
    );
}
