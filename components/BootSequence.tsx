'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignalWave from './SignalWave';

interface BootSequenceProps {
    onComplete: () => void;
}

type BootStage = 'start' | 'boot' | 'calibrate' | 'auth' | 'connect' | 'login' | 'receive-data' | 'complete';

const stageMessages = {
    boot: [
        { text: '> INITIALIZING HAWKINS COMMAND SYSTEM...', delay: 800 },
        { text: '> LOADING BIOS v1.983...', delay: 1100 },
        { text: '> MEMORY CHECK: 640KB OK', delay: 1400 },
        { text: '> LOADING CLASSIFIED PROTOCOLS...', delay: 1700 },
        { text: '> BOOT SEQUENCE COMPLETE', delay: 2000 },
    ],
    calibrate: [
        { text: '> PSYCHIC SIGNAL CALIBRATION REQUIRED', delay: 0 },
        { text: '> ADJUST SIGNAL STRENGTH TO ESTABLISH CONNECTION', delay: 400 },
        { text: '> USE CONTROLS BELOW TO CALIBRATE', delay: 800 },
    ],
    auth: [
        { text: '> ENCRYPTION KEY REQUIRED FOR ACCESS', delay: 0 },
        { text: '> ENTER CLASSIFIED AUTHORIZATION CODE', delay: 400 },
        { text: '> SECURITY LEVEL: ULTRA CLEARANCE', delay: 800 },
    ],
    connect: [
        { text: '> ESTABLISHING SECURE CONNECTION...', delay: 0 },
        { text: '> CONNECTING TO HAWKINS MAINFRAME...', delay: 400 },
        { text: '> HANDSHAKE PROTOCOL INITIATED...', delay: 800 },
        { text: '> CONNECTION ESTABLISHED', delay: 1200 },
    ],
    login: [
        { text: '> VERIFYING CLEARANCE LEVEL...', delay: 0 },
        { text: '> SCANNING RETINAL PATTERN...', delay: 400 },
        { text: '> CHECKING AUTHORIZATION...', delay: 800 },
        { text: '> ACCESS GRANTED - CLEARANCE: ULTRA', delay: 1200 },
    ],
    'receive-data': [
        { text: '> DOWNLOADING INCIDENT DATABASE...', delay: 0 },
        { text: '> DECRYPTING TEMPORAL DATA...', delay: 400 },
        { text: '> LOADING THREAT ASSESSMENTS...', delay: 800 },
        { text: '> SYNCHRONIZING REAL-TIME FEEDS...', delay: 1200 },
        { text: '> SYSTEM READY', delay: 1600 },
    ],
};

const asciiLogo = `
██╗  ██╗ █████╗ ██╗    ██╗██╗  ██╗██╗███╗   ██╗███████╗
██║  ██║██╔══██╗██║    ██║██║ ██╔╝██║████╗  ██║██╔════╝
███████║███████║██║ █╗ ██║█████╔╝ ██║██╔██╗ ██║███████╗
██╔══██║██╔══██║██║███╗██║██╔═██╗ ██║██║╚██╗██║╚════██║
██║  ██║██║  ██║╚███╔███╔╝██║  ██╗██║██║ ╚████║███████║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝
`;

