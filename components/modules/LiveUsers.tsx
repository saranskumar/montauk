'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveUsersProps {
    isUpsideDownMode: boolean;
}

interface User {
    id: string;
    name: string;
    role: string;
    location: string;
    status: 'ACTIVE' | 'OFFLINE' | 'MIA' | 'BREACH';
    clearance: number;
}

interface LogEntry {
    id: number;
    timestamp: string;
    message: string;
    type: 'info' | 'warning' | 'error';
}

const personnelData: User[] = [
    { id: 'HNL-892', name: 'DR. MARTIN', role: 'SENIOR SCIENTIST', location: 'CONTROL ROOM', status: 'ACTIVE', clearance: 4 },
    { id: 'HNL-231', name: 'TECH. LEWIS', role: 'MAINTENANCE', location: 'SUBSTATION', status: 'ACTIVE', clearance: 2 },
    { id: 'HNL-744', name: 'MP. CARTER', role: 'SECURITY', location: 'PERIMETER', status: 'ACTIVE', clearance: 3 },
    { id: 'HNL-112', name: 'DR. BRENNER', role: 'DIRECTOR', location: 'THE TANK', status: 'ACTIVE', clearance: 5 },
    { id: 'HNL-558', name: 'SUBJ. 008', role: 'TEST SUBJECT', location: 'UNKNOWN', status: 'MIA', clearance: 1 },
    { id: 'HNL-901', name: 'MP. DANIELS', role: 'SECURITY', location: 'GATE ROOM', status: 'ACTIVE', clearance: 3 },
    { id: 'HNL-334', name: 'RSCH. EVANS', role: 'ANALYST', location: 'ARCHIVES', status: 'ACTIVE', clearance: 2 },
];

const LOCATIONS = ['CONTROL ROOM', 'SUBSTATION', 'THE GATE', 'THE TANK', 'LABORATORY B', 'PERIMETER', 'ARCHIVES', 'CAFETERIA', 'UPSIDE DOWN (UNCERTAIN)'];

