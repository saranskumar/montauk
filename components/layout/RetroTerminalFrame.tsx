'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RetroTerminalFrameProps {
    children: ReactNode;
    isUpsideDownMode: boolean;
    className?: string;
    stage?: string; // Optional stage name to display
}

export default function RetroTerminalFrame({
    children,
    isUpsideDownMode,
    className = '',
    stage = 'ACTIVE_MONITORING'
}: RetroTerminalFrameProps) {
    // Colors based on mode
    const accentColor = isUpsideDownMode ? 'text-red-500' : 'text-amber-500';
    const borderColor = isUpsideDownMode ? 'border-red-900/50' : 'border-amber-600/30';
    const bgColor = isUpsideDownMode
        ? 'bg-red-950/20'
        : 'bg-amber-950/20';

    return (
        <div
            className={`fixed inset-0 bg-black overflow-hidden ${className}`}
            style={{
                background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
            }}
        >
            {/* CRT Effects */}
            <div className="crt-overlay pointer-events-none z-50" />
            <div className="crt-glow pointer-events-none z-50" />
            <div className="film-grain pointer-events-none z-40 opacity-50" />

            {/* Main Container */}
            <div className="relative w-full h-full flex flex-col p-2 sm:p-4 md:p-6">

                {/* Monitor Frame */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`relative flex-1 border-2 ${borderColor} rounded bg-black/90 overflow-hidden flex flex-col`}
                    style={{
                        boxShadow: isUpsideDownMode
                            ? 'inset 0 0 100px rgba(0,0,0,1), 0 0 20px rgba(220, 38, 38, 0.2)'
                            : 'inset 0 0 100px rgba(0,0,0,1), 0 0 20px rgba(217, 119, 6, 0.2)',
                    }}
                >
                    {/* Corner Brackets */}
                    <div className={`absolute top-2 left-2 ${accentColor} text-2xl font-mono leading-none z-20`}>┌</div>
                    <div className={`absolute top-2 right-2 ${accentColor} text-2xl font-mono leading-none z-20`}>┐</div>
                    <div className={`absolute bottom-2 left-2 ${accentColor} text-2xl font-mono leading-none z-20`}>└</div>
                    <div className={`absolute bottom-2 right-2 ${accentColor} text-2xl font-mono leading-none z-20`}>┘</div>

                    {/* Top Status Bar */}
                    <div className={`relative z-20 border-b ${borderColor} ${bgColor} px-6 py-2 flex justify-between items-center text-xs font-mono shrink-0`}>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                                <div className={`w-3 h-3 rounded-full ${isUpsideDownMode ? 'bg-red-600' : 'bg-red-500'} animate-pulse`} />
                                <div className={`w-3 h-3 rounded-full ${isUpsideDownMode ? 'bg-red-800' : 'bg-amber-500'}`} />
                                <div className={`w-3 h-3 rounded-full ${isUpsideDownMode ? 'bg-red-900' : 'bg-green-500'}`} />
                            </div>
                            <span className={accentColor}>HAWKINS_MAINFRAME_v1.984</span>
                        </div>
                        <div className={`${isUpsideDownMode ? 'text-red-400' : 'text-amber-500/50'} uppercase tracking-wider`}>
                            {isUpsideDownMode ? '⚠ UPSIDE DOWN DETECTED ⚠' : stage}
                        </div>
                    </div>

                    {/* Content Area - Scrollable */}
                    <div className="flex-1 relative overflow-hidden">
                        <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900/50 scrollbar-track-transparent">
                            {children}
                        </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className={`relative z-20 border-t ${borderColor} ${bgColor} px-6 py-2 flex justify-between items-center text-[10px] font-mono shrink-0`}>
                        <div className={isUpsideDownMode ? 'text-red-400' : 'text-amber-500/50'}>
                            <div>HAWKINS NATIONAL LABORATORY</div>
                            <div>DEPT. OF ENERGY • CLEARANCE: ULTRA</div>
                        </div>
                        <div className={`text-right ${accentColor}`}>
                            <div>TERMINAL_ID: HNL-001</div>
                            <div>{isUpsideDownMode ? 'ERR: REALITY_FRACTURE' : 'AUTHORIZED ACCESS ONLY'}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Power LED - Outside Frame */}
                <div className="absolute bottom-6 left-8 flex items-center gap-2 z-50 pointer-events-none">
                    <div
                        className={`w-3 h-3 rounded-full ${isUpsideDownMode ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}
                        style={{ boxShadow: isUpsideDownMode ? '0 0 10px rgba(239, 68, 68, 0.8)' : '0 0 10px rgba(34, 197, 94, 0.8)' }}
                    />
                    <span className="text-xs font-mono text-gray-500">PWR</span>
                </div>

            </div>
        </div>
    );
}
