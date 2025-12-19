import { Incident } from '../types';

export const sampleIncidents: Incident[] = [
    {
        id: 'HWK-001',
        title: 'Demogorgon Sighting - Mirkwood Forest',
        description: 'Multiple witnesses report creature matching previous Demogorgon encounters. Thermal signatures detected moving through forest at high speed. Blood trails found near abandoned vehicles.',
        location: 'Mirkwood Forest, Hawkins',
        threatLevel: 'CRITICAL',
        status: 'ACTIVE',
        assignee: 'Chief Hopper',
        createdAt: Date.now() - 7200000, // 2 hours ago
        tags: ['Demogorgon', 'Upside Down', 'Priority Alpha'],
        recommendedAction: 'Initiate containment protocol. Evacuate civilians within 2-mile radius. Deploy armed response team with flamethrowers.',
    },
    {
        id: 'HWK-002',
        title: 'Eleven - Psychokinetic Event',
        description: 'Subject Eleven exhibiting uncontrolled telekinetic activity. Lab equipment damaged. Multiple power surges detected. Subject appears distressed but stable.',
        location: 'Hawkins Lab - Isolation Chamber',
        threatLevel: 'SEVERE',
        status: 'INVESTIGATING',
        assignee: 'Dr. Owens',
        createdAt: Date.now() - 14400000, // 4 hours ago
        tags: ['Psychic', 'Test Subject', 'Lab Incident'],
        recommendedAction: 'Increase sedation levels. Monitor brainwave patterns. Prepare sensory deprivation tank.',
    },
    {
        id: 'HWK-003',
        title: 'Upside Down Portal - Hawkins Middle School',
        description: 'Dimensional rift detected in basement. Temperature drop of 40°F recorded. Strange organic growth spreading from breach point. Electromagnetic interference affecting all equipment.',
        location: 'Hawkins Middle School - Basement',
        threatLevel: 'CRITICAL',
        status: 'INVESTIGATING',
        assignee: 'Joyce Byers',
        createdAt: Date.now() - 28800000, // 8 hours ago
        tags: ['Portal', 'Upside Down', 'Dimensional Breach'],
        recommendedAction: 'Seal off area immediately. Do not approach portal. Prepare containment field generators.',
    },
    {
        id: 'HWK-004',
        title: 'Power Grid Anomaly - Downtown',
        description: 'Unexplained power fluctuations across entire downtown grid. Lights flickering in synchronized patterns. Possible connection to Upside Down activity.',
        location: 'Hawkins Power Station',
        threatLevel: 'MODERATE',
        status: 'CONTAINED',
        assignee: 'Bob Newby',
        createdAt: Date.now() - 43200000, // 12 hours ago
        tags: ['Infrastructure', 'Power', 'Anomaly'],
        recommendedAction: 'Reroute power through backup systems. Monitor for dimensional interference.',
    },
    {
        id: 'HWK-005',
        title: 'Mind Flayer Presence Detected',
        description: 'Psychic disturbance detected across multiple subjects. Shadow creature sightings reported. Victims describe feeling "watched" and experiencing shared nightmares.',
        location: 'Hawkins - Multiple Locations',
        threatLevel: 'SEVERE',
        status: 'ACTIVE',
        assignee: 'Dr. Brenner',
        createdAt: Date.now() - 86400000, // 24 hours ago
        tags: ['Mind Flayer', 'Psychic', 'Shadow Monster'],
        recommendedAction: 'Initiate mental shielding protocols. Track affected individuals. Prepare for possible possession events.',
    },
    {
        id: 'HWK-006',
        title: 'Demodogs Pack Activity',
        description: 'Pack of 6-8 juvenile Demogorgons spotted near Hawkins Lab perimeter. Hunting pattern observed. One civilian injured but stable.',
        location: 'Hawkins Lab - North Perimeter',
        threatLevel: 'SEVERE',
        status: 'INVESTIGATING',
        assignee: 'Steve Harrington',
        createdAt: Date.now() - 3600000, // 1 hour ago
        tags: ['Demodogs', 'Creature', 'Perimeter Breach'],
        recommendedAction: 'Deploy armed patrol units. Set up motion sensors. Prepare tranquilizer protocols.',
    },
    {
        id: 'HWK-007',
        title: 'Christmas Lights Communication',
        description: 'Anomalous activity detected in residential Christmas light displays. Lights spelling out messages. Possible communication attempt from Upside Down.',
        location: 'Byers Residence',
        threatLevel: 'LOW',
        status: 'RESOLVED',
        assignee: 'Joyce Byers',
        createdAt: Date.now() - 172800000, // 2 days ago
        tags: ['Communication', 'Anomaly', 'Upside Down'],
        recommendedAction: 'Document all messages. Maintain communication channel. Monitor for hostile intent.',
    },
];

// Available assignees
export const assignees = [
    'Chief Hopper',
    'Joyce Byers',
    'Dr. Owens',
    'Dr. Brenner',
    'Steve Harrington',
    'Nancy Wheeler',
    'Jonathan Byers',
    'Bob Newby',
];

// Available locations
export const locations = [
    'Hawkins Lab',
    'Mirkwood Forest',
    'Hawkins Middle School',
    'Hawkins High School',
    'Byers Residence',
    'Hawkins Power Station',
    'Starcourt Mall',
    'The Upside Down',
    'Hawkins Police Station',
    'Castle Byers',
];
