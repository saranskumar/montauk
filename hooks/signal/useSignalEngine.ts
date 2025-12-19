import { useState, useCallback, useEffect, useRef } from 'react';
import { SignalState, SignalStatus, LogEntry } from '@/types/signal';

// Ideal values for signal lock
const IDEAL_FREQUENCY = 50;
const IDEAL_PHASE = 75;
const IDEAL_SUPPRESSION = 30;

// Thresholds
const LOCK_THRESHOLD = 80;
const PATTERN_THRESHOLD = 60;
const FAILURE_SPEED_THRESHOLD = 20;
const FAILURE_TIME_WINDOW = 500; // ms

const initialState: SignalState = {
    signalStrength: 0,
    noiseLevel: 100,
    coherence: 0,
    frequency: 25,
    phase: 50,
    noiseSuppression: 50,
    status: 'SEARCHING',
    isLocked: false,
    lastFailureTime: null,
};

export function useSignalEngine() {
    const [state, setState] = useState<SignalState>(initialState);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const previousValues = useRef({ frequency: 25, phase: 50, noiseSuppression: 50 });
    const lastChangeTime = useRef<number>(Date.now());

    // Add log entry
    const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        const entry: LogEntry = {
            id: Math.random().toString(36).substring(7),
            timestamp,
            message,
            type,
        };
        setLogs((prev) => [...prev.slice(-9), entry]); // Keep last 10
    }, []);

    // Calculate coherence and related values
    const calculateSignal = useCallback((freq: number, phase: number, supp: number) => {
        // Calculate distance from ideal values
        const freqDist = Math.abs(freq - IDEAL_FREQUENCY);
        const phaseDist = Math.abs(phase - IDEAL_PHASE);
        const suppDist = Math.abs(supp - IDEAL_SUPPRESSION);

        // Total distance (0-100 scale)
        const totalDist = (freqDist + phaseDist + suppDist) / 3;

        // Coherence decreases with distance from ideal
        const coherence = Math.max(0, Math.min(100, 100 - totalDist));

        // Noise increases with distance
        const noiseLevel = Math.min(100, totalDist);

        // Signal strength varies with frequency proximity
        const signalStrength = Math.max(0, Math.min(100, 100 - freqDist * 2));

        // Determine status
        let status: SignalStatus;
        let isLocked = false;

        if (coherence >= LOCK_THRESHOLD) {
            status = 'SIGNAL_LOCK';
            isLocked = true;
        } else if (coherence >= PATTERN_THRESHOLD) {
            status = 'PATTERN_DETECTED';
        } else if (state.status === 'SIGNAL_LOST' && Date.now() - (state.lastFailureTime || 0) < 2000) {
            status = 'SIGNAL_LOST';
        } else {
            status = 'SEARCHING';
        }

        return { signalStrength, noiseLevel, coherence, status, isLocked };
    }, [state.status, state.lastFailureTime]);

    // Check for failure conditions
    const checkFailure = useCallback((
        newValue: number,
        oldValue: number,
        controlName: string
    ): boolean => {
        const now = Date.now();
        const timeDiff = now - lastChangeTime.current;
        const valueDiff = Math.abs(newValue - oldValue);

        // Rapid movement detection
        if (timeDiff < FAILURE_TIME_WINDOW && valueDiff > FAILURE_SPEED_THRESHOLD) {
            addLog(`SIGNAL LOST - ${controlName.toUpperCase()} MOVED TOO FAST`, 'error');
            return true;
        }

        // Over-tuning detection
        if (state.noiseSuppression > 80) {
            addLog('SIGNAL LOST - NOISE SUPPRESSION TOO HIGH', 'error');
            return true;
        }

        // Phase misalignment
        if (state.phase < 20 || state.phase > 90) {
            addLog('SIGNAL LOST - PHASE MISALIGNMENT', 'error');
            return true;
        }

        return false;
    }, [state.noiseSuppression, state.phase, addLog]);

    // Set frequency
    const setFrequency = useCallback((value: number) => {
        const clamped = Math.max(0, Math.min(100, value));

        if (checkFailure(clamped, previousValues.current.frequency, 'frequency')) {
            setState((prev) => ({
                ...prev,
                frequency: clamped,
                status: 'SIGNAL_LOST',
                isLocked: false,
                lastFailureTime: Date.now(),
                coherence: 0,
                noiseLevel: 100,
            }));
            return;
        }

        const calculated = calculateSignal(clamped, state.phase, state.noiseSuppression);

        setState((prev) => ({
            ...prev,
            frequency: clamped,
            ...calculated,
        }));

        previousValues.current.frequency = clamped;
        lastChangeTime.current = Date.now();
    }, [state.phase, state.noiseSuppression, calculateSignal, checkFailure]);

    // Set phase
    const setPhase = useCallback((value: number) => {
        const clamped = Math.max(0, Math.min(100, value));

        if (checkFailure(clamped, previousValues.current.phase, 'phase')) {
            setState((prev) => ({
                ...prev,
                phase: clamped,
                status: 'SIGNAL_LOST',
                isLocked: false,
                lastFailureTime: Date.now(),
                coherence: 0,
                noiseLevel: 100,
            }));
            return;
        }

        const calculated = calculateSignal(state.frequency, clamped, state.noiseSuppression);

        setState((prev) => ({
            ...prev,
            phase: clamped,
            ...calculated,
        }));

        previousValues.current.phase = clamped;
        lastChangeTime.current = Date.now();
    }, [state.frequency, state.noiseSuppression, calculateSignal, checkFailure]);

    // Set noise suppression
    const setNoiseSuppression = useCallback((value: number) => {
        const clamped = Math.max(0, Math.min(100, value));

        if (checkFailure(clamped, previousValues.current.noiseSuppression, 'suppression')) {
            setState((prev) => ({
                ...prev,
                noiseSuppression: clamped,
                status: 'SIGNAL_LOST',
                isLocked: false,
                lastFailureTime: Date.now(),
                coherence: 0,
                noiseLevel: 100,
            }));
            return;
        }

        const calculated = calculateSignal(state.frequency, state.phase, clamped);

        setState((prev) => ({
            ...prev,
            noiseSuppression: clamped,
            ...calculated,
        }));

        previousValues.current.noiseSuppression = clamped;
        lastChangeTime.current = Date.now();
    }, [state.frequency, state.phase, calculateSignal, checkFailure]);

    // Reset to initial state
    const reset = useCallback(() => {
        setState(initialState);
        setLogs([]);
        addLog('SIGNAL SEARCH INITIATED', 'info');
    }, [addLog]);

    // Log status changes
    useEffect(() => {
        const prevStatus = state.status;

        if (prevStatus === 'SEARCHING' && state.status === 'PATTERN_DETECTED') {
            addLog(`COHERENCE ${Math.round(state.coherence)}% - PATTERN DETECTED`, 'info');
        } else if (state.status === 'SIGNAL_LOCK' && !state.isLocked) {
            addLog(`COHERENCE ${Math.round(state.coherence)}% - SIGNAL LOCK`, 'success');
        }
    }, [state.status, state.coherence, state.isLocked, addLog]);

    // Initialize
    useEffect(() => {
        addLog('SIGNAL SEARCH INITIATED', 'info');
    }, [addLog]);

    return {
        state,
        controls: {
            setFrequency,
            setPhase,
            setNoiseSuppression,
            reset,
        },
        logs,
    };
}

