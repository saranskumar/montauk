'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';
import IncidentCard from './IncidentCard';
import { Incident, FilterState } from '@/types';

interface IncidentListProps {
    incidents: Incident[];
    filters: FilterState;
    selectedId: string | null;
    onSelectIncident: (incident: Incident) => void;
    isUpsideDownMode: boolean;
}

export default function IncidentList({
    incidents,
    filters,
    selectedId,
    onSelectIncident,
    isUpsideDownMode,
}: IncidentListProps) {
    // Apply filters and sorting
    const filteredIncidents = useMemo(() => {
        let result = [...incidents];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (inc) =>
                    inc.title.toLowerCase().includes(searchLower) ||
                    inc.location.toLowerCase().includes(searchLower) ||
                    inc.id.toLowerCase().includes(searchLower) ||
                    inc.description.toLowerCase().includes(searchLower)
            );
        }

        // Threat level filter
        if (filters.threatLevel !== 'ALL') {
            result = result.filter((inc) => inc.threatLevel === filters.threatLevel);
        }

        // Status filter
        if (filters.status !== 'ALL') {
            result = result.filter((inc) => inc.status === filters.status);
        }

        // Sorting
        result.sort((a, b) => {
            if (filters.sortBy === 'newest') {
                return b.createdAt - a.createdAt;
            }
            if (filters.sortBy === 'oldest') {
                return a.createdAt - b.createdAt;
            }
            if (filters.sortBy === 'priority') {
                const priority = { CRITICAL: 4, SEVERE: 3, MODERATE: 2, LOW: 1 };
                return priority[b.threatLevel] - priority[a.threatLevel];
            }
            return 0;
        });

        return result;
    }, [incidents, filters]);

    if (filteredIncidents.length === 0) {
        return (
            <div
                className={`flex flex-col items-center justify-center py-16 rounded-lg border-2 ${isUpsideDownMode
                        ? 'bg-upside-down-bg/30 border-upside-down-border text-upside-down-accent'
                        : 'bg-hawkins-bg-secondary/30 border-hawkins-border text-hawkins-text-dim'
                    }`}
            >
                <Inbox className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-mono uppercase tracking-wider">No Anomalies Detected</p>
                <p className="text-sm opacity-60 mt-2">Adjust filters or create a new incident</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <AnimatePresence mode="popLayout">
                {filteredIncidents.map((incident) => (
                    <IncidentCard
                        key={incident.id}
                        incident={incident}
                        isUpsideDownMode={isUpsideDownMode}
                        isSelected={selectedId === incident.id}
                        onClick={() => onSelectIncident(incident)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

