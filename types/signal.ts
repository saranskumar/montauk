// Signal System Types
export type SignalStatus = 'SEARCHING' | 'PATTERN_DETECTED' | 'SIGNAL_LOCK' | 'SIGNAL_LOST';

export type AudioType = 'static' | 'pulse' | 'warble' | 'beep' | 'distort' | 'none';

export interface SignalState {
    signalStrength: number;
    noiseLevel: number;
    coherence: number;
    frequency: number;
    phase: number;
    noiseSuppression: number;
    status: SignalStatus;
    isLocked: boolean;
    lastFailureTime: number | null;
}

export interface SignalControls {
    setFrequency: (value: number) => void;
    setPhase: (value: number) => void;
    setNoiseSuppression: (value: number) => void;
    reset: () => void;
}

export interface LogEntry {
    id: string;
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface DecodedMessage {
    location: string;
    eventType: string;
    timeOffset: string;
}
