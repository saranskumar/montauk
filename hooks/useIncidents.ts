import { useState, useEffect, useCallback } from 'react';
import { Incident, NewIncidentInput, IncidentStatus } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { sampleIncidents } from '@/data/sampleIncidents';

export function useIncidents() {
    const [incidents, setIncidents] = useLocalStorage<Incident[]>('montauk-incidents', []);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize with sample data if empty
    useEffect(() => {
        if (incidents.length === 0 && !isLoaded) {
            setIncidents(sampleIncidents);
        }
        setIsLoaded(true);
    }, [incidents, isLoaded, setIncidents]);

    // Generate unique ID
    const generateId = useCallback(() => {
        const count = incidents.length + 1;
        return `MNT-${String(count).padStart(3, '0')}`;
    }, [incidents.length]);

    // Add new incident
    const addIncident = useCallback((input: NewIncidentInput) => {
        const newIncident: Incident = {
            ...input,
            id: generateId(),
            status: 'ACTIVE',
            createdAt: Date.now(),
            recommendedAction: 'Investigate and assess threat level.',
        };
        setIncidents((prev) => [newIncident, ...prev]);
        return newIncident;
    }, [generateId, setIncidents]);

    // Update incident status
    const updateStatus = useCallback((id: string, status: IncidentStatus) => {
        setIncidents((prev) =>
            prev.map((inc) =>
                inc.id === id ? { ...inc, status } : inc
            )
        );
    }, [setIncidents]);

    // Update full incident
    const updateIncident = useCallback((id: string, updates: Partial<Incident>) => {
        setIncidents((prev) =>
            prev.map((inc) =>
                inc.id === id ? { ...inc, ...updates } : inc
            )
        );
    }, [setIncidents]);

    // Delete incident
    const deleteIncident = useCallback((id: string) => {
        setIncidents((prev) => prev.filter((inc) => inc.id !== id));
    }, [setIncidents]);

    // Resolve all critical incidents (for secret code)
    const resolveAllCritical = useCallback(() => {
        let count = 0;
        setIncidents((prev) =>
            prev.map((inc) => {
                if (inc.threatLevel === 'CRITICAL' && inc.status !== 'RESOLVED') {
                    count++;
                    return { ...inc, status: 'RESOLVED' as IncidentStatus };
                }
                return inc;
            })
        );
        return count;
    }, [setIncidents]);

    // Get threat stats
    const threatStats = incidents.reduce(
        (acc, inc) => {
            acc[inc.threatLevel]++;
            return acc;
        },
        { CRITICAL: 0, SEVERE: 0, MODERATE: 0, LOW: 0 }
    );

    return {
        incidents,
        addIncident,
        updateStatus,
        updateIncident,
        deleteIncident,
        resolveAllCritical,
        threatStats,
        isLoaded,
    };
}

