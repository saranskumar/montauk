'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import BootSequence from '@/components/BootSequence';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import IncidentList from '@/components/IncidentList';
import IncidentPanel from '@/components/IncidentPanel';
import CreateIncidentModal from '@/components/CreateIncidentModal';
import { ToastContainer, useToasts } from '@/components/Toast';
import Scanlines from '@/components/effects/Scanlines';
import Particles from '@/components/effects/Particles';
import SignalCalibrator from '@/components/signal/SignalCalibrator';
import SignalWaveWatermark from '@/components/SignalWaveWatermark';
import GlitchEffect from '@/components/effects/GlitchEffect';
import AudioController from '@/components/effects/AudioController';

// Hooks
import { useIncidents } from '@/hooks/useIncidents';
import { useSecretCode } from '@/hooks/useSecretCode';

// Types
import type { Incident, FilterState, NewIncidentInput } from '@/types';

export default function Home() {
  // State
  const [booting, setBooting] = useState(true);
  const [isUpsideDownMode, setIsUpsideDownMode] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignalCalibrator, setShowSignalCalibrator] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    threatLevel: 'ALL',
    status: 'ALL',
    sortBy: 'newest',
  });

  // Hooks
  const {
    incidents,
    addIncident,
    updateStatus,
    resolveAllCritical,
    threatStats,
  } = useIncidents();
  const { toasts, showToast, dismissToast } = useToasts();
  const secretTriggered = useSecretCode('HAWKINS');

  // Handle secret code
  useEffect(() => {
    if (secretTriggered) {
      const count = resolveAllCritical();
      if (count > 0) {
        showToast(`TEMPORAL PURGE: ${count} CRITICAL ANOMALIES NEUTRALIZED`, 'success');
      } else {
        showToast('TEMPORAL PURGE: NO ACTIVE CRITICAL ANOMALIES', 'info');
      }
    }
  }, [secretTriggered, resolveAllCritical, showToast]);

  // Keyboard shortcuts
  useEffect(() => {
    if (booting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // U - Toggle Upside Down Mode
      if (e.key.toLowerCase() === 'u') {
        setIsUpsideDownMode((prev) => !prev);
      }

      // N - New Incident
      if (e.key.toLowerCase() === 'n') {
        setShowCreateModal(true);
      }

      // C - Signal Calibrator
      if (e.key.toLowerCase() === 'c') {
        setShowSignalCalibrator(true);
      }

      // Escape - Close panels
      if (e.key === 'Escape') {
        setSelectedIncident(null);
        setShowCreateModal(false);
        setShowSignalCalibrator(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [booting]);

  // Apply upside down mode class to root
  useEffect(() => {
    const root = document.documentElement;
    if (isUpsideDownMode) {
      root.classList.add('upside-down-mode');
    } else {
      root.classList.remove('upside-down-mode');
    }
  }, [isUpsideDownMode]);

  // Handlers
  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCreateIncident = useCallback((data: NewIncidentInput) => {
    const newIncident = addIncident(data);
    showToast(`INCIDENT ${newIncident.id} LOGGED TO MAINFRAME`, 'success');

    if (data.threatLevel === 'CRITICAL') {
      showToast(`⚠️ CRITICAL THREAT DETECTED`, 'warning');
    }
  }, [addIncident, showToast]);

  const handleUpdateStatus = useCallback((id: string, status: Incident['status']) => {
    updateStatus(id, status);
    showToast(`STATUS UPDATED: ${status}`, 'success');

    // Update selected incident if it's the one being modified
    setSelectedIncident((prev) =>
      prev?.id === id ? { ...prev, status } : prev
    );
  }, [updateStatus, showToast]);

  // Boot sequence
  if (booting) {
    return <BootSequence onComplete={() => setBooting(false)} />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${isUpsideDownMode ? 'bg-upside-down-bg' : 'bg-hawkins-bg'
        }`}
    >
      {/* Visual Effects */}
      {/* <Scanlines /> */}
      {/* <div className="scanline-effect" /> */}
      {isUpsideDownMode && <Particles isUpsideDownMode={isUpsideDownMode} />}

      {/* Upside Down Glitch Effect */}
      <GlitchEffect isActive={isUpsideDownMode} />
      <AudioController isActive={true} isUpsideDownMode={isUpsideDownMode} />

      {/* Secret Code Flash Effect */}
      <AnimatePresence>
        {secretTriggered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-white mix-blend-difference pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        isUpsideDownMode={isUpsideDownMode}
        onToggleUpsideDown={() => setIsUpsideDownMode((prev) => !prev)}
        onCreateIncident={() => setShowCreateModal(true)}
        threatStats={threatStats}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          isUpsideDownMode={isUpsideDownMode}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident List */}
          <div className={`lg:col-span-2 ${selectedIncident ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <IncidentList
              incidents={incidents}
              filters={filters}
              selectedId={selectedIncident?.id || null}
              onSelectIncident={setSelectedIncident}
              isUpsideDownMode={isUpsideDownMode}
            />
          </div>
        </div>
      </main>

      {/* Incident Details Panel */}
      <AnimatePresence>
        {selectedIncident && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIncident(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <IncidentPanel
              incident={selectedIncident}
              isUpsideDownMode={isUpsideDownMode}
              onClose={() => setSelectedIncident(null)}
              onUpdateStatus={handleUpdateStatus}
            />
          </>
        )}
      </AnimatePresence>

      {/* Create Incident Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateIncidentModal
            isUpsideDownMode={isUpsideDownMode}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateIncident}
          />
        )}
      </AnimatePresence>

      {/* Signal Calibrator */}
      <AnimatePresence>
        {showSignalCalibrator && (
          <SignalCalibrator
            isUpsideDownMode={isUpsideDownMode}
            onClose={() => setShowSignalCalibrator(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        isUpsideDownMode={isUpsideDownMode}
      />

      {/* Signal Wave Watermark */}
      <SignalWaveWatermark isUpsideDownMode={isUpsideDownMode} />

      {/* Keyboard Shortcuts Hint */}
      <div className={`fixed bottom-4 left-4 z-30 text-[10px] opacity-40 select-none flex gap-4 ${isUpsideDownMode ? 'text-upside-down-glow' : 'text-hawkins-text-dim'
        }`}>
        <span>PRESS 'U' TO TOGGLE UPSIDE DOWN MODE</span>
        <span>PRESS 'C' FOR SIGNAL CALIBRATOR</span>
        <span>PRESS 'N' TO LOG INCIDENT</span>
        <span>TYPE 'HAWKINS' FOR TEMPORAL PURGE</span>
      </div>
    </div>
  );
}
