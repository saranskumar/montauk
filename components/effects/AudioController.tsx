'use client';

import { useEffect, useRef } from 'react';

interface AudioControllerProps {
    isActive: boolean;
    isUpsideDownMode?: boolean; // Control alien ambient sounds
    volume?: number;
}

declare global {
    interface Window {
        playRetroSound: (type: 'type' | 'blip' | 'static' | 'success' | 'error' | 'click' | 'beep' | 'suspense') => void;
        setCalibrationAudio: (staticVol: number, beepRate: number) => void;
        setDroneVolume: (volume: number) => void;
    }
}

const SOUND_ASSETS = {
    drone: '/audio/mixkit-underwater-transmitter-hum-2135.wav',
    type: '/audio/mixkit-on-or-off-light-switch-tap-2585.wav',
    blip: '/audio/mixkit-negative-tone-interface-tap-2569.wav',
    success: '/audio/mixkit-electronics-power-up-2602.wav',
    error: '/audio/mixkit-futuristic-device-fail-2939.wav',
    static: '/audio/mixkit-radio-waves-glitch-white-noise-1041.wav',
    click: '/audio/mixkit-on-or-off-light-switch-tap-2585.wav',
    // Upside Down ambient sounds
    alienBlast: '/audio/mixkit-alien-blast-in-the-earth-2546.wav',
    alienLanding: '/audio/mixkit-alien-spaceship-landing-slowly-2740.wav',
    alienTech: '/audio/mixkit-alien-technology-button-3118.wav',
};

