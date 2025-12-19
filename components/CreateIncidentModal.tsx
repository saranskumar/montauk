'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { NewIncidentInput, ThreatLevel } from '@/types';
import { assignees, locations } from '@/data/sampleIncidents';

interface CreateIncidentModalProps {
    isRiftMode: boolean;
    onClose: () => void;
    onSubmit: (data: NewIncidentInput) => void;
}

export default function CreateIncidentModal({
    isRiftMode,
    onClose,
    onSubmit,
}: CreateIncidentModalProps) {
    const [formData, setFormData] = useState<NewIncidentInput>({
        title: '',
        description: '',
        location: locations[0],
        threatLevel: 'MODERATE',
        assignee: assignees[0],
        tags: [],
    });

    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) return;
        onSubmit(formData);
        onClose();
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const inputClass = `
    w-full px-3 py-2 rounded border-2 text-sm font-mono transition-colors
    ${isRiftMode
            ? 'bg-rift-bg border-rift-border text-rift-glow placeholder-rift-accent/50 focus:border-rift-accent'
            : 'bg-montauk-bg border-montauk-border text-montauk-text-primary placeholder-montauk-text-dim focus:border-montauk-accent'
        }
    focus:outline-none
  `;

    const labelClass = `block text-xs uppercase tracking-wider font-bold mb-1 ${isRiftMode ? 'text-rift-accent' : 'text-montauk-accent'
        }`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-lg rounded-lg border-2 overflow-hidden ${isRiftMode ? 'bg-rift-bg border-rift-border' : 'bg-montauk-bg border-montauk-border'
                    }`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b-2 ${isRiftMode ? 'border-rift-border' : 'border-montauk-border'
                    }`}>
                    <h2 className={`flex items-center gap-2 text-lg font-bold ${isRiftMode ? 'text-rift-accent' : 'text-montauk-accent'
                        }`}>
                        <Zap className="w-5 h-5" />
                        LOG NEW INCIDENT
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${isRiftMode ? 'text-rift-glow' : 'text-montauk-text-primary'
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Title */}
                    <div>
                        <label className={labelClass}>Incident Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="Brief description of the incident..."
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            className={inputClass}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>Full Description *</label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Detailed account of the incident..."
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* Location & Threat Level */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Location</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                                className={inputClass}
                            >
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Threat Level</label>
                            <select
                                value={formData.threatLevel}
                                onChange={(e) => setFormData((prev) => ({ ...prev, threatLevel: e.target.value as ThreatLevel }))}
                                className={inputClass}
                            >
                                <option value="CRITICAL">Critical</option>
                                <option value="SEVERE">Severe</option>
                                <option value="MODERATE">Moderate</option>
                                <option value="LOW">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className={labelClass}>Assign To</label>
                        <select
                            value={formData.assignee}
                            onChange={(e) => setFormData((prev) => ({ ...prev, assignee: e.target.value }))}
                            className={inputClass}
                        >
                            {assignees.map((person) => (
                                <option key={person} value={person}>{person}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className={labelClass}>Tags</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add a tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className={`${inputClass} flex-1`}
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className={`px-4 rounded border-2 font-bold ${isRiftMode
                                        ? 'border-rift-accent text-rift-accent hover:bg-rift-accent hover:text-black'
                                        : 'border-montauk-accent text-montauk-accent hover:bg-montauk-accent hover:text-black'
                                    } transition-colors`}
                            >
                                ADD
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        onClick={() => removeTag(tag)}
                                        className={`px-2 py-1 rounded text-xs cursor-pointer ${isRiftMode
                                                ? 'bg-rift-border text-rift-glow hover:bg-rift-danger'
                                                : 'bg-montauk-border text-montauk-text-primary hover:bg-montauk-danger'
                                            } transition-colors`}
                                    >
                                        {tag} ×
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-4 py-2 rounded border-2 font-bold uppercase tracking-wider text-sm transition-colors ${isRiftMode
                                    ? 'border-rift-border text-rift-glow hover:border-rift-accent'
                                    : 'border-montauk-border text-montauk-text-primary hover:border-montauk-accent'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors ${isRiftMode
                                    ? 'bg-rift-accent text-black hover:bg-rift-glow'
                                    : 'bg-montauk-accent text-black hover:bg-montauk-accent-bright'
                                }`}
                        >
                            Log Incident
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