export default function BootSequence({ onComplete }: BootSequenceProps) {
    const [stage, setStage] = useState<BootStage>('start'); // New 'start' stage
    const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
    const [showLogo, setShowLogo] = useState(true);
    const [progress, setProgress] = useState(0);
    const [calibrationStep, setCalibrationStep] = useState(0); // For staggered UI load

    // Calibration state
    const [signalStrength, setSignalStrength] = useState(50);
    const [frequency, setFrequency] = useState(50);
    const [isCalibrated, setIsCalibrated] = useState(false);
    const [calibrationProgress, setCalibrationProgress] = useState(0);

    // Authentication state
    const [encryptionKey, setEncryptionKey] = useState('');
    const [authError, setAuthError] = useState(false);
    const correctKey = 'HAWKINS1983'; // The secret key

    // Audio System
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBuffersRef = useRef<Record<string, AudioBuffer>>({});
    const staticNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const staticGainRef = useRef<GainNode | null>(null);
    const beepIntervalRef = useRef<number | null>(null);

    // Initialize Audio
    useEffect(() => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const loadSound = async (key: string, url: string) => {
            try {
                const response = await fetch(url);
                if (!response.ok) return;
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                audioBuffersRef.current[key] = audioBuffer;
            } catch (error) {
                console.error(`Failed to load sound: ${key}`, error);
            }
        };

        // Load essential sounds
        Promise.all([
            loadSound('beep', '/audio/mixkit-alarm-clock-beep-988.wav'), // Normal buzzer beep
            loadSound('success', '/audio/mixkit-futuristic-bass-hit-2303.wav'),
            loadSound('error', '/audio/mixkit-negative-tone-interface-tap-2569.wav'), // Negative tone for errors
            loadSound('static', '/audio/mixkit-terror-radio-frequency-2566.wav'), // Terror radio for suspense
            loadSound('suspense', '/audio/mixkit-glitchy-cinematic-suspense-hit-679.wav'), // Extra tension
        ]);

        // Unlock audio on first interaction
        const unlock = () => {
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            // Drone is handled by global AudioController
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });

        return () => {
            if (staticNodeRef.current) staticNodeRef.current.stop();
            if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);
            ctx.close();
        };
    }, []);

    // Sound playback function
    const playSound = (type: 'beep' | 'success' | 'error' | 'suspense') => {
        const ctx = audioContextRef.current;
        const buffer = audioBuffersRef.current[type];
        if (!ctx || !buffer) return;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.value = type === 'success' ? 0.6 : 0.3;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    };

    // Calibration audio control
    const setCalibrationAudio = (staticVol: number, beepRate: number) => {
        const ctx = audioContextRef.current;
        if (!ctx) return;

        // Static control
        if (staticVol > 0 && audioBuffersRef.current.static) {
            if (!staticNodeRef.current) {
                // Only create new node if one doesn't exist
                const src = ctx.createBufferSource();
                src.buffer = audioBuffersRef.current.static;
                src.loop = true;
                const g = ctx.createGain();
                src.connect(g);
                g.connect(ctx.destination);
                src.start();
                staticNodeRef.current = src;
                staticGainRef.current = g;
            }
            // Smoothly update volume
            staticGainRef.current?.gain.setTargetAtTime(staticVol * 0.4, ctx.currentTime, 0.1);
        } else {
            // Stop only if volume is effectively 0 to avoid rapid toggling
            if (staticVol <= 0.01 && staticNodeRef.current) {
                staticNodeRef.current.stop();
                staticNodeRef.current = null;
                staticGainRef.current = null;
            }
        }

        // Beep control
        if (beepIntervalRef.current) {
            clearInterval(beepIntervalRef.current);
            beepIntervalRef.current = null;
        }

        if (beepRate > 0 && audioBuffersRef.current.beep) {
            // Prevent extremely fast overlapping beeps (min 80ms)
            const delay = Math.max(80, 400 - beepRate * 320);
            beepIntervalRef.current = window.setInterval(() => {
                playSound('beep'); // Use beep instead of click
            }, delay);
        }
    };

    // Stage progression
    useEffect(() => {
        const messages = stageMessages[stage as keyof typeof stageMessages];
        if (!messages) return;

        setVisibleMessages([]);

        messages.forEach((msg, index) => {
            setTimeout(() => {
                setVisibleMessages((prev) => [...prev, index]);
                // No sound - silent cinematic text reveal
            }, msg.delay);
        });

        // Auto-progress for non-interactive stages
        if (stage === 'boot') {
            setTimeout(() => {
                setStage('calibrate');
            }, 3000);
        } else if (stage === 'calibrate') {
            // Staggered reveal for calibration UI
            const steps = [1, 2, 3, 4, 5];
            steps.forEach((step, index) => {
                setTimeout(() => {
                    setCalibrationStep(step);
                }, index * 400); // 400ms delay between each element
            });
        } else if (stage === 'connect') {
            setTimeout(() => setStage('login'), 2000);
        } else if (stage === 'login') {
            setTimeout(() => setStage('receive-data'), 2000);
        } else if (stage === 'receive-data') {
            // Progress bar for data loading
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setStage('complete');
                            setTimeout(onComplete, 500);
                        }, 500);
                        return 100;
                    }
                    return prev + 3;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [stage, onComplete]);

    // Calibration monitoring and keyboard controls
    useEffect(() => {
        if (stage !== 'calibrate') return;

        // Keyboard controls for calibration
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                    setSignalStrength(prev => Math.min(prev + 2, 100));
                    break;
                case 'ArrowDown':
                    setSignalStrength(prev => Math.max(prev - 2, 0));
                    break;
                case 'ArrowRight':
                    setFrequency(prev => Math.min(prev + 2, 100));
                    break;
                case 'ArrowLeft':
                    setFrequency(prev => Math.max(prev - 2, 0));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [stage]); // Generic key listener for 'start' stage

    useEffect(() => {
        if (stage !== 'start') return;
        const startBoot = () => {
            setStage('boot');
            window.playRetroSound?.('click');
        };
        window.addEventListener('keydown', startBoot);
        window.addEventListener('click', startBoot);
        window.addEventListener('touchstart', startBoot);
        return () => {
            window.removeEventListener('keydown', startBoot);
            window.removeEventListener('click', startBoot);
            window.removeEventListener('touchstart', startBoot);
        };
    }, [stage]);

    // Slider Interaction Logic
    const handleSliderInteraction = (e: React.PointerEvent<HTMLDivElement>, setter: (val: number | ((prev: number) => number)) => void) => {
        e.preventDefault(); // Prevent scrolling on touch
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        setter(Math.round(percentage));

        // Capture pointer for continuous drag
        if (e.type === 'pointerdown') {
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    };

    // Calibration keyboard controls
    useEffect(() => {
        if (stage !== 'calibrate') return;

        // Keyboard controls for calibration
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                    setSignalStrength(prev => Math.min(prev + 2, 100));
                    break;
                case 'ArrowDown':
                    setSignalStrength(prev => Math.max(prev - 2, 0));
                    break;
                case 'ArrowRight':
                    setFrequency(prev => Math.min(prev + 2, 100));
                    break;
                case 'ArrowLeft':
                    setFrequency(prev => Math.max(prev - 2, 0));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Check if calibrated (both values near 75-85 range for optimal signal)
        const isOptimal = signalStrength >= 70 && signalStrength <= 90 &&
            frequency >= 70 && frequency <= 90;

        if (isOptimal) {
            setCalibrationProgress((prev) => {
                // If already at 100 or higher, do nothing
                if (prev >= 100) return 100;

                const newProgress = Math.min(prev + 12, 100);

                if (newProgress >= 100) {
                    // 1. Immediately clear beep interval
                    if (beepIntervalRef.current) {
                        clearInterval(beepIntervalRef.current);
                        beepIntervalRef.current = null;
                    }

                    // 2. Force audio stop
                    setCalibrationAudio(0, 0);

                    // 3. Play success sound only if we weren't already calibrated
                    if (!isCalibrated) {
                        setIsCalibrated(true);
                        // Small delay to ensure silence first
                        setTimeout(() => playSound('success'), 100);
                        setTimeout(() => setStage('auth'), 1500);
                    }
                    return 100;
                }
                return newProgress;
            });
        } else {
            setCalibrationProgress((prev) => Math.max(prev - 1, 0));
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            setCalibrationAudio(0, 0); // Stop sounds on unmount
        };
    }, [signalStrength, frequency, stage, isCalibrated]);

    // Audio Sync Effect
    useEffect(() => {
        if (stage !== 'calibrate') return;

        // Static decreases as calibration increases
        // Beeps start when "Optimal" range is hit? Or always?
        // User said: "play static noise... while increasing lock reduce beep frequency... before that noise only"

        // Interpretation:
        // 1. Not in range = Static Only.
        // 2. In Range (Optimal) = Locking starts (Progress goes up).
        // 3. As Progress goes up = Static fades, Beeps appear and speed up (reduce interval).

        const isOptimal = signalStrength >= 70 && signalStrength <= 90 && frequency >= 70 && frequency <= 90;

        let staticVol = 0.5;
        let beepRate = 0;

        if (!isOptimal) {
            // High static, no beeps
            staticVol = 0.8;
            beepRate = 0;
        } else {
            // We are locking
            // Static fades out as progress goes 0->100
            staticVol = Math.max(0, 0.8 - (calibrationProgress / 100));
            // Beep rate increases 0->1
            beepRate = Math.max(0.1, calibrationProgress / 95);
        }

        if (isCalibrated || calibrationProgress >= 100) {
            staticVol = 0;
            beepRate = 0;
        }

        // Only update if changes are significant to prevent re-triggering samples
        setCalibrationAudio(staticVol, beepRate);

    }, [signalStrength, frequency, calibrationProgress, stage, isCalibrated]);

    if (stage === 'complete') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4 overflow-hidden"
                style={{
                    background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
                }}
            >
                {/* CRT Effects */}
                <div className="crt-overlay" />
                <div className="crt-glow" />
                <div className="film-grain" />

                {/* Simple Content Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative max-w-5xl w-full"
                >
                    {/* Inner Screen */}
                    <div className="relative border-2 border-hawkins-accent/30 rounded bg-black p-8 overflow-hidden min-h-[600px]"
                        style={{
                            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9), 0 0 20px rgba(217, 119, 6, 0.2)',
                            background: 'radial-gradient(ellipse at center, #0d0d0d 0%, #000000 100%)',
                        }}
                    >
                        {/* Corner Brackets */}
                        <div className="absolute top-2 left-2 text-hawkins-accent text-2xl font-mono leading-none">┌</div>
                        <div className="absolute top-2 right-2 text-hawkins-accent text-2xl font-mono leading-none">┐</div>
                        <div className="absolute bottom-2 left-2 text-hawkins-accent text-2xl font-mono leading-none">└</div>
                        <div className="absolute bottom-2 right-2 text-hawkins-accent text-2xl font-mono leading-none">┘</div>

                        {/* Top Status Bar */}
                        <div className="absolute top-0 left-0 right-0 border-b border-hawkins-accent/30 bg-hawkins-bg-secondary/50 px-6 py-2 flex justify-between items-center text-xs font-mono">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-hawkins-accent">HAWKINS_MAINFRAME_v1.983</span>
                            </div>
                            <div className="text-hawkins-text-dim uppercase">
                                {stage.replace('-', ' ')}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="mt-12 mb-8">

                            {/* Start Screen */}
                            {stage === 'start' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20">
                                    <div className="text-center space-y-4 animate-pulse">
                                        <div className="text-hawkins-accent text-lg font-mono tracking-widest uppercase">
                                            Hawkins National Laboratory
                                        </div>
                                        <div className="text-hawkins-text-dim text-sm font-mono typewriter">
                                            [ SECURE CONNECTION REQUIRED ]
                                        </div>
                                        <div className="mt-8 text-white font-mono text-sm bg-hawkins-accent/20 px-4 py-2 border border-hawkins-accent/50 rounded inline-block cursor-pointer">
                                            PRESS ANY KEY TO INITIALIZE
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ASCII Logo */}
                            {showLogo && stage !== 'start' && (
                                <pre
                                    className="text-hawkins-accent text-[8px] sm:text-[10px] md:text-xs leading-tight mb-6 text-center"
                                    style={{
                                        fontFamily: 'monospace',
                                        textShadow: '0 0 10px rgba(217, 119, 6, 0.8)',
                                    }}
                                >
                                    {asciiLogo}
                                </pre>
                            )}

                            {/* Stage Messages */}
                            <div className="space-y-1 mb-8 font-mono text-sm px-4">
                                {stageMessages[stage as keyof typeof stageMessages]?.map((msg, index) => (
                                    visibleMessages.includes(index) && (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-hawkins-text-primary"
                                            style={{
                                                textShadow: '0 0 5px rgba(252, 211, 77, 0.5)',
                                            }}
                                        >
                                            <span className="text-hawkins-accent">►</span>
                                            <span>{msg.text}</span>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Calibration Interface */}
                            {stage === 'calibrate' && (
                                <div className="px-4 space-y-6">
                                    {/* Signal Wave Visualization */}
                                    <div>
                                        <div className="text-xs font-mono text-hawkins-text-dim mb-2 flex items-center gap-2">
                                            <span className="text-hawkins-accent">◆</span>
                                            SIGNAL WAVEFORM ANALYSIS
                                        </div>
                                        <SignalWave
                                            signalStrength={signalStrength}
                                            frequency={frequency}
                                            isCalibrated={isCalibrated}
                                        />
                                    </div>

                                    {/* Signal Strength Control */}
                                    <div>
                                        <div className="flex justify-between text-xs font-mono text-hawkins-text-dim mb-3">
                                            <span className="flex items-center gap-2">
                                                <span className="text-hawkins-accent">◆</span>
                                                SIGNAL STRENGTH
                                            </span>
                                            <span className="text-hawkins-accent font-bold">{signalStrength}%</span>
                                        </div>
                                        <div
                                            className="relative h-6 bg-black border-2 border-hawkins-accent/50 rounded overflow-hidden mb-3 cursor-ew-resize touch-none"
                                            onPointerDown={(e) => handleSliderInteraction(e, setSignalStrength)}
                                            onPointerMove={(e) => e.buttons > 0 && handleSliderInteraction(e, setSignalStrength)}
                                        >
                                            <div
                                                className="h-full transition-all duration-75 ease-linear pointer-events-none"
                                                style={{
                                                    width: `${signalStrength}%`,
                                                    background: signalStrength >= 70 && signalStrength <= 90
                                                        ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                                                        : 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)',
                                                    boxShadow: '0 0 10px rgba(217, 119, 6, 0.5)',
                                                }}
                                            />
                                            {/* Thumb Indicator for dragging clarity */}
                                            <div
                                                className="absolute top-0 w-1 h-full bg-white/80 pointer-events-none"
                                                style={{ left: `${signalStrength}%`, transform: 'translateX(-50%)' }}
                                            />
                                            {/* Optimal range indicator */}
                                            <div className="absolute top-0 left-[70%] w-[20%] h-full bg-green-500/10 border-x border-green-500/30 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Frequency Control */}
                                    <div>
                                        <div className="flex justify-between text-xs font-mono text-hawkins-text-dim mb-3">
                                            <span className="flex items-center gap-2">
                                                <span className="text-hawkins-accent">◆</span>
                                                FREQUENCY MODULATION
                                            </span>
                                            <span className="text-hawkins-accent font-bold">{frequency} MHz</span>
                                        </div>
                                        <div
                                            className="relative h-6 bg-black border-2 border-hawkins-accent/50 rounded overflow-hidden mb-3 cursor-ew-resize touch-none"
                                            onPointerDown={(e) => handleSliderInteraction(e, setFrequency)}
                                            onPointerMove={(e) => e.buttons > 0 && handleSliderInteraction(e, setFrequency)}
                                        >
                                            <div
                                                className="h-full transition-all duration-75 ease-linear pointer-events-none"
                                                style={{
                                                    width: `${frequency}%`,
                                                    background: frequency >= 70 && frequency <= 90
                                                        ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                                                        : 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)',
                                                    boxShadow: '0 0 10px rgba(217, 119, 6, 0.5)',
                                                }}
                                            />
                                            {/* Thumb Indicator */}
                                            <div
                                                className="absolute top-0 w-1 h-full bg-white/80 pointer-events-none"
                                                style={{ left: `${frequency}%`, transform: 'translateX(-50%)' }}
                                            />
                                            {/* Optimal range indicator */}
                                            <div className="absolute top-0 left-[70%] w-[20%] h-full bg-green-500/10 border-x border-green-500/30 pointer-events-none" />
                                        </div>

                                    </div>

                                    {/* Calibration Progress & Hint - Step 4 */}
                                    {calibrationStep >= 4 && (
                                        <div>
                                            <div className="flex justify-between text-xs font-mono text-hawkins-text-dim mb-2">
                                                <span>CALIBRATION LOCK</span>
                                                <span>{calibrationProgress}%</span>
                                            </div>
                                            <div className="h-4 bg-black border-2 border-hawkins-accent/50 rounded overflow-hidden">
                                                <motion.div
                                                    animate={{ width: `${calibrationProgress}%` }}
                                                    className="h-full"
                                                    style={{
                                                        background: calibrationProgress >= 100
                                                            ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                                                            : 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)',
                                                        boxShadow: calibrationProgress >= 100
                                                            ? '0 0 20px rgba(16, 185, 129, 0.8)'
                                                            : '0 0 20px rgba(217, 119, 6, 0.8)',
                                                    }}
                                                />
                                            </div>

                                            {/* Hint */}
                                            <div className="w-full text-center text-[10px] leading-relaxed font-mono text-hawkins-text-dim animate-pulse mt-4 px-2 sm:px-8 whitespace-nowrap overflow-hidden text-ellipsis">
                                                {calibrationProgress < 100
                                                    ? '► INTER-DIMENSIONAL SIGNAL UNSTABLE. ADJUST FREQUENCY AND SIGNAL TO 70-90 RANGE TO HARMONIZE WITH THE UPSIDE DOWN. ◄'
                                                    : '► CALIBRATION LOCKED - ESTABLISHING CONNECTION ◄'
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {/* Consolidated Controls */}
                                    <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-hawkins-text-dim mt-4 border-t border-hawkins-accent/20 pt-4">
                                        <div className="flex items-center gap-2">
                                            <span>SIGNAL CONTROL</span>
                                            <button
                                                className="px-2 py-0.5 bg-hawkins-accent/20 border border-hawkins-accent/50 rounded text-hawkins-accent hover:bg-hawkins-accent/30 transition-colors"
                                                onClick={() => setSignalStrength(prev => Math.min(prev + 2, 100))}
                                            >
                                                ▲ UP
                                            </button>
                                            <button
                                                className="px-2 py-0.5 bg-hawkins-accent/20 border border-hawkins-accent/50 rounded text-hawkins-accent hover:bg-hawkins-accent/30 transition-colors"
                                                onClick={() => setSignalStrength(prev => Math.max(prev - 2, 0))}
                                            >
                                                ▼ DOWN
                                            </button>
                                        </div>
                                        <div className="w-px h-4 bg-hawkins-accent/30 mx-2 hidden sm:block" />
                                        <div className="flex items-center gap-2">
                                            <span>FREQUENCY CONTROL</span>
                                            <button
                                                className="px-2 py-0.5 bg-hawkins-accent/20 border border-hawkins-accent/50 rounded text-hawkins-accent hover:bg-hawkins-accent/30 transition-colors"
                                                onClick={() => setFrequency(prev => Math.max(prev - 2, 0))}
                                            >
                                                ◄ LEFT
                                            </button>
                                            <button
                                                className="px-2 py-0.5 bg-hawkins-accent/20 border border-hawkins-accent/50 rounded text-hawkins-accent hover:bg-hawkins-accent/30 transition-colors"
                                                onClick={() => setFrequency(prev => Math.min(prev + 2, 100))}
                                            >
                                                RIGHT ►
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Authentication Interface */}
                            {stage === 'auth' && (
                                <div className="px-4 space-y-6">
                                    <div>
                                        <div className="text-xs font-mono text-hawkins-text-dim mb-4 flex items-center gap-2">
                                            <span className="text-hawkins-accent">◆</span>
                                            ENTER ENCRYPTION KEY
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={encryptionKey}
                                                onChange={(e) => {
                                                    const value = e.target.value.toUpperCase();
                                                    setEncryptionKey(value);
                                                    setAuthError(false);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        if (encryptionKey === correctKey) {
                                                            setTimeout(() => setStage('connect'), 500);
                                                        } else {
                                                            setAuthError(true);
                                                            playSound('error'); // Negative tone for wrong password
                                                            setTimeout(() => setAuthError(false), 2000);
                                                        }
                                                    }
                                                }}
                                                placeholder="_ _ _ _ _ _ _ _ _ _ _"
                                                autoFocus
                                                className={`w-full bg-black border-2 ${authError
                                                    ? 'border-red-500 animate-pulse'
                                                    : encryptionKey === correctKey
                                                        ? 'border-green-500'
                                                        : 'border-hawkins-accent/50'
                                                    } rounded px-4 py-3 font-mono text-lg text-hawkins-text-primary focus:outline-none focus:border-hawkins-accent transition-colors`}
                                                style={{
                                                    letterSpacing: '0.3em',
                                                    textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                                                    boxShadow: authError
                                                        ? '0 0 20px rgba(239, 68, 68, 0.5)'
                                                        : encryptionKey === correctKey
                                                            ? '0 0 20px rgba(34, 197, 94, 0.5)'
                                                            : '0 0 10px rgba(217, 119, 6, 0.3)',
                                                }}
                                            />

                                            {/* Status Indicator */}
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {encryptionKey === correctKey ? (
                                                    <span className="text-green-500 text-xl">✓</span>
                                                ) : authError ? (
                                                    <span className="text-red-500 text-xl">✗</span>
                                                ) : null}
                                            </div>
                                        </div>

                                        {authError && (
                                            <div className="mt-3 text-red-500 text-xs font-mono flex items-center gap-2">
                                                <span>⚠</span>
                                                <span>ACCESS DENIED - INVALID ENCRYPTION KEY</span>
                                            </div>
                                        )}

                                        {encryptionKey === correctKey && (
                                            <div className="mt-3 text-green-500 text-xs font-mono flex items-center gap-2">
                                                <span>✓</span>
                                                <span>ENCRYPTION KEY ACCEPTED - INITIATING CONNECTION</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hint */}
                                    <div className="text-center text-xs font-mono text-hawkins-text-dim opacity-60">
                                        ► HINT: PROJECT NAME + YEAR ◄
                                    </div>
                                </div>
                            )}

                            {/* Data Loading Progress */}
                            {stage === 'receive-data' && (
                                <div className="px-4">
                                    <div className="mb-2 flex justify-between text-xs font-mono text-hawkins-text-dim">
                                        <span>DATA TRANSFER</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-6 bg-black border-2 border-hawkins-accent/50 rounded overflow-hidden relative">
                                        <motion.div
                                            animate={{ width: `${progress}%` }}
                                            className="h-full"
                                            style={{
                                                background: 'linear-gradient(90deg, #d97706 0%, #fbbf24 50%, #d97706 100%)',
                                                boxShadow: '0 0 20px rgba(217, 119, 6, 0.8)',
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                                        </motion.div>
                                        <div className="absolute inset-0 flex">
                                            {Array.from({ length: 20 }).map((_, i) => (
                                                <div key={i} className="flex-1 border-r border-black/30" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Status Bar */}
                        <div className="absolute bottom-0 left-0 right-0 border-t border-hawkins-accent/30 bg-hawkins-bg-secondary/50 px-6 py-2 flex justify-between items-center text-[10px] font-mono">
                            <div className="text-hawkins-text-dim">
                                <div>HAWKINS NATIONAL LABORATORY</div>
                                <div>DEPT. OF ENERGY • CLEARANCE: ULTRA</div>
                            </div>
                            <div className="text-right text-hawkins-accent">
                                <div>TERMINAL_ID: HNL-001</div>
                                <div>AUTHORIZED ACCESS ONLY</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Power LED */}
                <div className="absolute bottom-8 left-8 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
                        style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }} />
                    <span className="text-xs font-mono text-gray-500">PWR</span>
                </div>
            </motion.div >
        </AnimatePresence >
    );
}
