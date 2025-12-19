'use client';

import { Search } from 'lucide-react';
import { FilterState, ThreatLevel, IncidentStatus } from '@/types';

interface FilterBarProps {
    filters: FilterState;
    onFilterChange: (filters: Partial<FilterState>) => void;
    isUpsideDownMode: boolean;
}

export default function FilterBar({ filters, onFilterChange, isUpsideDownMode }: FilterBarProps) {
    const inputClass = `
    px-3 py-2 rounded text-sm font-mono border-2 transition-colors
    ${isUpsideDownMode
            ? 'bg-upside-down-bg border-upside-down-border text-upside-down-glow placeholder-rift-accent/50 focus:border-upside-down-accent'
            : 'bg-hawkins-bg-secondary border-hawkins-border text-hawkins-text-primary placeholder-montauk-text-dim focus:border-hawkins-accent'
        }
    focus:outline-none
  `;

    return (
        <div className={`p-4 rounded-lg border-2 mb-4 ${isUpsideDownMode ? 'bg-upside-down-bg/50 border-upside-down-border' : 'bg-hawkins-bg-secondary/50 border-hawkins-border'
            }`}>
            <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                        }`} />
                    <input
                        type="text"
                        placeholder="Search incidents..."
                        value={filters.search}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        className={`${inputClass} w-full pl-10`}
                    />
                </div>

                {/* Threat Level Filter */}
                <select
                    value={filters.threatLevel}
                    onChange={(e) => onFilterChange({ threatLevel: e.target.value as ThreatLevel | 'ALL' })}
                    className={inputClass}
                >
                    <option value="ALL">All Threats</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="SEVERE">Severe</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="LOW">Low</option>
                </select>

                {/* Status Filter */}
                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange({ status: e.target.value as IncidentStatus | 'ALL' })}
                    className={inputClass}
                >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INVESTIGATING">Investigating</option>
                    <option value="CONTAINED">Contained</option>
                    <option value="RESOLVED">Resolved</option>
                </select>

                {/* Sort By */}
                <select
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value as 'newest' | 'oldest' | 'priority' })}
                    className={inputClass}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">By Priority</option>
                </select>
            </div>
        </div>
    );
}

