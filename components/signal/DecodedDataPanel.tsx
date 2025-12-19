'use client';

import { useMemo } from 'react';

interface DecodedDataPanelProps {
    coherence: number;
    isUpsideDownMode: boolean;
}

const MESSAGES = [
    {
        location: 'CAMP HERO',
        eventType: 'TEMPORAL RIFT',
        timeOffset: '-48 HRS',
    },
    {
        location: 'MONTAUK POINT',
        eventType: 'DIMENSIONAL BREACH',
        timeOffset: '+12 HRS',
    },
    {
        location: 'UNDERGROUND LAB',
        eventType: 'PSYCHIC ANOMALY',
        timeOffset: 'REALTIME',
    },
];

export default function DecodedDataPanel({ coherence, isUpsideDownMode }: DecodedDataPanelProps) {
    // Select message based on coherence level
    const messageIndex = useMemo(() => {
        return Math.floor((coherence / 100) * MESSAGES.length) % MESSAGES.length;
    }, [coherence]);

    const message = MESSAGES[messageIndex];

    // Resolve character based on coherence
    const resolveText = (text: string) => {
        return text.split('').map((char, index) => {
            const threshold = (index / text.length) * 100;
            return coherence > threshold ? char : '█';
        }).join('');
    };

    return (
        <div className={`p-4 rounded-lg border-2 font-mono text-sm ${isUpsideDownMode
                ? 'bg-upside-down-bg/50 border-upside-down-border text-upside-down-glow'
                : 'bg-hawkins-bg-secondary/50 border-hawkins-border text-hawkins-text-primary'
            } ${coherence < 30 ? 'animate-glitch' : ''}`}>
            <div className={`text-xs uppercase tracking-wider mb-3 ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                }`}>
                [SIGNAL INTERCEPT]
            </div>

            <div className="space-y-2">
                <div>
                    <span className="opacity-60">COHERENCE: </span>
                    <span className={coherence >= 80 ? 'text-green-400' : coherence >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                        {Math.round(coherence)}%
                    </span>
                </div>

                <div>
                    <span className="opacity-60">LOCATION: </span>
                    <span>{resolveText(message.location)}</span>
                </div>

                <div>
                    <span className="opacity-60">EVENT TYPE: </span>
                    <span>{resolveText(message.eventType)}</span>
                </div>

                <div>
                    <span className="opacity-60">TIME OFFSET: </span>
                    <span>{resolveText(message.timeOffset)}</span>
                </div>
            </div>

            {coherence >= 80 && (
                <div className={`mt-3 pt-3 border-t text-xs ${isUpsideDownMode ? 'border-upside-down-border text-green-400' : 'border-hawkins-border text-green-500'
                    }`}>
                    ✓ SIGNAL DECODED SUCCESSFULLY
                </div>
            )}
        </div>
    );
}

