'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SectorMapProps {
    isUpsideDownMode: boolean;
}

interface PointOfInterest {
    id: string;
    x: number;
    y: number;
    label: string;
    type: 'FRIENDLY' | 'HOSTILE' | 'UNKNOWN' | 'GATE';
    status?: string;
}

export default function SectorMap({ isUpsideDownMode }: SectorMapProps) {
    const [hoveredPoint, setHoveredPoint] = useState<PointOfInterest | null>(null);
    const [radarRotation, setRadarRotation] = useState(0);

    // Theme colors
    const primaryColor = isUpsideDownMode ? 'text-red-500' : 'text-amber-500';
    const borderColor = isUpsideDownMode ? 'border-red-900' : 'border-amber-900';
    const bgColor = isUpsideDownMode ? 'bg-red-950/10' : 'bg-amber-950/10';
    const gridColor = isUpsideDownMode ? 'border-red-900/30' : 'border-amber-900/30';

    // Rotation animation
    useEffect(() => {
        const interval = setInterval(() => {
            setRadarRotation(prev => (prev + 2) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const points: PointOfInterest[] = [
        { id: 'SEC-4', x: 50, y: 50, label: 'HAWKINS LAB', type: 'FRIENDLY', status: 'OPERATIONAL' },
        { id: 'GT-1', x: 45, y: 52, label: 'THE GATE', type: 'GATE', status: isUpsideDownMode ? 'OPEN (CRITICAL)' : 'SEALED' },
        { id: 'T-12', x: 20, y: 30, label: 'SUBSTATION', type: 'FRIENDLY', status: 'ACTIVE' },
        { id: 'UNK-1', x: 80, y: 20, label: 'UNKNOWN SIG', type: 'UNKNOWN', status: 'MOVING' },
        { id: 'HST-1', x: 60, y: 80, label: 'DEMOGORGON', type: 'HOSTILE', status: 'HUNTING' },
    ];

    if (!isUpsideDownMode) {
        // Filter out some entities in normal mode
        points.splice(4, 1); // Remove Demogorgon
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            {/* Map Display */}
            <div className={`lg:col-span-2 border-2 ${borderColor} ${bgColor} relative overflow-hidden`}>
                {/* Labels */}
                <div className={`absolute top-2 left-2 font-mono text-xs ${primaryColor} z-10`}>
                    SECTOR: HAWKINS (GRID 44-B)
                </div>
                <div className={`absolute bottom-2 right-2 font-mono text-xs ${primaryColor} z-10`}>
                    SCALE: 1:5000
                </div>

                {/* Grid */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none">
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={i} className={`border ${gridColor}`} />
                    ))}
                </div>

                {/* Points */}
                {points.map(point => (
                    <motion.div
                        key={point.id}
                        className="absolute w-3 h-3 -ml-1.5 -mt-1.5 cursor-pointer z-20 group"
                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                        onMouseEnter={() => setHoveredPoint(point)}
                        onMouseLeave={() => setHoveredPoint(null)}
                    >
                        <div className={`w-full h-full rounded-full ${point.type === 'FRIENDLY' ? 'bg-amber-400' :
                            point.type === 'HOSTILE' ? 'bg-red-500' :
                                point.type === 'GATE' ? 'bg-purple-500 animate-pulse' :
                                    'bg-amber-500'
                            }`} />
                        {/* Hover Ring */}
                        <div className={`absolute inset-0 rounded-full scale-150 border opacity-0 group-hover:opacity-100 transition-opacity ${point.type === 'HOSTILE' ? 'border-red-500' : 'border-white'
                            }`} />
                    </motion.div>
                ))}

                {/* Central Crosshair */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 border-t border-l border-white/20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 border-b border-r border-white/20 pointer-events-none" />

            </div>

            {/* Info Panel */}
            <div className={`border-2 ${borderColor} ${bgColor} flex flex-col p-4 font-mono text-xs ${primaryColor}`}>
                <div className="mb-4 pb-2 border-b border-gray-700/50">
                    TARGET INFORMATION
                </div>

                {hoveredPoint ? (
                    <div className="space-y-4 animate-fadeIn">
                        <div>
                            <div className="opacity-50 mb-1">DESIGNATION</div>
                            <div className="text-lg font-bold">{hoveredPoint.label}</div>
                        </div>
                        <div>
                            <div className="opacity-50 mb-1">COORDINATES</div>
                            <div>{hoveredPoint.x.toFixed(2)}, {hoveredPoint.y.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="opacity-50 mb-1">CLASSIFICATION</div>
                            <div className={`${hoveredPoint.type === 'HOSTILE' ? 'text-red-500 blink' :
                                hoveredPoint.type === 'FRIENDLY' ? 'text-green-400' : 'text-amber-400'
                                }`}>
                                {hoveredPoint.type}
                            </div>
                        </div>
                        <div>
                            <div className="opacity-50 mb-1">STATUS</div>
                            <div>{hoveredPoint.status}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-50 text-center gap-2">
                        <span className="text-2xl animate-pulse">⌖</span>
                        <div>SELECT TARGET ON GRID</div>
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-700/50 text-[10px] opacity-60">
                    RADAR: ONLINE
                    <br />
                    RANGE: 15KM
                    <br />
                    INTERFERENCE: {isUpsideDownMode ? 'HIGH (DIMENSIONAL BLEED)' : 'NONE'}
                </div>
            </div>
        </div>
    );
}
