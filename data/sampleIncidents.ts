import { Incident } from '../types';

export const sampleIncidents: Incident[] = [
    {
        id: 'MNT-001',
        title: 'Temporal Rift Detected - Sector 7',
        description: 'Massive energy spike recorded at Camp Hero. Instruments detecting temporal distortion field expanding at 2m/hr. Multiple witness reports of "time loops" in affected area.',
        location: 'Camp Hero, Montauk Point',
        threatLevel: 'CRITICAL',
        status: 'ACTIVE',
        assignee: 'Dr. Morrison',
        createdAt: Date.now() - 7200000, // 2 hours ago
        tags: ['Temporal', 'Camp Hero', 'Priority Alpha'],
        recommendedAction: 'Initiate Protocol CHRONOS. Evacuate civilians within 5km radius. Deploy containment field generators.',
    },
    {
        id: 'MNT-002',
        title: 'Subject 12 - Psychic Anomaly',
        description: 'Test subject exhibiting uncontrolled psychokinetic events. Lab equipment damaged. Subject sedated but readings remain unstable.',
        location: 'Underground Lab B-4',
        threatLevel: 'SEVERE',
        status: 'INVESTIGATING',
        assignee: 'Agent Chen',
        createdAt: Date.now() - 14400000, // 4 hours ago
        tags: ['Psychic', 'Test Subject', 'Lab Incident'],
        recommendedAction: 'Increase sedation. Prepare isolation chamber. Monitor brainwave patterns.',
    },
    {
        id: 'MNT-003',
        title: 'Radar Ghost - Unidentified Contact',
        description: 'Long-range radar detecting intermittent contact at 40,000 ft. Object exhibits non-Newtonian flight characteristics. Stealth coating suspected.',
        location: 'Montauk Air Station',
        threatLevel: 'MODERATE',
        status: 'INVESTIGATING',
        assignee: 'Lt. Parker',
        createdAt: Date.now() - 28800000, // 8 hours ago
        tags: ['Aerial', 'Unidentified', 'Surveillance'],
        recommendedAction: 'Continue tracking. Do not engage. Prepare intercept squadron on standby.',
    },
    {
        id: 'MNT-004',
        title: 'Power Grid Fluctuation',
        description: 'Unexplained power surges across the facility. Backup generators cycling on/off. Possible connection to temporal experiments.',
        location: 'Main Power Station',
        threatLevel: 'LOW',
        status: 'CONTAINED',
        assignee: 'Tech. Reeves',
        createdAt: Date.now() - 43200000, // 12 hours ago
        tags: ['Infrastructure', 'Power', 'Maintenance'],
        recommendedAction: 'Reroute power through secondary grid. Schedule full diagnostic.',
    },
    {
        id: 'MNT-005',
        title: 'Security Breach - Perimeter Fence',
        description: 'Motion sensors triggered at northern perimeter. Security footage shows distortion/static during incident. No intruder found.',
        location: 'North Perimeter, Gate 7',
        threatLevel: 'MODERATE',
        status: 'RESOLVED',
        assignee: 'Sgt. Williams',
        createdAt: Date.now() - 86400000, // 24 hours ago
        tags: ['Security', 'Perimeter', 'Anomaly'],
        recommendedAction: 'Increase patrols. Review all footage. Check for temporal residue.',
    },
];

// Available assignees
export const assignees = [
    'Dr. Morrison',
    'Agent Chen',
    'Lt. Parker',
    'Tech. Reeves',
    'Sgt. Williams',
    'Dr. Blackwood',
    'Agent Torres',
    'Col. Hayes',
];

// Available locations
export const locations = [
    'Camp Hero, Montauk Point',
    'Underground Lab B-4',
    'Montauk Air Station',
    'Main Power Station',
    'North Perimeter, Gate 7',
    'Research Wing Alpha',
    'Containment Unit C',
    'Communications Center',
    'Director\'s Office',
];
