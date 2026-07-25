import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, UserRole, VoiceQuery } from './types';
import {
  INITIAL_SUSPECTS,
  INITIAL_GRAPH_NODES,
  INITIAL_GRAPH_LINKS,
  INITIAL_MATCHING_CASES,
  INITIAL_XAI_LOGS,
  PENDING_VOICE_QUERIES
} from './data/mockData';
import { Header } from './components/Header';
import { FieldView } from './components/FieldView';
import { GraphAnalyst } from './components/GraphAnalyst';
import { SemanticSearch } from './components/SemanticSearch';
import { LeadershipOverview } from './components/LeadershipOverview';
import { TimelineView } from './components/TimelineView';
import { AuditLogViewer } from './components/AuditLogViewer';
import { ExportDossierModal } from './components/ExportDossierModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('field');
  const [userRole, setUserRole] = useState<UserRole>('Field Officer (SHO)');
  const [suspects] = useState(INITIAL_SUSPECTS);
  const [nodes, setNodes] = useState(INITIAL_GRAPH_NODES);
  const [links] = useState(INITIAL_GRAPH_LINKS);
  const [cases] = useState(INITIAL_MATCHING_CASES);
  const [xaiLogs] = useState(INITIAL_XAI_LOGS);
  const [pendingQueries, setPendingQueries] = useState<VoiceQuery[]>(PENDING_VOICE_QUERIES);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('S-192-KLR');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const selectedSuspect = suspects.find(s => s.id === selectedSuspectId) || suspects[0];

  const handleConfirmQuery = (queryId: string) => {
    setPendingQueries(prev => prev.filter(q => q.id !== queryId));
  };

  const handleExpandGraph = () => {
    const existingIds = new Set(nodes.map(n => n.id));
    const extraNodes = INITIAL_GRAPH_NODES.filter(n => !existingIds.has(n.id));
    if (extraNodes.length > 0) {
      setNodes([...nodes, ...extraNodes]);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'Investigative Analyst') {
      setCurrentView('graph');
    } else if (role === 'Leadership / Commissioner') {
      setCurrentView('leadership');
    } else {
      setCurrentView('field');
    }
  };

  // Global keyboard shortcuts
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if typing in an input
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    // Cmd/Ctrl+K → open export modal as command palette
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsExportModalOpen(prev => !prev);
    }

    // Number keys for view switching
    if (!e.metaKey && !e.ctrlKey && !e.altKey) {
      const viewMap: Record<string, ViewMode> = {
        '1': 'field',
        '2': 'graph',
        '3': 'semantic',
        '4': 'leadership',
        '5': 'timeline',
        '6': 'audit',
      };
      if (viewMap[e.key]) {
        setCurrentView(viewMap[e.key]);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans selection:bg-[#2563eb] selection:text-white">

      {/* Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        userRole={userRole}
        onRoleChange={handleRoleChange}
        pendingQueriesCount={pendingQueries.length}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* View Switcher Container */}
      <main className="w-full">
        {currentView === 'field' && (
          <FieldView
            suspects={suspects}
            pendingQueries={pendingQueries}
            onConfirmQuery={handleConfirmQuery}
            onViewDossier={(suspectId) => {
              setSelectedSuspectId(suspectId);
              setIsExportModalOpen(true);
            }}
            onSwitchView={setCurrentView}
          />
        )}

        {currentView === 'graph' && (
          <GraphAnalyst
            nodes={nodes}
            links={links}
            selectedSuspect={selectedSuspect}
            xaiLogs={xaiLogs}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onExpandGraph={handleExpandGraph}
          />
        )}

        {currentView === 'semantic' && (
          <SemanticSearch
            cases={cases}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {currentView === 'leadership' && (
          <LeadershipOverview />
        )}

        {currentView === 'timeline' && (
          <TimelineView
            nodes={nodes}
            links={links}
            onNodeSelect={(nodeId) => {
              setSelectedSuspectId(nodeId);
              setCurrentView('graph');
            }}
          />
        )}

        {currentView === 'audit' && (
          <AuditLogViewer />
        )}
      </main>

      {/* Export PDF Dossier Modal */}
      <ExportDossierModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedSuspect={selectedSuspect}
      />

    </div>
  );
}
