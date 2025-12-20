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
import Terminal from '@/components/Terminal';
import TabNavigation from '@/components/TabNavigation';
import RetroTerminalFrame from '@/components/layout/RetroTerminalFrame';
import RetroMenu from '@/components/navigation/RetroMenu';
import LiveUsers from '@/components/modules/LiveUsers';
import SectorMap from '@/components/modules/SectorMap';
import MiniSignalWave from '@/components/modules/MiniSignalWave';
import MiniThreatStats from '@/components/modules/MiniThreatStats';

// Hooks
import { useIncidents } from '@/hooks/useIncidents';
import { useSecretCode } from '@/hooks/useSecretCode';

// Types
import type { Incident, FilterState, NewIncidentInput } from '@/types';

export default function Home() {
  // State
  const [booting, setBooting] = useState(true);
  const [isUpsideDownMode, setIsUpsideDownMode] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('INCIDENTS'); // Trigger for transition effect
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
    resolveAll,
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
        setGlitchTrigger(prev => prev + 1);
      }

      // N - New Incident
      if (e.key.toLowerCase() === 'n') {
        setShowCreateModal(true);
      }

      // C - Signal Calibrator
      if (e.key.toLowerCase() === 'c') {
        setShowSignalCalibrator(prev => !prev);
      }

      // Arrow Keys - Navigate Tabs
      if (e.key === 'ArrowRight') {
        setActiveTab(prev => {
          if (prev === 'INCIDENTS') return 'LIVE_USERS';
          if (prev === 'LIVE_USERS') return 'MAPS_BEACON';
          if (prev === 'MAPS_BEACON') return 'CMD';
          return 'INCIDENTS';
        });
      }
      if (e.key === 'ArrowLeft') {
        setActiveTab(prev => {
          if (prev === 'INCIDENTS') return 'CMD';
          if (prev === 'LIVE_USERS') return 'INCIDENTS';
          if (prev === 'MAPS_BEACON') return 'LIVE_USERS';
          return 'MAPS_BEACON'; // CMD -> MAPS
        });
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

  // Terminal command handler
  const handleTerminalCommand = useCallback((command: string) => {
    const cmd = command.toUpperCase();

    // Slash Commands
    if (cmd === '/HELP' || cmd === 'HELP') {
      return `
HAWKINS NATIONAL LABORATORY
TERMINAL OS v1.984 - COMMAND REFERENCE
========================================

SYSTEM COMMANDS:
  /INCIDENT   Launch the classified Incident Reporting Protocol.
              Usage: Opens the Level 4 secure form overlay.

  /STAT       Display current Threat Matrix analytics.
              Returns: Critical/Severe/Moderate/Low counts.

  /DOOM       [SIMULATION MODE] Execute Code Red neutralization protocols.
              Effect: Resolves all active entities on the radar.
              WARNING: For drill purposes only.

  /HELP       Display this reference manual.

SHORTCUTS (KEYBOARD):
  [U]         Toggle Dimensional Rift (Upside Down Mode)
  [C]         Toggle Signal Calibrator Overlay
  [N]         Quick Launch Incident Report
  [ARROWS]    Navigate System Tabs

STATUS: ONLINE
SECURE CONNECTION ESTABLISHED`;
    }

    if (cmd === '/INCIDENT') {
      setShowCreateModal(true);
      return 'LAUNCHING INCIDENT REPORT PROTOCOL...';
    }

    if (cmd === '/DOOM') {
      const count = resolveAll();
      return `DOOM PROTOCOL EXECUTED. ${count} THREATS NEUTRALIZED.`;
    }

    if (cmd === '/STAT') {
      return `CRITICAL: ${threatStats.CRITICAL} | SEVERE: ${threatStats.SEVERE} | MODERATE: ${threatStats.MODERATE} | LOW: ${threatStats.LOW}`;
    }

    // Legacy/Shortcut Commands
    switch (cmd) {
      case 'U':
      case 'UPSIDE':
      case 'UPSIDEDOWN':
        setIsUpsideDownMode(prev => !prev);
        setGlitchTrigger(prev => prev + 1);
        return 'REALITY SHIFT INITIATED...';
      case 'N':
      case 'NEW':
      case 'INCIDENT':
        setShowCreateModal(true);
        return 'OPENING FORM...';
      case 'C':
      case 'CALIBRATE':
        setShowSignalCalibrator(true);
        return 'CALIBRATION STARTED...';
      case 'HAWKINS':
        const count = resolveAllCritical();
        return `TEMPORAL PURGE: ${count} CRITICAL ANOMALIES TARGETED.`;
      default:
        return `UNKNOWN COMMAND: ${command}`;
    }
  }, [resolveAll, resolveAllCritical, threatStats]);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="h-full"
    >
      <RetroTerminalFrame
        isUpsideDownMode={isUpsideDownMode}
        stage={isUpsideDownMode ? 'DIMENSION_BREACH' : 'ACTIVE_MONITORING'}
      >
        {/* Visual Effects */}
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

        {/* App Layout Container */}
        <div className="flex flex-col h-full overflow-hidden">

          {/* Scrollable Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 relative z-10">
            {/* Header */}
            <Header
              isUpsideDownMode={isUpsideDownMode}
              onToggleUpsideDown={() => {
                setIsUpsideDownMode((prev) => !prev);
                setGlitchTrigger(prev => prev + 1);
              }}
              onCreateIncident={() => setShowCreateModal(true)}
            />

            {/* Retro Menu */}
            <RetroMenu
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isUpsideDownMode={isUpsideDownMode}
              onCmdClick={() => {
                const terminalInput = document.querySelector('input[placeholder="TYPE COMMAND..."]') as HTMLInputElement;
                if (terminalInput) terminalInput.focus();
              }}
            />

            {/* Main Content View */}
            <main className="max-w-7xl mx-auto px-4 py-6 text-left min-h-[400px]">
              {/* INCIDENTS TAB */}
              {activeTab === 'INCIDENTS' && (
                <>
                  <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    isUpsideDownMode={isUpsideDownMode}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                </>
              )}

              {/* LIVE USERS TAB */}
              {activeTab === 'LIVE_USERS' && (
                <LiveUsers isUpsideDownMode={isUpsideDownMode} />
              )}

              {/* MAPS BEACON TAB */}
              {activeTab === 'MAPS_BEACON' && (
                <SectorMap isUpsideDownMode={isUpsideDownMode} />
              )}

              {/* CMD TAB */}
              {activeTab === 'CMD' && (
                <div className="h-[70vh] relative">
                  <Terminal
                    isUpsideDownMode={isUpsideDownMode}
                    onCommand={handleTerminalCommand}
                    embedded={true}
                  />
                </div>
              )}
            </main>

            {/* Incident Details Panel */}
            <AnimatePresence>
              {selectedIncident && (
                <IncidentPanel
                  incident={selectedIncident}
                  onClose={() => setSelectedIncident(null)}
                  onUpdateStatus={handleUpdateStatus}
                  isUpsideDownMode={isUpsideDownMode}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Mini HUD Graph - Fixed Bottom Right */}
          <MiniSignalWave isUpsideDownMode={isUpsideDownMode} />

          {/* Mini Threat Stats - Fixed Bottom Right (Left of Graph) */}
          <MiniThreatStats
            threatStats={threatStats}
            isUpsideDownMode={isUpsideDownMode}
          />

        </div>

        {/* Modals & Overlays */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateIncidentModal
              onClose={() => setShowCreateModal(false)}
              onSubmit={handleCreateIncident}
              isUpsideDownMode={isUpsideDownMode}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSignalCalibrator && (
            <SignalCalibrator
              onComplete={() => {
                setShowSignalCalibrator(false);
                showToast('SIGNAL CALIBRATION COMPLETE: 98.4%', 'success');
              }}
              onClose={() => setShowSignalCalibrator(false)}
              isUpsideDownMode={isUpsideDownMode}
            />
          )}
        </AnimatePresence>

        <ToastContainer toasts={toasts} onDismiss={dismissToast} isUpsideDownMode={isUpsideDownMode} />

        {/* Background Watermark */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
          <SignalWaveWatermark isUpsideDownMode={isUpsideDownMode} />
        </div>

      </RetroTerminalFrame>
    </motion.div>
  );
}
