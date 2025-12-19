import { useState, useEffect, useCallback } from 'react';

export function useSecretCode(targetCode: string): boolean {
    const [triggered, setTriggered] = useState(false);
    const [buffer, setBuffer] = useState('');

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Ignore if typing in input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return;
        }

        const key = e.key.toUpperCase();

        // Only track letter keys
        if (key.length === 1 && /[A-Z]/.test(key)) {
            setBuffer((prev) => {
                const newBuffer = (prev + key).slice(-targetCode.length);

                if (newBuffer === targetCode.toUpperCase()) {
                    setTriggered(true);
                    return '';
                }

                return newBuffer;
            });
        }
    }, [targetCode]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Reset triggered after a short delay
    useEffect(() => {
        if (triggered) {
            const timer = setTimeout(() => setTriggered(false), 500);
            return () => clearTimeout(timer);
        }
    }, [triggered]);

    return triggered;
}

