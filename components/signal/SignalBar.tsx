interface SignalBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
    isUpsideDownMode: boolean;
}

export default function SignalBar({ label, value, max, color, isUpsideDownMode }: SignalBarProps) {
    const percentage = (value / max) * 100;

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
                <span className={`font-mono uppercase tracking-wider ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                    }`}>
                    {label}
                </span>
                <span className={`font-bold ${isUpsideDownMode ? 'text-upside-down-glow' : 'text-hawkins-text-primary'}`}>
                    {Math.round(value)}/{max}
                </span>
            </div>
            <div className={`h-6 rounded border-2 overflow-hidden ${isUpsideDownMode ? 'bg-upside-down-bg border-upside-down-border' : 'bg-hawkins-bg border-hawkins-border'
                }`}>
                <div
                    className={`h-full transition-all duration-300 ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

