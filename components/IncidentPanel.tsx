'use client';

import { motion } from 'framer-motion';
import { X, MapPin, User, Clock, Tag, FileText, AlertTriangle, CheckCircle, Search, Shield } from 'lucide-react';
import { Incident, IncidentStatus } from '@/types';

interface IncidentPanelProps {
    incident: Incident;
    isRiftMode: boolean;
    onClose: () => void;
    onUpdateStatus: (id: string, status: IncidentStatus) => void;
}

export default function IncidentPanel({
    incident,
    isRiftMode,
    onClose,
    onUpdateStatus,
}: IncidentPanelProps) {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const getThreatColor = (level: string) => {
        const colors = {
            CRITICAL: 'text-red-400 border-red-400',
            SEVERE: 'text-orange-400 border-orange-400',
            MODERATE: 'text-yellow-400 border-yellow-400',
            LOW: 'text-blue-400 border-blue-400',
        };
        return colors[level as keyof typeof colors] || 'text-gray-400 border-gray-400';
    };

    const statusButtons: { status: IncidentStatus; icon: React.ReactNode; label: string }[] = [
        { status: 'ACTIVE', icon: <AlertTriangle className="w-4 h-4" />, label: 'Active' },
        { status: 'INVESTIGATING', icon: <Search className="w-4 h-4" />, label: 'Investigating' },
        { status: 'CONTAINED', icon: <Shield className="w-4 h-4" />, label: 'Contained' },
        { status: 'RESOLVED', icon: <CheckCircle className="w-4 h-4" />, label: 'Resolved' },
    ];

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 h-full w-full max-w-lg z-50 overflow-y-auto border-l-2 ${isRiftMode
                    ? 'bg-rift-bg border-rift-border'
                    : 'bg-montauk-bg border-montauk-border'
                }`}
        >
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b-2 ${isRiftMode ? 'bg-rift-bg border-rift-border' : 'bg-montauk-bg border-montauk-border'
                }`}>
                <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold ${isRiftMode ? 'text-rift-accent' : 'text-montauk-accent'}`}>
                        {incident.id}
                    </span>
                    <span className={`px-2 py-0.5 border rounded text-xs font-bold ${getThreatColor(incident.threatLevel)}`}>
                        {incident.threatLevel}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2 rounded hover:bg-white/10 transition-colors ${isRiftMode ? 'text-rift-glow' : 'text-montauk-text-primary'
                        }`}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Title */}
                <h2 className={`text-xl font-bold ${isRiftMode ? 'text-rift-glow' : 'text-montauk-text-primary'}`}>
                    {incident.title}
                </h2>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                        icon={<MapPin className="w-4 h-4" />}
                        label="Location"
                        value={incident.location}
                        isRiftMode={isRiftMode}
                    />
                    <InfoItem
                        icon={<User className="w-4 h-4" />}
                        label="Assigned To"
                        value={incident.assignee}
                        isRiftMode={isRiftMode}
                    />
                    <InfoItem
                        icon={<Clock className="w-4 h-4" />}
                        label="Reported"
                        value={formatDate(incident.createdAt)}
                        isRiftMode={isRiftMode}
                    />
                    <InfoItem
                        icon={<Tag className="w-4 h-4" />}
                        label="Tags"
                        value={incident.tags.join(', ')}
                        isRiftMode={isRiftMode}
                    />
                </div>

                {/* Description */}
                <div>
                    <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 ${isRiftMode ? 'text-rift-accent' : 'text-montauk-accent'
                        }`}>
                        <FileText className="w-4 h-4" />
                        Description
                    </h3>
                    <p className={`text-sm leading-relaxed ${isRiftMode ? 'text-rift-glow/80' : 'text-montauk-text-primary/80'}`}>
                        {incident.description}
                    </p>
                </div>

                {/* Recommended Action */}
                {incident.recommendedAction && (
                    <div className={`p-4 rounded border-2 ${isRiftMode ? 'bg-rift-border/20 border-rift-border' : 'bg-montauk-border/20 border-montauk-border'
                        }`}>
                        <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 ${isRiftMode ? 'text-rift-danger' : 'text-montauk-danger'
                            }`}>
                            <AlertTriangle className="w-4 h-4" />
                            Recommended Action
                        </h3>
                        <p className={`text-sm ${isRiftMode ? 'text-rift-glow/80' : 'text-montauk-text-primary/80'}`}>
                            {incident.recommendedAction}
                        </p>
                    </div>
                )}

                {/* Status Update Buttons */}
                <div>
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isRiftMode ? 'text-rift-accent' : 'text-montauk-accent'
                        }`}>
                        Update Status
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {statusButtons.map(({ status, icon, label }) => (
                            <button
                                key={status}
                                onClick={() => onUpdateStatus(incident.id, status)}
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded border-2 text-sm font-bold uppercase transition-all ${incident.status === status
                                        ? isRiftMode
                                            ? 'bg-rift-accent text-black border-rift-accent'
                                            : 'bg-montauk-accent text-black border-montauk-accent'
                                        : isRiftMode
                                            ? 'bg-transparent border-rift-border text-rift-glow hover:border-rift-accent'
                                            : 'bg-transparent border-montauk-border text-montauk-text-primary hover:border-montauk-accent'
                                    }`}
                            >
                                {icon}
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    isRiftMode: boolean;
}

function InfoItem({ icon, label, value, isRiftMode }: InfoItemProps) {
    return (
        <div>
            <div className={`flex items-center gap-1 text-[10px] uppercase tracking-wider mb-1 ${isRiftMode ? 'text-rift-accent/60' : 'text-montauk-text-dim'
                }`}>
                {icon}
                {label}
            </div>
            <div className={`text-sm ${isRiftMode ? 'text-rift-glow' : 'text-montauk-text-primary'}`}>
                {value}
            </div>
        </div>
    );
}

