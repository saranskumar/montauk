'use client';

import { useEffect, useState } from 'react';

interface GlitchEffectProps {
    isActive: boolean;
}

export default function GlitchEffect({ isActive }: GlitchEffectProps) {
    const [glitchState, setGlitchState] = useState<'none' | 'glitch' | 'flash' | 'blackout'>('none');
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        // Trigger aggressive events
        const triggerEvent = () => {
            const rand = Math.random();
            if (rand < 0.4) {
                // Glitch (40%)
                setGlitchState('glitch');
                setTimeout(() => setGlitchState('none'), 100 + Math.random() * 150);
            } else if (rand < 0.7) {
                // Red Flash (30%)
                setGlitchState('flash');
                setTimeout(() => setGlitchState('none'), 50 + Math.random() * 50); // Very short flash
            } else {
                // Blackout (30%)
                setGlitchState('blackout');
                setTimeout(() => setGlitchState('none'), 100 + Math.random() * 800); // Longer blackout
            }
        };

        // Trigger shake
        const triggerShake = () => {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 200 + Math.random() * 300);
        };

        const initialDelay = setTimeout(() => {
            triggerEvent();

            // Random chaotic intervals
            const eventInterval = setInterval(() => {
                triggerEvent();
                if (Math.random() > 0.5) window.playRetroSound?.('static');
            }, Math.random() * 5000 + 3000); // 3-8 seconds (Less Frequent)

            const shakeInterval = setInterval(() => {
                triggerShake();
            }, Math.random() * 4000 + 2000); // 2-6 seconds

            return () => {
                clearInterval(eventInterval);
                clearInterval(shakeInterval);
            };
        }, 500);

        return () => clearTimeout(initialDelay);
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className={`fixed inset-0 pointer-events-none overflow-hidden ${isShaking ? 'animate-shake' : ''}`} style={{ zIndex: 9999 }}>

            {/* --- SMOKE OVERLAY (Always active) --- */}
            <div className="absolute inset-0 opacity-40 mix-blend-hard-light pointer-events-none">
                <div
                    className="absolute inset-[-50%] w-[200%] h-[200%] bg-repeat animate-smoke-slow"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30, 10, 10, 0), rgba(10, 5, 5, 0.5) 40%, rgba(0,0,0,0.8) 100%)`,
                        backgroundSize: '800px 800px',
                    }}
                />
            </div>

            {/* --- EFFECTS LAYERS --- */}

            {/* 1. RGB SPLIT GLITCH (Hard cut, no fade) */}
            {glitchState === 'glitch' && (
                <div className="absolute inset-0 z-50 mix-blend-exclusion">
                    <div className="absolute inset-0 bg-red-800 opacity-60 translate-x-2" />
                    <div className="absolute inset-0 bg-amber-900 opacity-60 -translate-x-2" />
                    {/* Horizontal Lines */}
                    <div className="absolute inset-0 flex flex-col justify-around">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="h-1 bg-black/50 w-full transform translate-x-[${Math.random() * 10}px]" />
                        ))}
                    </div>
                </div>
            )}

            {/* 2. RED FLASH (Sudden Light Burst) */}
            {glitchState === 'flash' && (
                <div className="absolute inset-0 z-[60] bg-red-600 mix-blend-color-dodge opacity-40" />
            )}

            {/* 3. BLACKOUT (Power Failure) */}
            {glitchState === 'blackout' && (
                <div className="absolute inset-0 z-[70] bg-black" />
            )}

            {/* --- PERSISTENT ATMOSPHERE --- */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(20, 5, 5, 0.6) 80%, rgba(0, 0, 0, 0.9) 100%)',
                }}
            />

            <style jsx>{`
                @keyframes smoke-slow {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    100% { transform: translate(-50px, -50px) rotate(5deg); }
                }
                @keyframes shake {
                    0% { transform: translate(0px, 0px) rotate(0deg); }
                    25% { transform: translate(10px, -10px) rotate(-2deg); }
                    50% { transform: translate(-10px, 10px) rotate(2deg); }
                    75% { transform: translate(5px, 5px) rotate(0deg); }
                    100% { transform: translate(0px, 0px) rotate(0deg); }
                }
                .animate-shake {
                    animation: shake 0.1s steps(2) infinite; /* Violent, jerky shake */
                }
                .animate-smoke-slow {
                    animation: smoke-slow 20s infinite alternate linear;
                }
            `}</style>
        </div>
    );
}
