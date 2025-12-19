interface SignalBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
    isRiftMode: boolean;
}

export default function SignalBar({ label, value, max, color, isRiftMode }: SignalBarProps) {
    const percentage = (value / max) * 100;

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
                <span className={`font-mono uppercase tracking-wider ${isRiftMode ? 'text-rift-accent' : 'text-montauk-accent'
                    }`}>
                    {label}
                </span>
                <span className={`font-bold ${isRiftMode ? 'text-rift-glow' : 'text-montauk-text-primary'}`}>
                    {Math.round(value)}/{max}
                </span>
            </div>
            <div className={`h-6 rounded border-2 overflow-hidden ${isRiftMode ? 'bg-rift-bg border-rift-border' : 'bg-montauk-bg border-montauk-border'
                }`}>
                <div
                    className={`h-full transition-all duration-300 ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

