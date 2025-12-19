import type { SignalStatus } from '@/types/signal';

interface CoherenceDisplayProps {
    coherence: number;
    status: SignalStatus;
    isRiftMode: boolean;
}

export default function CoherenceDisplay({ coherence, status, isRiftMode }: CoherenceDisplayProps) {
    const getStatusColor = () => {
        switch (status) {
            case 'SEARCHING':
                return isRiftMode ? 'text-yellow-400' : 'text-yellow-500';
            case 'PATTERN_DETECTED':
                return isRiftMode ? 'text-blue-400' : 'text-blue-500';
            case 'SIGNAL_LOCK':
                return isRiftMode ? 'text-green-400' : 'text-green-500';
            case 'SIGNAL_LOST':
                return isRiftMode ? 'text-red-400' : 'text-red-500';
        }
    };

    const getStatusText = () => {
        return status.replace('_', ' ');
    };

    return (
        <div className={`text-center p-6 rounded-lg border-2 ${isRiftMode ? 'bg-rift-bg/50 border-rift-border' : 'bg-montauk-bg-secondary/50 border-montauk-border'
            } ${status === 'SIGNAL_LOCK' ? 'animate-pulse-glow' : ''}`}>
            <div className={`text-6xl font-bold font-mono mb-2 ${isRiftMode ? 'text-rift-glow' : 'text-montauk-text-primary'
                }`}>
                {Math.round(coherence)}%
            </div>
            <div className={`text-xs uppercase tracking-widest mb-1 ${isRiftMode ? 'text-rift-accent/60' : 'text-montauk-text-dim'
                }`}>
                Coherence
            </div>
            <div className={`text-sm font-bold uppercase tracking-wider ${getStatusColor()}`}>
                {getStatusText()}
            </div>
        </div>
    );
}

