'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
    onComplete: () => void;
}

const bootMessages = [
    { text: '> INITIALIZING MONTAUK COMMAND SYSTEM...', delay: 0 },
    { text: '> LOADING CLASSIFIED PROTOCOLS...', delay: 400 },
    { text: '> ESTABLISHING SECURE CONNECTION...', delay: 800 },
    { text: '> DECRYPTING TEMPORAL DATABASE...', delay: 1200 },
    { text: '> CALIBRATING PSYCHIC SENSORS...', delay: 1600 },
    { text: '> VERIFYING CLEARANCE LEVEL: ULTRA...', delay: 2000 },
    { text: '> SYSTEM READY', delay: 2400 },
];

const asciiLogo = `
███╗   ███╗ ██████╗ ███╗   ██╗████████╗ █████╗ ██╗   ██╗██╗  ██╗
████╗ ████║██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██║   ██║██║ ██╔╝
██╔████╔██║██║   ██║██╔██╗ ██║   ██║   ███████║██║   ██║█████╔╝ 
██║╚██╔╝██║██║   ██║██║╚██╗██║   ██║   ██╔══██║██║   ██║██╔═██╗ 
██║ ╚═╝ ██║╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝██║  ██╗
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
`;

export default function BootSequence({ onComplete }: BootSequenceProps) {
    const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
    const [showLogo, setShowLogo] = useState(false);
    const [progress, setProgress] = useState(0);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        // Show messages one by one
        bootMessages.forEach((msg, index) => {
            setTimeout(() => {
                setVisibleMessages((prev) => [...prev, index]);
            }, msg.delay);
        });

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        // Show logo
        setTimeout(() => setShowLogo(true), 2800);

        // Complete
        setTimeout(() => {
            setComplete(true);
            setTimeout(onComplete, 500);
        }, 4000);

        return () => clearInterval(progressInterval);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!complete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 bg-montauk-bg z-50 flex flex-col items-center justify-center p-8 overflow-hidden"
                >
                    {/* Scanlines overlay */}
                    <div className="crt-overlay" />
                    <div className="crt-glow" />

                    {/* Top classified stamp */}
                    <motion.div
                        initial={{ opacity: 0, scale: 2 }}
                        animate={{ opacity: 0.1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-8 right-8 text-red-600 text-4xl font-bold rotate-12 border-4 border-red-600 px-4 py-2"
                    >
                        CLASSIFIED
                    </motion.div>

                    {/* Main content container */}
                    <div className="max-w-4xl w-full">
                        {/* ASCII Logo */}
                        <AnimatePresence>
                            {showLogo && (
                                <motion.pre
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-montauk-accent text-[8px] sm:text-[10px] md:text-xs leading-tight mb-8 text-center overflow-hidden"
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    {asciiLogo}
                                </motion.pre>
                            )}
                        </AnimatePresence>

                        {/* Boot messages */}
                        <div className="space-y-2 mb-8 font-mono text-sm">
                            {bootMessages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: visibleMessages.includes(index) ? 1 : 0,
                                        x: visibleMessages.includes(index) ? 0 : -20,
                                    }}
                                    className={`${index === bootMessages.length - 1
                                            ? 'text-green-400'
                                            : 'text-montauk-text-primary'
                                        }`}
                                >
                                    {msg.text}
                                    {index === bootMessages.length - 1 && visibleMessages.includes(index) && (
                                        <span className="animate-blink ml-1">█</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2 bg-montauk-bg-secondary border border-montauk-border rounded overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-montauk-accent to-montauk-accent-bright"
                                style={{
                                    boxShadow: '0 0 10px rgba(217, 119, 6, 0.5)',
                                }}
                            />
                        </div>

                        {/* Progress percentage */}
                        <div className="mt-2 text-center text-montauk-text-dim text-xs">
                            LOADING SYSTEM: {progress}%
                        </div>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-8 left-8 text-montauk-text-dim text-xs">
                        <div>MONTAUK PROJECT v2.0.1984</div>
                        <div>DEFENSE ADVANCED RESEARCH AGENCY</div>
                    </div>

                    <div className="absolute bottom-8 right-8 text-montauk-text-dim text-xs text-right">
                        <div>SECURITY LEVEL: ULTRA</div>
                        <div>AUTHORIZED PERSONNEL ONLY</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

