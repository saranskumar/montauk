'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Radio, RotateCcw } from 'lucide-react';

// Hooks
import { useSignalEngine } from '@/hooks/signal/useSignalEngine';
import { useAudioManager } from '@/hooks/signal/useAudioManager';

// Components
import SignalBar from './SignalBar';
import CoherenceDisplay from './CoherenceDisplay';
import ControlDial from './ControlDial';
import DecodedDataPanel from './DecodedDataPanel';
import SystemLog from './SystemLog';
import StaticOverlay from './effects/StaticOverlay';

interface SignalCalibratorProps {
    isUpsideDownMode: boolean;
    onClose: () => void;
    onComplete?: () => void;
}

export default function SignalCalibrator({ isUpsideDownMode, onClose, onComplete }: SignalCalibratorProps) {
    const { state, controls, logs } = useSignalEngine();
    const [audioEnabled, setAudioEnabled] = useState(false);
    useAudioManager(state.coherence, state.noiseLevel, state.status, audioEnabled);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    controls.setFrequency(Math.min(100, state.frequency + 5));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    controls.setFrequency(Math.max(0, state.frequency - 5));
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    controls.setPhase(Math.max(0, state.phase - 5));
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    controls.setPhase(Math.min(100, state.phase + 5));
                    break;
                case 'm':
                case 'M':
                    setAudioEnabled((prev) => !prev);
                    break;
                case 'Escape':
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.frequency, state.phase, controls, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >


            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{
                    scale: 1,
                    y: 0,
                    // Flicker effect when coherence is low
                    opacity: state.coherence < 30 ? [1, 0.95, 1, 0.97, 1] : 1,
                }}
                transition={{
                    scale: { type: 'spring', damping: 20 },
                    opacity: { duration: 0.1, repeat: state.coherence < 30 ? Infinity : 0 }
                }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg border-2 ${isUpsideDownMode ? 'bg-upside-down-bg border-upside-down-border' : 'bg-hawkins-bg border-hawkins-border'
                    } ${state.status === 'SIGNAL_LOST' ? 'animate-glitch' : ''}`}
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b-2 ${isUpsideDownMode ? 'bg-upside-down-bg border-upside-down-border' : 'bg-hawkins-bg border-hawkins-border'
                    }`}>
                    <div className="flex items-center gap-3">
                        <Radio className={`w-6 h-6 ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'}`} />
                        <h2 className={`text-xl font-bold uppercase tracking-wider ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                            }`}>
                            Dimensional Signal Calibrator
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setAudioEnabled(!audioEnabled)}
                            className={`p-2 rounded transition-colors ${isUpsideDownMode
                                ? 'hover:bg-upside-down-border text-upside-down-glow'
                                : 'hover:bg-hawkins-border text-hawkins-text-primary'
                                }`}
                            title="Toggle Audio (M)"
                        >
                            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={controls.reset}
                            className={`p-2 rounded transition-colors ${isUpsideDownMode
                                ? 'hover:bg-upside-down-border text-upside-down-glow'
                                : 'hover:bg-hawkins-border text-hawkins-text-primary'
                                }`}
                            title="Reset"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded transition-colors ${isUpsideDownMode
                                ? 'hover:bg-upside-down-border text-upside-down-glow'
                                : 'hover:bg-hawkins-border text-hawkins-text-primary'
                                }`}
                            title="Close (ESC)"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 space-y-6">
                    {/* Top Row: Coherence Display */}
                    <CoherenceDisplay
                        coherence={state.coherence}
                        status={state.status}
                        isUpsideDownMode={isUpsideDownMode}
                    />

                    {/* Signal Bars */}
                    <div className="grid grid-cols-2 gap-4">
                        <SignalBar
                            label="Signal Strength"
                            value={state.signalStrength}
                            max={100}
                            color={isUpsideDownMode ? 'bg-gradient-to-r from-upside-down-accent to-upside-down-glow' : 'bg-gradient-to-r from-green-600 to-green-400'}
                            isUpsideDownMode={isUpsideDownMode}
                        />
                        <SignalBar
                            label="Noise Level"
                            value={state.noiseLevel}
                            max={100}
                            color={isUpsideDownMode ? 'bg-gradient-to-r from-upside-down-danger to-pink-600' : 'bg-gradient-to-r from-red-600 to-orange-500'}
                            isUpsideDownMode={isUpsideDownMode}
                        />
                    </div>

                    {/* Control Panel */}
                    <div className={`p-4 rounded-lg border-2 ${isUpsideDownMode ? 'bg-upside-down-bg/50 border-upside-down-border' : 'bg-hawkins-bg-secondary/50 border-hawkins-border'
                        }`}>
                        <h3 className={`text-sm uppercase tracking-wider font-bold mb-4 ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                            }`}>
                            Signal Controls
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ControlDial
                                label="Frequency"
                                value={state.frequency}
                                onChange={controls.setFrequency}
                                isUpsideDownMode={isUpsideDownMode}
                            />
                            <ControlDial
                                label="Phase Alignment"
                                value={state.phase}
                                onChange={controls.setPhase}
                                isUpsideDownMode={isUpsideDownMode}
                            />
                            <ControlDial
                                label="Noise Suppression"
                                value={state.noiseSuppression}
                                onChange={controls.setNoiseSuppression}
                                isUpsideDownMode={isUpsideDownMode}
                            />
                        </div>
                    </div>

                    {/* Bottom Row: Data Panel and Log */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <DecodedDataPanel coherence={state.coherence} isUpsideDownMode={isUpsideDownMode} />
                        <SystemLog logs={logs} isUpsideDownMode={isUpsideDownMode} />
                    </div>

                    {/* Keyboard Hints */}
                    <div className={`text-center text-xs opacity-40 ${isUpsideDownMode ? 'text-upside-down-glow' : 'text-hawkins-text-dim'
                        }`}>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <span>↑↓ FREQUENCY</span>
                            <span>←→ PHASE</span>
                            <span>M MUTE</span>
                            <span>ESC CLOSE</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
