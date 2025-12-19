'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { AudioType } from '@/types/signal';

export function useAudioManager(
    coherence: number,
    noiseLevel: number,
    status: string,
    isEnabled: boolean
) {
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({
        static: null,
        pulse: null,
        warble: null,
        beep: null,
        distort: null,
        squelch: null,
        transmission: null,
        click: null,
    });

    const [currentAudio, setCurrentAudio] = useState<AudioType>('none');
    const [isInitialized, setIsInitialized] = useState(false);
    const currentSourceRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio elements
    useEffect(() => {
        if (!isEnabled || isInitialized) return;

        // Create audio elements for each sound
        const sounds = {
            static: '/audio/mixkit-radio-waves-glitch-white-noise-1041.wav',
            pulse: '/audio/mixkit-broken-radio-frequency-signal-2563.wav',
            warble: '/audio/mixkit-creepy-radio-frequency-2558.wav',
            beep: '/audio/mixkit-alarm-digital-clock-beep-989.wav',
            distort: '/audio/mixkit-futuristic-device-fail-2939.wav',
            squelch: '/audio/mixkit-glitch-sci-fi-rewind-transition-1093.wav',
            transmission: '/audio/mixkit-on-or-off-light-switch-tap-2585.wav',
            click: '/audio/mixkit-negative-tone-interface-tap-2569.wav',
        };

        Object.entries(sounds).forEach(([key, src]) => {
            const audio = new Audio(src);
            audio.preload = 'auto';
            if (key !== 'beep' && key !== 'distort' && key !== 'squelch' && key !== 'transmission' && key !== 'click') {
                audio.loop = true;
            }
            audioRefs.current[key] = audio;
        });

        setIsInitialized(true);

        return () => {
            // Cleanup
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, [isEnabled, isInitialized]);

    // Play audio
    const playAudio = useCallback((type: AudioType, loop: boolean = true) => {
        if (!isEnabled || type === 'none') return;

        // Stop current audio
        if (currentSourceRef.current) {
            currentSourceRef.current.pause();
            currentSourceRef.current.currentTime = 0;
        }

        const audio = audioRefs.current[type];
        if (!audio) return;

        audio.loop = loop;
        audio.volume = 0.5;

        // Handle audio play promise
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Audio play failed:', error);
            });
        }

        currentSourceRef.current = audio;
        setCurrentAudio(type);
    }, [isEnabled]);

    // Play radio effect
    const playRadioEffect = useCallback((effectType: 'squelch' | 'transmission' | 'click') => {
        if (!isEnabled || !isInitialized) return;

        const audio = audioRefs.current[effectType];
        if (!audio) return;

        audio.volume = 0.6;
        audio.currentTime = 0;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Radio effect play failed:', error);
            });
        }
    }, [isEnabled, isInitialized]);

    // Determine which audio to play based on coherence
    useEffect(() => {
        if (!isEnabled || !isInitialized) {
            if (currentSourceRef.current) {
                currentSourceRef.current.pause();
                currentSourceRef.current = null;
            }
            setCurrentAudio('none');
            return;
        }

        let targetAudio: AudioType;

        if (status === 'SIGNAL_LOST') {
            playAudio('distort', false);
            return;
        }

        if (coherence < 30) {
            targetAudio = 'static';
        } else if (coherence < 60) {
            targetAudio = 'pulse';
        } else if (coherence < 80) {
            targetAudio = 'warble';
        } else {
            // Signal lock - play beep once then silence
            if (currentAudio !== 'beep') {
                playAudio('beep', false);
            }
            return;
        }

        if (targetAudio !== currentAudio) {
            playAudio(targetAudio, true);
        }
    }, [coherence, status, isEnabled, isInitialized, currentAudio, playAudio]);

    // Update volume based on noise level
    useEffect(() => {
        if (!currentSourceRef.current) return;

        if (currentAudio === 'static') {
            currentSourceRef.current.volume = noiseLevel / 100;
        } else if (currentAudio === 'pulse') {
            currentSourceRef.current.volume = 0.7;
        } else if (currentAudio === 'warble' || currentAudio === 'beep') {
            currentSourceRef.current.volume = 0.5;
        } else if (currentAudio === 'distort') {
            currentSourceRef.current.volume = 0.8;
        }
    }, [noiseLevel, currentAudio]);

    // Play random radio effects during signal reception
    useEffect(() => {
        if (!isEnabled || !isInitialized || coherence < 30) return;

        // Random radio squelch/clicks during signal search
        const effectInterval = setInterval(() => {
            const random = Math.random();

            if (coherence >= 30 && coherence < 60) {
                // Pattern detected - occasional squelch
                if (random > 0.7) {
                    playRadioEffect('squelch');
                }
            } else if (coherence >= 60 && coherence < 80) {
                // Getting closer - transmission clicks
                if (random > 0.6) {
                    playRadioEffect('click');
                }
            } else if (coherence >= 80) {
                // Signal lock - transmission beep
                if (random > 0.85) {
                    playRadioEffect('transmission');
                }
            }
        }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds

        return () => clearInterval(effectInterval);
    }, [coherence, isEnabled, isInitialized, playRadioEffect]);

    // Play transmission beep on status changes
    useEffect(() => {
        if (!isEnabled || !isInitialized) return;

        if (status === 'PATTERN_DETECTED') {
            playRadioEffect('squelch');
        } else if (status === 'SIGNAL_LOCK') {
            playRadioEffect('transmission');
        }
    }, [status, isEnabled, isInitialized, playRadioEffect]);

    return { currentAudio };
}