export default function AudioController({ isActive, isUpsideDownMode = false, volume = 0.3 }: AudioControllerProps) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const buffersRef = useRef<Record<string, AudioBuffer>>({});

    // Looping Nodes
    const droneNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const droneGainRef = useRef<GainNode | null>(null);
    const staticNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const staticGainRef = useRef<GainNode | null>(null);

    // Calibration State
    const calibrationStateRef = useRef({ nextBeepTime: 0, beepRate: 0 });
    const animationFrameRef = useRef<number | null>(null);

    // Upside Down ambient intervals
    const alienIntervalsRef = useRef<number[]>([]);

    useEffect(() => {
        if (!isActive) return;

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.value = volume;
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // Load Assets
        const loadSound = async (key: string, url: string) => {
            try {
                console.log(`[AudioController] Loading sound: ${key} from ${url}`);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                buffersRef.current[key] = audioBuffer;
                console.log(`[AudioController] Loaded sound: ${key}`);
            } catch (error) {
                console.error(`[AudioController] Failed to load sound: ${key}`, error);
            }
        };

        const startDrone = () => {
            if (!ctx || !buffersRef.current.drone) return;
            try {
                const src = ctx.createBufferSource();
                src.buffer = buffersRef.current.drone;
                src.loop = true;
                const droneGain = ctx.createGain();
                droneGain.gain.value = 0.15; // Quieter in normal reality
                src.connect(droneGain);
                droneGain.connect(masterGain);
                src.start();
                droneNodeRef.current = src;
                droneGainRef.current = droneGain; // Store gain reference
                console.log('[AudioController] Drone started');
            } catch (e) {
                console.error('[AudioController] Error starting drone:', e);
            }
        };

        // Unlock handler - resume context on first interaction
        const unlockAudio = () => {
            if (ctx.state === 'suspended') {
                console.log('[AudioController] Unlocking AudioContext...');
                ctx.resume().then(() => {
                    console.log('[AudioController] AudioContext resumed, state:', ctx.state);
                    // Start drone after unlock
                    if (buffersRef.current.drone && !droneNodeRef.current) {
                        startDrone();
                    }
                });
            }
            // Remove listeners after first unlock
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
        };

        const loadAll = async () => {
            await Promise.all(Object.entries(SOUND_ASSETS).map(([k, v]) => loadSound(k, v)));
            console.log('[AudioController] All assets loaded. Context state:', ctx.state);

            // Only start drone if context is already running (unlikely on first load)
            if (ctx.state === 'running' && buffersRef.current.drone) {
                startDrone();
            }
        };

        // Register unlock listeners
        window.addEventListener('click', unlockAudio);
        window.addEventListener('keydown', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);

        loadAll();

        // -----------------------
        // Global API Implementation
        // -----------------------

        window.playRetroSound = (type) => {
            console.log(`[AudioController] Triggered sound: ${type} (Context: ${ctx.state})`);
            if (ctx.state === 'suspended') {
                ctx.resume().then(() => console.log('[AudioController] Resumed context on trigger'));
            }

            const buffer = buffersRef.current[type] || buffersRef.current['blip']; // Fallback
            if (!buffer) {
                console.warn(`[AudioController] Buffer not found for: ${type}`);
                return;
            }

            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const gain = ctx.createGain();

            // Adjust volumes for specific SFX
            if (type === 'type') gain.gain.value = 0.3;
            if (type === 'success') gain.gain.value = 0.6;
            if (type === 'static') {
                // Random pitch for static bursts
                src.playbackRate.value = 0.8 + Math.random() * 0.4;
                gain.gain.value = 0.5;
            }

            src.connect(gain);
            gain.connect(masterGain);
            src.start();
        };

        // Calibration Loop Logic
        const updateCalibrationAudio = () => {
            const t = ctx.currentTime;
            const { nextBeepTime, beepRate } = calibrationStateRef.current;

            // Beep Logic
            if (beepRate > 0) {
                if (t >= nextBeepTime) {
                    // Play Click
                    if (buffersRef.current.click) {
                        const src = ctx.createBufferSource();
                        src.buffer = buffersRef.current.click;
                        // Pitch shift up as rate increases
                        src.playbackRate.value = 1.0 + (beepRate * 1.5);
                        const g = ctx.createGain();
                        g.gain.value = 0.4;
                        src.connect(g);
                        g.connect(masterGain);
                        src.start(t);
                    }

                    // Helper: Beep intervals (slow -> fast)
                    // 0.1 rate = 500ms, 1.0 rate = 50ms
                    const delay = Math.max(0.05, 0.4 - (beepRate * 0.35));
                    calibrationStateRef.current.nextBeepTime = t + delay;
                }
            } else {
                calibrationStateRef.current.nextBeepTime = 0; // Reset
            }

            animationFrameRef.current = requestAnimationFrame(updateCalibrationAudio);
        };
        updateCalibrationAudio(); // Start Loop

        window.setCalibrationAudio = (staticVol, beepRate) => {
            if (ctx.state === 'suspended') ctx.resume();

            // Static Loop Control
            if (staticVol > 0 && buffersRef.current.static) {
                if (!staticNodeRef.current) {
                    const src = ctx.createBufferSource();
                    src.buffer = buffersRef.current.static;
                    src.loop = true;
                    const g = ctx.createGain();
                    src.connect(g);
                    g.connect(masterGain);
                    src.start();
                    staticNodeRef.current = src;
                    staticGainRef.current = g;
                }
                staticGainRef.current?.gain.setTargetAtTime(staticVol * 0.5, ctx.currentTime, 0.1);
            } else {
                if (staticNodeRef.current) {
                    staticNodeRef.current.stop();
                    staticNodeRef.current = null;
                    staticGainRef.current = null;
                }
            }

            // Update Loop State
            calibrationStateRef.current.beepRate = beepRate;
            // If starting fresh, set next time immediately
            if (beepRate > 0 && calibrationStateRef.current.nextBeepTime === 0) {
                calibrationStateRef.current.nextBeepTime = ctx.currentTime;
            }
        };

        // Drone volume control
        window.setDroneVolume = (volume) => {
            if (droneGainRef.current) {
                droneGainRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.5);
            }
        };


        return () => {
            if (droneNodeRef.current) droneNodeRef.current.stop();
            if (staticNodeRef.current) staticNodeRef.current.stop();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            ctx.close();
        };
    }, [isActive, volume]);

    // Upside Down Alien Ambient Sounds
    useEffect(() => {
        if (!isUpsideDownMode || !audioContextRef.current) return;

        const playAlienSound = (soundKey: string) => {
            const ctx = audioContextRef.current;
            const buffer = buffersRef.current[soundKey];
            if (!ctx || !buffer) return;

            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.value = 0.3; // Medium volume for alien sounds
            src.connect(gain);
            gain.connect(masterGainRef.current!);
            src.start();
        };

        // Set up staggered intervals for alien sounds
        const blastInterval = window.setInterval(() => {
            playAlienSound('alienBlast');
        }, 12000); // Every 12 seconds

        const landingInterval = window.setInterval(() => {
            playAlienSound('alienLanding');
        }, 18000); // Every 18 seconds

        const techInterval = window.setInterval(() => {
            playAlienSound('alienTech');
        }, 8000); // Every 8 seconds

        // Store intervals for cleanup
        alienIntervalsRef.current = [blastInterval, landingInterval, techInterval];

        // Play initial sounds with staggered timing
        setTimeout(() => playAlienSound('alienTech'), 1000);
        setTimeout(() => playAlienSound('alienBlast'), 3000);
        setTimeout(() => playAlienSound('alienLanding'), 6000);

        return () => {
            // Clear all intervals on cleanup
            alienIntervalsRef.current.forEach(interval => clearInterval(interval));
            alienIntervalsRef.current = [];
        };
    }, [isUpsideDownMode]);

    return null;
}
