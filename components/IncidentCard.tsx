'use client';

import { motion } from 'framer-motion';
import { MapPin, User, Clock, AlertTriangle, CheckCircle, Search, Shield } from 'lucide-react';
import { Incident } from '@/types';

interface IncidentCardProps {
    incident: Incident;
    isRiftMode: boolean;
    onClick: () => void;
    isSelected: boolean;
}

export default function IncidentCard({
    incident,
    isRiftMode,
    onClick,
    isSelected,
}: IncidentCardProps) {
    const formatTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        if (hours > 0) return `${hours}h ago`;
        return `${minutes}m ago`;
    };

    const getThreatColor = (level: string) => {
        const colors = {
            CRITICAL: isRiftMode
                ? 'bg-pink-600 text-white'
                : 'bg-red-600 text-white',
            SEVERE: isRiftMode
                ? 'bg-purple-600 text-white'
                : 'bg-orange-600 text-white',
            MODERATE: isRiftMode
                ? 'bg-indigo-600 text-white'
                : 'bg-yellow-600 text-black',
            LOW: 'bg-blue-600 text-white',
        };
        return colors[level as keyof typeof colors] || 'bg-gray-600 text-white';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <AlertTriangle className="w-3 h-3" />;
            case 'INVESTIGATING':
                return <Search className="w-3 h-3" />;
            case 'CONTAINED':
                return <Shield className="w-3 h-3" />;
            case 'RESOLVED':
                return <CheckCircle className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const getStatusStyle = (status: string) => {
        const styles = {
            ACTIVE: 'text-red-400',
            INVESTIGATING: 'text-yellow-400',
            CONTAINED: 'text-blue-400',
            RESOLVED: 'text-green-400',
        };
        return styles[status as keyof typeof styles] || 'text-gray-400';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.01 }}
            onClick={onClick}
            className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all card-glow
        ${incident.threatLevel === 'CRITICAL' ? 'critical-pulse' : ''}
        ${isSelected
                    ? isRiftMode
                        ? 'bg-rift-bg border-rift-accent shadow-lg shadow-rift-accent/20'
                        : 'bg-montauk-bg-secondary border-montauk-accent shadow-lg shadow-montauk-accent/20'
                    : isRiftMode
                        ? 'bg-rift-bg/50 border-rift-border hover:border-rift-accent/50'
                        : 'bg-montauk-bg-secondary/50 border-montauk-border hover:border-montauk-accent/50'
                }
      `}
        >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getThreatColor(incident.threatLevel)}`}>
                        {incident.threatLevel}
                    </span>
                    <span className={`text-xs font-mono ${isRiftMode ? 'text-rift-accent' : 'text-montauk-accent'}`}>
                        {incident.id}
                    </span>
                </div>
                <div className={`flex items-center gap-1 text-xs ${getStatusStyle(incident.status)}`}>
                    {getStatusIcon(incident.status)}
                    <span className="font-mono">{incident.status}</span>
                </div>
            </div>

            {/* Title */}
            <h3 className={`text-base font-bold mb-2 ${isRiftMode ? 'text-rift-glow' : 'text-montauk-text-primary'}`}>
                {incident.title}
            </h3>

            {/* Meta Row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-70">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{incident.location}</span>
                </div>
                <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{incident.assignee}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(incident.createdAt)}</span>
                </div>
            </div>

            {/* Tags */}
            {incident.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                    {incident.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className={`px-2 py-0.5 rounded text-[10px] ${isRiftMode
                                    ? 'bg-rift-border text-rift-glow'
                                    : 'bg-montauk-border text-montauk-text-dim'
                                }`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

