'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import heavy 3D components
const SmokeEffect = dynamic(() => import('./SmokeEffect'), { ssr: false });
const ParticleDisintegration = dynamic(() => import('./ParticleDisintegration'), { ssr: false });
const NoiseDistortion = dynamic(() => import('./NoiseDistortion'), { ssr: false });

interface UpsideDownEffectsProps {
    isActive: boolean;
}

export default function UpsideDownEffects({ isActive }: UpsideDownEffectsProps) {
    const [performanceTier, setPerformanceTier] = useState<'high' | 'medium' | 'low'>('high');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Simple performance detection
        const detectPerformance = () => {
            // Check for mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

            // Check for low-end device indicators
            const cores = navigator.hardwareConcurrency || 4;
            const memory = (navigator as any).deviceMemory || 4;

            if (isMobile || cores < 4 || memory < 4) {
                setPerformanceTier('medium');
            } else if (cores >= 8 && memory >= 8) {
                setPerformanceTier('high');
            } else {
                setPerformanceTier('medium');
            }
        };

        detectPerformance();
    }, []);

    if (!isActive || !mounted) return null;

    return (
        <>
            {/* Smoke Effect (Three.js) */}
            <SmokeEffect performanceTier={performanceTier} />

            {/* Floating Particles */}
            <ParticleDisintegration performanceTier={performanceTier} />

            {/* Noise Distortion Overlay */}
            <NoiseDistortion intensity={0.03} speed={0.5} />
        </>
    );
}
