'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ViralSpreadProps {
    isActive: boolean;
    originX: number;
    originY: number;
}

export default function ViralSpread({ isActive, originX, originY }: ViralSpreadProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isActive) {
            setIsAnimating(true);
        }
    }, [isActive]);

    // Calculate radius needed to cover entire viewport from origin point
    const maxRadius = Math.sqrt(
        Math.pow(Math.max(originX, window.innerWidth - originX), 2) +
        Math.pow(Math.max(originY, window.innerHeight - originY), 2)
    );

    return (
        <AnimatePresence>
            {isAnimating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 pointer-events-none z-[100]"
                    style={{
                        background: `radial-gradient(circle at ${originX}px ${originY}px, 
                            rgba(139, 0, 139, 0.3) 0%, 
                            transparent 100%)`,
                    }}
                    onAnimationComplete={() => {
                        if (!isActive) {
                            setIsAnimating(false);
                        }
                    }}
                >
                    {/* Expanding circle effect */}
                    <motion.div
                        initial={{
                            clipPath: `circle(0px at ${originX}px ${originY}px)`
                        }}
                        animate={{
                            clipPath: `circle(${maxRadius}px at ${originX}px ${originY}px)`
                        }}
                        transition={{
                            duration: 1.2,
                            ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for organic spread
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-indigo-900/40"
                        style={{
                            mixBlendMode: 'screen',
                        }}
                    />

                    {/* Pulsing rings emanating from origin */}
                    {[0, 0.3, 0.6].map((delay, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                width: 0,
                                height: 0,
                                opacity: 0.8
                            }}
                            animate={{
                                width: maxRadius * 2,
                                height: maxRadius * 2,
                                opacity: 0
                            }}
                            transition={{
                                duration: 1.5,
                                delay,
                                ease: "easeOut"
                            }}
                            className="absolute rounded-full border-2 border-upside-down-accent"
                            style={{
                                left: originX,
                                top: originY,
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
