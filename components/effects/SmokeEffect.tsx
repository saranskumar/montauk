'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Smoke } from 'react-smoke';
import * as THREE from 'three';

interface SmokeEffectProps {
    performanceTier?: 'high' | 'medium' | 'low';
}

export default function SmokeEffect({ performanceTier = 'high' }: SmokeEffectProps) {
    // Dark red-black smoke color for Upside Down
    const smokeColor = useMemo(() => new THREE.Color(0x2b0014), []);
    const bgColor = useMemo(() => new THREE.Color(0x000000), []);

    // Adjust density based on performance
    const density = useMemo(() => {
        switch (performanceTier) {
            case 'high': return 80;
            case 'medium': return 50;
            case 'low': return 30;
            default: return 50;
        }
    }, [performanceTier]);

    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <Canvas
                camera={{ fov: 60, position: [0, 0, 500], far: 6000 }}
                scene={{ background: bgColor }}
                gl={{ alpha: true, antialias: false }}
            >
                <Suspense fallback={null}>
                    <Smoke
                        color={smokeColor}
                        density={density}
                        enableRotation={true}
                        rotation={[0, 0, 0.1]}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
