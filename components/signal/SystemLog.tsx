'use client';

import { useEffect, useRef } from 'react';
import type { LogEntry } from '@/types/signal';

interface SystemLogProps {
    logs: LogEntry[];
    isUpsideDownMode: boolean;
}

export default function SystemLog({ logs, isUpsideDownMode }: SystemLogProps) {
    const logEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getLogColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'success':
                return 'text-green-400';
            case 'warning':
                return 'text-yellow-400';
            case 'error':
                return 'text-red-400';
            default:
                return isUpsideDownMode ? 'text-upside-down-glow' : 'text-hawkins-text-primary';
        }
    };

    return (
        <div className={`p-4 rounded-lg border-2 h-48 overflow-y-auto font-mono text-xs ${isUpsideDownMode
            ? 'bg-upside-down-bg/50 border-upside-down-border'
            : 'bg-hawkins-bg-secondary/50 border-hawkins-border'
            }`}>
            <div className={`text-[10px] uppercase tracking-wider mb-2 ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                }`}>
                SYSTEM LOG
            </div>

            <div className="space-y-1">
                {logs.map((log) => (
                    <div key={log.id} className={`${getLogColor(log.type)}`}>
                        <span className="opacity-60">[{log.timestamp}]</span> {log.message}
                    </div>
                ))}
                <div ref={logEndRef} />
            </div>

            {logs.length === 0 && (
                <div className="text-center opacity-40 mt-8">
                    No log entries
                </div>
            )}
        </div>
    );
}

