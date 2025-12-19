// Threat Level Types
export type ThreatLevel = 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'LOW';

// Incident Status Types
export type IncidentStatus = 'ACTIVE' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';

// Main Incident Interface
export interface Incident {
    id: string;
    title: string;
    description: string;
    location: string;
    threatLevel: ThreatLevel;
    status: IncidentStatus;
    assignee: string;
    createdAt: number;
    tags: string[];
    recommendedAction?: string;
}

// Form Input for Creating New Incidents
export interface NewIncidentInput {
    title: string;
    description: string;
    location: string;
    threatLevel: ThreatLevel;
    assignee: string;
    tags: string[];
}

// Filter State
export interface FilterState {
    search: string;
    threatLevel: ThreatLevel | 'ALL';
    status: IncidentStatus | 'ALL';
    sortBy: 'newest' | 'oldest' | 'priority';
}

// Toast Notification
export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
}
