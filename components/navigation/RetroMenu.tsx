'use client';

import { useEffect } from 'react';

interface RetroMenuProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isUpsideDownMode: boolean;
    onCmdClick?: () => void;
}

export default function RetroMenu({ activeTab, onTabChange, isUpsideDownMode, onCmdClick }: RetroMenuProps) {

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'F1':
                    e.preventDefault();
                    onTabChange('INCIDENTS');
                    break;
                case 'F2':
                    e.preventDefault();
                    onTabChange('LIVE_USERS');
                    break;
                case 'F3':
                    e.preventDefault();
                    onTabChange('MAPS_BEACON');
                    break;
                case 'F4':
                    e.preventDefault();
                    if (onCmdClick) onCmdClick();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onTabChange, onCmdClick]);

    const menuItems = [
        { key: 'F1', label: 'INCIDENTS', id: 'INCIDENTS' },
        { key: 'F2', label: 'LIVE USERS', id: 'LIVE_USERS' },
        { key: 'F3', label: 'MAPS BEACON', id: 'MAPS_BEACON' },
        { key: 'F4', label: 'CMD', id: 'CMD' },
    ];

    const textColor = isUpsideDownMode ? 'text-red-500' : 'text-amber-500';
    const bgColor = isUpsideDownMode ? 'bg-red-500' : 'bg-amber-500';
    const borderColor = isUpsideDownMode ? 'border-red-900' : 'border-amber-900';

    return (
        <div className={`w-full border-b-2 ${borderColor} bg-black/80 backdrop-blur-sm p-1`}>
            <div className="max-w-7xl mx-auto flex flex-wrap gap-2 md:gap-6 px-12">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`
                group flex items-center gap-2 px-3 py-1 font-mono text-sm transition-all
                border border-transparent hover:border-opacity-50
                ${isActive
                                    ? `${bgColor} text-black font-bold`
                                    : `${textColor} hover:bg-white/5`
                                }
              `}
                        >
                            <span className={`opacity-70 ${isActive ? 'text-black' : textColor}`}>
                                [{item.key}]
                            </span>
                            <span className="uppercase tracking-wider">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