export default function LiveUsers({ isUpsideDownMode }: LiveUsersProps) {
    const [scannedUsers, setScannedUsers] = useState<User[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // Form State
    const [traceName, setTraceName] = useState('');
    const [traceDimension, setTraceDimension] = useState<'REAL' | 'UPSIDE_DOWN'>('REAL');
    const [traceLocation, setTraceLocation] = useState(LOCATIONS[0]);
    const [customLocation, setCustomLocation] = useState('');
    const [isAddingCustom, setIsAddingCustom] = useState(false);

    // Theme colors
    const primaryColor = isUpsideDownMode ? 'text-red-500' : 'text-green-500';
    const dimColor = isUpsideDownMode ? 'text-red-900' : 'text-green-900';
    const borderColor = isUpsideDownMode ? 'border-red-900' : 'border-green-900';
    const glowColor = isUpsideDownMode ? 'shadow-red-500/20' : 'shadow-green-500/20';
    const bgColor = isUpsideDownMode ? 'bg-red-950/10' : 'bg-green-950/10';

    // Simulate scanning effect
    useEffect(() => {
        let mounted = true;

        const scan = () => {
            if (!mounted) return;
            // Only shuffle occasionally to keep list somewhat stable
            if (Math.random() > 0.7) {
                setScannedUsers(prev => {
                    if (prev.length === 0) return [...personnelData];
                    const shuffled = [...prev].sort(() => Math.random() - 0.5);
                    return shuffled;
                });
            } else if (scannedUsers.length === 0) {
                setScannedUsers([...personnelData]);
            }

            // Add a random log
            const actions = ['SIGNAL DETECTED', 'PING RECEIVED', 'PACKET LOSS', 'ENCRYPTION HANDSHAKE', 'ROUTING DATA'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const newLog: LogEntry = {
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                message: `${action} [SEC-${Math.floor(Math.random() * 9) + 1}]`,
                type: Math.random() > 0.8 ? 'warning' : 'info'
            };

            setLogs(prev => [newLog, ...prev].slice(0, 10));
        };

        const interval = setInterval(scan, 3000);
        scan(); // Initial scan

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    const handleAddTrace = () => {
        if (!traceName) return;

        const location = isAddingCustom ? customLocation.toUpperCase() : traceLocation;
        const newId = `TRC-${Math.floor(Math.random() * 900) + 100}`;

        const newUser: User = {
            id: newId,
            name: traceName.toUpperCase(),
            role: 'MANUAL TRACE',
            location: traceDimension === 'UPSIDE_DOWN' ? `[UPSIDE DOWN] ${location}` : location,
            status: traceDimension === 'UPSIDE_DOWN' ? 'BREACH' : 'ACTIVE',
            clearance: 0
        };

        setScannedUsers(prev => [newUser, ...prev]);

        // Reset Form
        setTraceName('');
        setCustomLocation('');
        setIsAddingCustom(false);
        setTraceLocation(LOCATIONS[0]);

        // Log confirmation
        setLogs(prev => [{
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            message: `MANUAL TRACE INITIATED: ${newId}`,
            type: 'warning'
        }, ...prev]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Personnel List */}
            <div className={`lg:col-span-2 border-2 ${borderColor} ${bgColor} relative overflow-hidden flex flex-col`}>
                <div className={`border-b ${borderColor} bg-black/50 p-2 flex justify-between items-center`}>
                    <div className={`font-mono text-sm ${primaryColor} flex items-center gap-2`}>
                        <span className="animate-pulse">●</span>
                        ACTIVE PERSONNEL TRACKING
                    </div>
                    <div className={`font-mono text-xs ${dimColor}`}>
                        SCANNING FREQ: 14.5 MHz
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    <table className="w-full text-left font-mono text-xs md:text-sm border-separate border-spacing-y-2">
                        <thead>
                            <tr className={dimColor}>
                                <th className="px-2">ID</th>
                                <th className="px-2">NAME</th>
                                <th className="px-2">ROLE</th>
                                <th className="px-2">LOC</th>
                                <th className="px-2">CLR</th>
                                <th className="px-2">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scannedUsers.map(user => (
                                <tr key={user.id} className={`${primaryColor} hover:bg-white/5 transition-colors cursor-default`}>
                                    <td className="px-2 opacity-70">{user.id}</td>
                                    <td className="px-2 font-bold">{user.name}</td>
                                    <td className="px-2">{user.role}</td>
                                    <td className="px-2">{user.location}</td>
                                    <td className="px-2 text-center">{user.clearance}</td>
                                    <td className="px-2">
                                        <span className={`px-1 py-0.5 rounded text-[10px] ${user.status === 'ACTIVE' ? 'bg-green-900/50 text-green-400' :
                                                user.status === 'BREACH' ? 'bg-red-900/50 text-red-400 animate-pulse' :
                                                    user.status === 'MIA' ? 'bg-yellow-900/50 text-yellow-400' :
                                                        'bg-gray-800 text-gray-400'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Decorative Bottom */}
                <div className={`border-t ${borderColor} bg-black/50 px-4 py-1 text-[10px] font-mono ${dimColor} flex justify-between`}>
                    <span>TOTAL: {scannedUsers.length}</span>
                    <span>UPDATED: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Sidebar: Stats & Form */}
            <div className="flex flex-col gap-6">

                {/* Manual Trace Form */}
                <div className={`border-2 ${borderColor} ${bgColor} overflow-hidden flex flex-col`}>
                    <div className={`border-b ${borderColor} bg-black/50 p-2 font-mono text-xs ${primaryColor} font-bold`}>
                        MANUAL SIGNAL TRACE
                    </div>
                    <div className="p-4 space-y-4 font-mono text-xs">

                        {/* Name Input */}
                        <div className="space-y-1">
                            <label className={dimColor}>SUBJECT IDENTIFIER</label>
                            <input
                                type="text"
                                value={traceName}
                                onChange={(e) => setTraceName(e.target.value)}
                                placeholder="ENTER NAME/ID..."
                                className={`w-full bg-black/50 border ${borderColor} ${primaryColor} px-2 py-1 focus:outline-none focus:border-opacity-100 placeholder-opacity-30 placeholder-${isUpsideDownMode ? 'red-500' : 'green-500'}`}
                            />
                        </div>

                        {/* Dimension Radio */}
                        <div className="space-y-1">
                            <label className={dimColor}>DIMENSION PLANE</label>
                            <div className="flex gap-4">
                                <label className={`flex items-center gap-2 cursor-pointer ${primaryColor}`}>
                                    <input
                                        type="radio"
                                        name="dimension"
                                        checked={traceDimension === 'REAL'}
                                        onChange={() => setTraceDimension('REAL')}
                                        className="appearance-none w-3 h-3 border border-current rounded-none checked:bg-current"
                                    />
                                    REAL
                                </label>
                                <label className={`flex items-center gap-2 cursor-pointer ${primaryColor}`}>
                                    <input
                                        type="radio"
                                        name="dimension"
                                        checked={traceDimension === 'UPSIDE_DOWN'}
                                        onChange={() => setTraceDimension('UPSIDE_DOWN')}
                                        className="appearance-none w-3 h-3 border border-current rounded-none checked:bg-current"
                                    />
                                    UPSIDE DOWN
                                </label>
                            </div>
                        </div>

                        {/* Location Select */}
                        <div className="space-y-1">
                            <label className={dimColor}>SIGNAL ORIGIN</label>
                            {!isAddingCustom ? (
                                <div className="flex gap-2">
                                    <select
                                        value={traceLocation}
                                        onChange={(e) => setTraceLocation(e.target.value)}
                                        className={`flex-1 bg-black/50 border ${borderColor} ${primaryColor} px-2 py-1 focus:outline-none text-xs`}
                                    >
                                        {LOCATIONS.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => setIsAddingCustom(true)}
                                        className={`px-2 border ${borderColor} ${primaryColor} hover:bg-white/10`}
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customLocation}
                                        onChange={(e) => setCustomLocation(e.target.value)}
                                        placeholder="ENTER LOCATION..."
                                        className={`flex-1 bg-black/50 border ${borderColor} ${primaryColor} px-2 py-1 focus:outline-none text-xs`}
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setIsAddingCustom(false)}
                                        className={`px-2 border ${borderColor} ${primaryColor} hover:bg-white/10`}
                                    >
                                        x
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleAddTrace}
                            disabled={!traceName}
                            className={`w-full py-2 border ${borderColor} ${primaryColor} font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2`}
                        >
                            INITIATE TRACKING sequence
                        </button>
                    </div>
                </div>

                {/* Network Activity Log - Moved to bottom right */}
                <div className={`flex-1 border-2 ${borderColor} ${bgColor} overflow-hidden flex flex-col`}>

                    <div className={`border-b ${borderColor} bg-black/50 p-2 font-mono text-xs ${primaryColor}`}>
                        NETWORK ACTIVITY
                    </div>
                    <div className="flex-1 p-2 font-mono text-xs overflow-hidden relative">
                        {/* Matrix rain effect simplified */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{ backgroundImage: `linear-gradient(0deg, transparent 24%, ${isUpsideDownMode ? '#700' : '#070'} 25%, ${isUpsideDownMode ? '#700' : '#070'} 26%, transparent 27%, transparent 74%, ${isUpsideDownMode ? '#700' : '#070'} 75%, ${isUpsideDownMode ? '#700' : '#070'} 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ${isUpsideDownMode ? '#700' : '#070'} 25%, ${isUpsideDownMode ? '#700' : '#070'} 26%, transparent 27%, transparent 74%, ${isUpsideDownMode ? '#700' : '#070'} 75%, ${isUpsideDownMode ? '#700' : '#070'} 76%, transparent 77%, transparent)`, backgroundSize: '30px 30px' }}
                        />

                        <div className="space-y-1 relative z-10">
                            <AnimatePresence>
                                {logs.map(log => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`flex gap-2 ${log.type === 'warning' ? 'text-yellow-500' :
                                            log.type === 'error' ? 'text-red-500' :
                                                primaryColor
                                            }`}
                                    >
                                        <span className="opacity-50">[{log.timestamp}]</span>
                                        <span>{log.message}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* System Stats Mockup */}
                <div className={`h-1/3 border-2 ${borderColor} ${bgColor} p-4 flex flex-col justify-center gap-4`}>
                    <div>
                        <div className={`flex justify-between text-xs font-mono mb-1 ${primaryColor}`}>
                            <span>CPU LOAD</span>
                            <span>88%</span>
                        </div>
                        <div className="h-2 bg-black border border-gray-800">
                            <div className={`h-full w-[88%] ${isUpsideDownMode ? 'bg-red-600' : 'bg-green-600'} animate-pulse`}></div>
                        </div>
                    </div>
                    <div>
                        <div className={`flex justify-between text-xs font-mono mb-1 ${primaryColor}`}>
                            <span>MEMORY</span>
                            <span>640KB / 1024KB</span>
                        </div>
                        <div className="h-2 bg-black border border-gray-800">
                            <div className={`h-full w-[62%] ${isUpsideDownMode ? 'bg-red-600' : 'bg-green-600'}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
