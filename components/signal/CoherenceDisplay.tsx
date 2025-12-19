import type { SignalStatus } from '@/types/signal';

interface CoherenceDisplayProps {
    coherence: number;
    status: SignalStatus;
    isUpsideDownMode: boolean;
}

export default function CoherenceDisplay({ coherence, status, isUpsideDownMode }: CoherenceDisplayProps) {
    const getStatusColor = () => {
        switch (status) {
            case 'SEARCHING':
                return isUpsideDownMode ? 'text-yellow-400' : 'text-yellow-500';
            case 'PATTERN_DETECTED':
                return isUpsideDownMode ? 'text-blue-400' : 'text-blue-500';
            case 'SIGNAL_LOCK':
                return isUpsideDownMode ? 'text-green-400' : 'text-green-500';
            case 'SIGNAL_LOST':
                return isUpsideDownMode ? 'text-red-400' : 'text-red-500';
        }
    };

    const getStatusText = () => {
        return status.replace('_', ' ');
    };

    return (
        <div className={`text-center p-6 rounded-lg border-2 ${isUpsideDownMode ? 'bg-upside-down-bg/50 border-upside-down-border' : 'bg-hawkins-bg-secondary/50 border-hawkins-border'
            } ${status === 'SIGNAL_LOCK' ? 'animate-pulse-glow' : ''}`}>
            <div className={`text-6xl font-bold font-mono mb-2 ${isUpsideDownMode ? 'text-upside-down-glow' : 'text-hawkins-text-primary'
                }`}>
                {Math.round(coherence)}%
            </div>
            <div className={`text-xs uppercase tracking-widest mb-1 ${isUpsideDownMode ? 'text-upside-down-accent/60' : 'text-hawkins-text-dim'
                }`}>
                Coherence
            </div>
            <div className={`text-sm font-bold uppercase tracking-wider ${getStatusColor()}`}>
                {getStatusText()}
            </div>
        </div>
    );
}

