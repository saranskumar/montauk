'use client';

interface TabNavigationProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    isUpsideDownMode: boolean;
}

export default function TabNavigation({ tabs, activeTab, onTabChange, isUpsideDownMode }: TabNavigationProps) {
    return (
        <div className={`flex gap-1 border-b-2 ${isUpsideDownMode ? 'border-upside-down-border' : 'border-hawkins-border'
            }`}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-4 py-2 font-mono text-sm uppercase tracking-wider transition-all ${activeTab === tab
                            ? isUpsideDownMode
                                ? 'bg-upside-down-accent text-black border-t-2 border-x-2 border-upside-down-border'
                                : 'bg-hawkins-accent text-black border-t-2 border-x-2 border-hawkins-border'
                            : isUpsideDownMode
                                ? 'text-upside-down-text hover:bg-upside-down-bg-secondary'
                                : 'text-hawkins-text-dim hover:bg-hawkins-bg-secondary'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
