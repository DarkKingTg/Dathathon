import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ZoomIn, ZoomOut, Filter, RefreshCw, User, Car, FileText, MapPin,
  FileUp, Lock, Code2, Activity, X, Maximize2, Minus
} from 'lucide-react';
import { GraphNode, GraphLink, Suspect, XAILog } from '../types';
import { ASSET_IMAGES } from '../data/mockData';

interface GraphAnalystProps {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedSuspect: Suspect;
  xaiLogs: XAILog[];
  onOpenExportModal: () => void;
  onExpandGraph: () => void;
}

interface DragState {
  nodeId: string;
  offsetX: number;
  offsetY: number;
}

interface PanState {
  startX: number;
  startY: number;
  startPanX: number;
  startPanY: number;
}

interface TooltipData {
  x: number;
  y: number;
  node: GraphNode;
}

interface EdgeHover {
  idx: number;
  x: number;
  y: number;
}

export const GraphAnalyst: React.FC<GraphAnalystProps> = ({
  nodes: initialNodes,
  links,
  selectedSuspect,
  xaiLogs,
  onOpenExportModal,
  onExpandGraph
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('S-192-KLR');
  const [activeXaiTab, setActiveXaiTab] = useState<'cypher' | 'cited' | 'provenance'>('cypher');
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [filters, setFilters] = useState({
    suspectToSuspect: true,
    vehicleToLink: true,
    financialTransaction: false,
    firAssociation: true,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [panning, setPanning] = useState<PanState | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [edgeHover, setEdgeHover] = useState<EdgeHover | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const panRef = useRef<PanState | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Initialize positions from node data
  useEffect(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    initialNodes.forEach(n => {
      pos[n.id] = { x: n.x, y: n.y };
    });
    setNodePositions(pos);
  }, [initialNodes]);

  const selectedNode = initialNodes.find(n => n.id === selectedNodeId) || initialNodes[0];

  const visibleNodes = initialNodes.filter(n => {
    if (!isGraphExpanded && (n.id === 'S-401-MYS' || n.id === 'BANK-9912')) return false;
    return true;
  });

  const visibleLinks = links.filter(link => {
    if (!filters.suspectToSuspect && link.type === 'suspect') return false;
    if (!filters.vehicleToLink && link.type === 'vehicle') return false;
    if (!filters.financialTransaction && link.type === 'financial') return false;
    if (!filters.firAssociation && link.type === 'fir') return false;
    return true;
  }).filter(link => {
    return visibleNodes.some(n => n.id === link.source) && visibleNodes.some(n => n.id === link.target);
  });

  const handleExpandClick = () => {
    setIsGraphExpanded(true);
    onExpandGraph();
  };

  const nodeIcon = (type: string, size: string = 'w-5 h-5') => {
    const cls = size;
    switch (type) {
      case 'suspect': return <User className={cls} />;
      case 'vehicle': return <Car className={cls} />;
      case 'fir': return <FileText className={cls} />;
      case 'location': return <MapPin className={cls} />;
      case 'bank': return <Activity className={cls} />;
      default: return <User className={cls} />;
    }
  };

  const nodeColor = (type: string, isSelected: boolean) => {
    if (isSelected) return 'bg-[#2563eb] text-white border-[#5b9bf5]';
    switch (type) {
      case 'suspect': return 'bg-[#171f33] border-[#2563eb]/60 text-[#b4c5ff]';
      case 'vehicle': return 'bg-[#171f33] border-[#d97707]/50 text-[#ffb77d]';
      case 'fir': return 'bg-[#171f33] border-[#d52022]/40 text-[#ffb4ab]';
      case 'location': return 'bg-[#171f33] border-[#434655] text-[#c3c6d7]';
      case 'bank': return 'bg-[#171f33] border-[#059669]/40 text-[#6ee7b7]';
      default: return 'bg-[#171f33] border-[#434655] text-[#c3c6d7]';
    }
  };

  const edgeColor = (type: string) => {
    switch (type) {
      case 'vehicle': return '#d97707';
      case 'fir': return '#d52022';
      case 'financial': return '#059669';
      case 'location': return '#6b7280';
      default: return '#2563eb';
    }
  };

  const getNodePos = useCallback((id: string) => {
    return nodePositions[id] || { x: 0, y: 0 };
  }, [nodePositions]);

  // --- NODE DRAG ---
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const pos = getNodePos(nodeId);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = (e.clientX - rect.left - pan.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - pan.y) / zoomLevel;
    const newState = { nodeId, offsetX: mouseX - pos.x, offsetY: mouseY - pos.y };
    dragRef.current = newState;
    setDragging(newState);
    setSelectedNodeId(nodeId);
  }, [getNodePos, pan, zoomLevel]);

  // --- CANVAS PAN ---
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      const newState = { startX: e.clientX, startY: e.clientY, startPanX: pan.x, startPanY: pan.y };
      panRef.current = newState;
      setPanning(newState);
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (dragRef.current) {
      const mouseX = (e.clientX - rect.left - pan.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - pan.y) / zoomLevel;
      const { nodeId, offsetX, offsetY } = dragRef.current;
      const newX = mouseX - offsetX;
      const newY = mouseY - offsetY;
      setNodePositions(prev => ({
        ...prev,
        [nodeId]: { x: newX, y: newY }
      }));
    }

    if (panRef.current) {
      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;
      setPan({
        x: panRef.current.startPanX + dx,
        y: panRef.current.startPanY + dy
      });
    }
  }, [pan, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
    panRef.current = null;
    setDragging(null);
    setPanning(null);
  }, []);

  // --- ZOOM ---
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoomLevel(prev => {
      const next = Math.min(Math.max(prev + delta, 0.3), 3);
      return next;
    });
  }, []);

  // --- TOOLTIP ---
  const handleNodeMouseEnter = useCallback((e: React.MouseEvent, node: GraphNode) => {
    if (dragRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHoveredNodeId(node.id);
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 10,
      node
    });
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
    setTooltip(null);
  }, []);

  // --- EDGE HOVER ---
  const handleEdgeMouseEnter = useCallback((idx: number, e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setEdgeHover({
      idx,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 8,
    });
  }, []);

  const handleEdgeMouseLeave = useCallback(() => {
    setEdgeHover(null);
  }, []);

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeId('');
        setShowHelp(false);
      }
      if (e.key === '+' || e.key === '=') setZoomLevel(prev => Math.min(prev + 0.15, 3));
      if (e.key === '-') setZoomLevel(prev => Math.max(prev - 0.15, 0.3));
      if (e.key === '0') { setZoomLevel(1); setPan({ x: 0, y: 0 }); }
      if (e.key === 'f' || e.key === 'F') fitToScreen();
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) setShowHelp(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fitToScreen = useCallback(() => {
    if (visibleNodes.length === 0) return;
    const xs = visibleNodes.map(n => getNodePos(n.id).x);
    const ys = visibleNodes.map(n => getNodePos(n.id).y);
    const minX = Math.min(...xs) - 80;
    const maxX = Math.max(...xs) + 80;
    const minY = Math.min(...ys) - 80;
    const maxY = Math.max(...ys) + 80;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = rect.width / rangeX;
    const scaleY = rect.height / rangeY;
    const newZoom = Math.min(scaleX, scaleY, 2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    setZoomLevel(newZoom);
    setPan({
      x: rect.width / 2 - centerX * newZoom,
      y: rect.height / 2 - centerY * newZoom
    });
  }, [visibleNodes, getNodePos]);

  const getConnectedNodes = (nodeId: string) => {
    const connected = new Set<string>();
    visibleLinks.forEach(l => {
      if (l.source === nodeId) connected.add(l.target);
      if (l.target === nodeId) connected.add(l.source);
    });
    return connected;
  };

  const connectedToSelected = selectedNodeId ? getConnectedNodes(selectedNodeId) : new Set<string>();
  const isSelected = (id: string) => id === selectedNodeId;
  const isDimmed = (id: string) => selectedNodeId && !isSelected(id) && !connectedToSelected.has(id);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0b1326] text-[#dae2fd] overflow-hidden">

      {/* Workspace bar */}
      <div className="bg-[#131b2e] border-b border-[#434655] px-5 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-5 font-medium">
          <span className="text-[#b4c5ff] text-sm">KSP-Chanakya</span>
          <span className="text-[#c3c6d7]">Field View</span>
          <span className="text-[#dae2fd] border-b border-[#2563eb] pb-0.5">Graph Analyst</span>
          <span className="text-[#c3c6d7] hover:text-[#dae2fd] cursor-pointer transition-colors">Semantic Search</span>
          <span className="text-[#c3c6d7] hover:text-[#dae2fd] cursor-pointer transition-colors">Leadership</span>
        </div>

        <div className="flex items-center gap-3 text-[#c3c6d7]">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Lock className="w-3 h-3 text-[#ffb77d]" />
            <span>Analyst | Top Secret</span>
          </div>
          <button onClick={onOpenExportModal} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors">
            <FileUp className="w-3 h-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Graph Canvas */}
        <div className="flex-1 flex flex-col relative bg-[#060e20] overflow-hidden">

          {/* Zoom controls */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 fade-up">
            <div className="bg-[#171f33]/90 backdrop-blur-sm border border-[#434655]/60 rounded-lg p-1 flex flex-col gap-0.5">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 3))}
                className="p-1.5 hover:bg-[#222a3d] rounded text-[#c3c6d7] hover:text-white transition-colors"
                title="Zoom in (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.3))}
                className="p-1.5 hover:bg-[#222a3d] rounded text-[#c3c6d7] hover:text-white transition-colors"
                title="Zoom out (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={fitToScreen}
                className="p-1.5 hover:bg-[#222a3d] rounded text-[#c3c6d7] hover:text-white transition-colors"
                title="Fit to screen (F)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <div className="w-full h-px bg-[#434655]/60" />
              <button
                onClick={() => setFilterPopoverOpen(!filterPopoverOpen)}
                className={`p-1.5 rounded transition-colors ${filterPopoverOpen ? 'bg-[#2563eb] text-white' : 'hover:bg-[#222a3d] text-[#c3c6d7]'}`}
                title="Filter links"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setZoomLevel(1); setPan({ x: 0, y: 0 }); setIsGraphExpanded(false); }}
                className="p-1.5 hover:bg-[#222a3d] rounded text-[#c3c6d7] hover:text-white transition-colors"
                title="Reset view (0)"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="bg-[#171f33]/80 backdrop-blur-sm border border-[#434655]/40 rounded px-2 py-1 text-center">
              <span className="text-[10px] font-mono text-[#8d90a0]">{Math.round(zoomLevel * 100)}%</span>
            </div>
          </div>

          {/* Help overlay */}
          {showHelp && (
            <div className="absolute inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center fade-in"
              onClick={() => setShowHelp(false)}>
              <div className="bg-[#171f33] border border-[#434655] rounded-xl p-6 max-w-sm w-full shadow-2xl spring-in"
                onClick={e => e.stopPropagation()}>
                <h3 className="text-sm font-bold text-[#dae2fd] mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#2563eb]" />
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-1.5 text-[11px]">
                  {[
                    ['F', 'Fit graph to screen'],
                    ['+ / -', 'Zoom in / out'],
                    ['0', 'Reset zoom & pan'],
                    ['Esc', 'Deselect node'],
                    ['?', 'Toggle this help'],
                    ['Alt + Drag', 'Pan canvas'],
                    ['Scroll', 'Zoom in / out'],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-[#434655]/30">
                      <kbd className="bg-[#222a3d] px-1.5 py-0.5 rounded font-mono text-[#b4c5ff] text-[10px]">{key}</kbd>
                      <span className="text-[#8d90a0]">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter popover */}
          {filterPopoverOpen && (
            <div className="absolute top-3 left-14 z-30 bg-[#171f33] border border-[#434655] rounded-lg p-3 w-56 shadow-lg space-y-2 spring-in">
              <div className="flex justify-between items-center border-b border-[#434655]/60 pb-2">
                <span className="text-[11px] font-semibold text-[#b4c5ff]">Link Filters</span>
                <button onClick={() => setFilterPopoverOpen(false)} className="text-[#c3c6d7] hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { key: 'suspectToSuspect', label: 'Suspect-to-Suspect', color: 'bg-[#2563eb]' },
                  { key: 'vehicleToLink', label: 'Vehicle Link', color: 'bg-[#d97707]' },
                  { key: 'financialTransaction', label: 'Financial', color: 'bg-[#059669]' },
                  { key: 'firAssociation', label: 'FIR Association', color: 'bg-[#d52022]' },
                ].map(({ key, label, color }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-[#222a3d] transition-colors">
                    <input
                      type="checkbox"
                      checked={filters[key as keyof typeof filters]}
                      onChange={e => setFilters({ ...filters, [key]: e.target.checked })}
                      className="rounded-sm bg-[#0b1326] border-[#8d90a0] text-[#2563eb] w-3 h-3"
                    />
                    <span className="text-[#c3c6d7]">{label}</span>
                    <span className={`ml-auto w-1.5 h-1.5 rounded-full ${color}`}></span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setFilters({ suspectToSuspect: true, vehicleToLink: true, financialTransaction: true, firAssociation: true })}
                className="w-full py-1 text-[10px] font-medium text-[#c3c6d7] hover:text-white bg-[#222a3d] border border-[#434655]/60 rounded transition-colors"
              >
                Show All
              </button>
            </div>
          )}

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute z-40 pointer-events-none fade-in"
              style={{ left: tooltip.x, top: tooltip.y - 60, transform: 'translate(-50%, -100%)' }}
            >
              <div className="bg-[#171f33] border border-[#434655] rounded-lg px-3 py-2 shadow-xl min-w-[160px]">
                <div className="flex items-center gap-2 mb-1">
                  {nodeIcon(tooltip.node.type, 'w-3.5 h-3.5')}
                  <span className="text-[11px] font-bold text-[#dae2fd]">{tooltip.node.code}</span>
                </div>
                <div className="text-[10px] font-mono text-[#b4c5ff]">{tooltip.node.id}</div>
                {tooltip.node.subLabel && (
                  <div className="text-[10px] text-[#8d90a0] mt-0.5">{tooltip.node.subLabel}</div>
                )}
                {tooltip.node.riskScore && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] text-[#8d90a0]">Risk:</span>
                    <div className="flex-1 h-1 bg-[#222a3d] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${tooltip.node.riskScore}%`,
                          backgroundColor: tooltip.node.riskScore > 70 ? '#d52022' : tooltip.node.riskScore > 40 ? '#d97707' : '#059669'
                        }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#c3c6d7]">{tooltip.node.riskScore}</span>
                  </div>
                )}
                <div className="text-[9px] text-[#8d90a0] mt-1.5 italic">Click to inspect</div>
              </div>
            </div>
          )}

          {/* Edge hover tooltip */}
          {edgeHover && (
            <div
              className="absolute z-40 pointer-events-none fade-in"
              style={{ left: edgeHover.x, top: edgeHover.y - 30, transform: 'translate(-50%, -100%)' }}
            >
              <div className="bg-[#171f33] border border-[#434655] rounded px-2.5 py-1.5 shadow-lg">
                <span className="text-[10px] font-medium text-[#b4c5ff]">
                  {visibleLinks[edgeHover.idx]?.relation || 'Link'}
                </span>
                <span className="text-[9px] text-[#8d90a0] ml-1.5">
                  ({visibleLinks[edgeHover.idx]?.type})
                </span>
              </div>
            </div>
          )}

          {/* Graph area */}
          <div
            ref={canvasRef}
            className="flex-1 relative overflow-hidden"
            style={{ cursor: panning ? 'grabbing' : dragging ? 'grabbing' : 'default' }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #8d90a0 0.5px, transparent 0.5px)',
                backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`
              }}
            />

            {/* SVG + Nodes container */}
            <div
              className="absolute inset-0"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`, transformOrigin: '0 0' }}
            >
              {/* Edges */}
              <svg className="absolute inset-0 pointer-events-none" style={{ width: '2000px', height: '1500px', left: '-200px', top: '-150px' }}>
                <defs>
                  <filter id="edge-glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <marker id="arrow" viewBox="0 0 10 6" refX="10" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 3 L 0 6 z" fill="currentColor" opacity="0.5" />
                  </marker>
                </defs>
                {visibleLinks.map((link, idx) => {
                  const s = getNodePos(link.source);
                  const t = getNodePos(link.target);
                  if (!s || !t) return null;

                  const color = edgeColor(link.type);
                  const isHighlighted = selectedNodeId && (link.source === selectedNodeId || link.target === selectedNodeId);
                  const opacity = selectedNodeId ? (isHighlighted ? 0.9 : 0.15) : 0.5;

                  const midX = (s.x + t.x) / 2;
                  const midY = (s.y + t.y) / 2;
                  const dx = t.x - s.x;
                  const dy = t.y - s.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const offsetX = (-dy / len) * 8;
                  const offsetY = (dx / len) * 8;

                  return (
                    <g key={idx}>
                      {/* Invisible thick line for hover detection */}
                      <line
                        x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                        stroke="transparent"
                        strokeWidth="12"
                        style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                        onMouseEnter={(e) => handleEdgeMouseEnter(idx, e)}
                        onMouseLeave={handleEdgeMouseLeave}
                      />
                      {/* Visible edge */}
                      <line
                        x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                        stroke={color}
                        strokeWidth={isHighlighted ? 2.5 : 1.5}
                        strokeDasharray={link.type === 'financial' ? '6,4' : 'none'}
                        opacity={opacity}
                        filter={isHighlighted ? 'url(#edge-glow)' : undefined}
                        className="transition-opacity duration-300"
                        style={{
                          animation: mounted ? `edgeDraw 0.8s ease-out ${idx * 0.1}s forwards` : 'none',
                          strokeDashoffset: 200,
                        }}
                      />
                      {/* Arrow marker */}
                      <circle
                        cx={t.x - (dx / len) * 20}
                        cy={t.y - (dy / len) * 20}
                        r="3"
                        fill={color}
                        opacity={opacity * 0.8}
                      />
                      {/* Edge label on highlight */}
                      {isHighlighted && (
                        <g transform={`translate(${midX + offsetX}, ${midY + offsetY})`}>
                          <rect
                            x={-30} y={-8} width="60" height="16" rx="4"
                            fill="#171f33" stroke={color} strokeWidth="0.5" opacity="0.95"
                          />
                          <text
                            textAnchor="middle" dominantBaseline="central"
                            fill="#c3c6d7" fontSize="8" fontFamily="monospace"
                          >
                            {link.relation.length > 12 ? link.relation.slice(0, 12) + '…' : link.relation}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {visibleNodes.map((node, idx) => {
                const pos = getNodePos(node.id);
                const isNodeSelected = isSelected(node.id);
                const isNodeHovered = node.id === hoveredNodeId;
                const dimmed = isDimmed(node.id);
                const connected = connectedToSelected.has(node.id);

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onMouseEnter={(e) => handleNodeMouseEnter(e, node)}
                    onMouseLeave={handleNodeMouseLeave}
                    style={{
                      left: `${pos.x - 24}px`,
                      top: `${pos.y - 24}px`,
                      opacity: mounted ? (dimmed ? 0.25 : 1) : 0,
                      transition: dragging?.nodeId === node.id ? 'none' : 'opacity 0.3s',
                      animation: mounted && !dragging ? `nodeAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.06}s both` : 'none',
                      zIndex: isNodeSelected ? 20 : isNodeHovered ? 15 : 10,
                    }}
                    className={`absolute cursor-grab active:cursor-grabbing group ${dragging?.nodeId === node.id ? 'z-30' : ''}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                        nodeColor(node.type, isNodeSelected)
                      } ${
                        isNodeSelected ? 'scale-110 shadow-lg shadow-[#2563eb]/20'
                          : isNodeHovered ? 'scale-105 border-[#b4c5ff]/50 shadow-md'
                          : connected ? 'scale-105'
                          : ''
                      }`}
                    >
                      {nodeIcon(node.type)}
                    </div>

                    <div className={`mt-1 px-1.5 py-0.5 rounded bg-[#0b1326]/90 border text-center whitespace-nowrap transition-colors ${
                      isNodeSelected ? 'border-[#2563eb]/60 text-[#b4c5ff]' : 'border-[#434655]/50 text-[#dae2fd]'
                    }`}>
                      <div className="text-[9px] font-mono">{node.label}</div>
                      {node.subLabel && (
                        <div className="text-[8px] text-[#8d90a0]">{node.subLabel}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* XAI Drawer */}
          <div className="bg-[#131b2e] border-t border-[#434655] p-3 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#434655]/60 pb-2 mb-2">
              <div className="flex items-center gap-3">
                {(['cypher', 'cited', 'provenance'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveXaiTab(tab)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeXaiTab === tab
                        ? 'bg-[#2563eb] text-white'
                        : 'text-[#c3c6d7] hover:text-white'
                    }`}
                  >
                    {tab === 'cypher' ? 'XAI Logic' : tab === 'cited' ? 'Cited Records' : 'Provenance'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHelp(true)}
                  className="text-[10px] text-[#8d90a0] hover:text-[#dae2fd] transition-colors"
                  title="Keyboard shortcuts (?)"
                >
                  <kbd className="bg-[#222a3d] px-1.5 py-0.5 rounded font-mono">?</kbd>
                </button>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#c3c6d7]">
                  <Activity className="w-3 h-3 text-[#2563eb]" />
                  <span>89.4%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-24 overflow-y-auto">
              <div className="bg-[#060e20] p-2.5 rounded border border-[#434655]/50 font-mono text-[10px] leading-relaxed text-[#b4c5ff]">
                <div className="text-[#8d90a0] mb-1 font-sans font-medium text-[9px]">Cypher Query</div>
                <p>
                  MATCH (s:Suspect &#123;id: '{selectedNodeId || 'S-192-KLR'}'&#125;)-[:ASSOCIATED_WITH]-&gt;(f:FIR)<br />
                  OPTIONAL MATCH (v)-[:SPOTTED_AT]-&gt;(l:Location)<br />
                  WHERE l.timestamp &gt; '2023-11-01'<br />
                  RETURN s, v, l LIMIT 50;
                </p>
              </div>

              <div className="bg-[#060e20] p-2.5 rounded border border-[#434655]/50 font-mono text-[10px] space-y-1 text-[#c3c6d7]">
                <div className="text-[#8d90a0] font-sans font-medium text-[9px] mb-1">Reasoning Logs</div>
                {xaiLogs.map((log, i) => (
                  <div key={i} className="flex gap-2 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <span className={log.level === 'WARN' ? 'text-[#ffb77d] font-medium' : 'text-[#2563eb] font-medium'}>
                      [{log.level}]
                    </span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Inspector Sidebar */}
        <div className="w-72 sm:w-80 bg-[#171f33] border-l border-[#434655] flex flex-col overflow-y-auto p-4 space-y-4 slide-in-right">

          {/* Profile */}
          <div className="flex items-start justify-between border-b border-[#434655]/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#2563eb]/15 border border-[#2563eb]/30 flex items-center justify-center text-[#b4c5ff]">
                {selectedNode ? nodeIcon(selectedNode.type, 'w-5 h-5') : <User className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#dae2fd]">{selectedNode?.code || selectedSuspect.name}</h3>
                <p className="text-[10px] font-mono text-[#b4c5ff]">
                  {selectedNode?.id || selectedSuspect.id}
                  {selectedSuspect.status && <span className="text-[#ffb77d]"> · {selectedSuspect.status}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Node details */}
          {selectedNode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] py-1.5 border-b border-[#434655]/30">
                <span className="text-[#8d90a0]">Type</span>
                <span className="font-mono font-medium text-[#dae2fd] capitalize">{selectedNode.type}</span>
              </div>
              {selectedNode.subLabel && (
                <div className="flex items-center justify-between text-[11px] py-1.5 border-b border-[#434655]/30">
                  <span className="text-[#8d90a0]">Description</span>
                  <span className="font-mono font-medium text-[#dae2fd]">{selectedNode.subLabel}</span>
                </div>
              )}
              {selectedNode.riskScore != null && (
                <div className="flex items-center justify-between text-[11px] py-1.5">
                  <span className="text-[#8d90a0]">Risk Score</span>
                  <span className="font-mono font-medium text-[#ffb4ab] bg-[#93000a]/20 px-2 py-0.5 rounded text-[10px]">
                    {selectedNode.riskScore}/100
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-2">
            {[
              { label: 'Aadhar UID', value: selectedSuspect.aadharUid },
              { label: 'Last Activity', value: selectedSuspect.lastActivity },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-[11px] py-1.5 border-b border-[#434655]/30">
                <span className="text-[#8d90a0]">{label}</span>
                <span className="font-mono font-medium text-[#dae2fd]">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-[11px] py-1.5">
              <span className="text-[#8d90a0]">Risk Score</span>
              <span className="font-mono font-medium text-[#ffb4ab] bg-[#93000a]/20 px-2 py-0.5 rounded text-[10px]">
                {selectedSuspect.riskScore}/100
              </span>
            </div>
          </div>

          {/* Neighbors */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#b4c5ff] block">
              Connected Nodes
            </label>
            <div className="space-y-1.5">
              {visibleLinks
                .filter(l => l.source === selectedNodeId || l.target === selectedNodeId)
                .map((l, i) => {
                  const otherId = l.source === selectedNodeId ? l.target : l.source;
                  const otherNode = initialNodes.find(n => n.id === otherId);
                  if (!otherNode) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedNodeId(otherId)}
                      className="w-full p-2.5 bg-[#131b2e] border border-[#434655]/50 rounded-md flex items-center gap-2.5 hover:border-[#2563eb]/50 transition-colors group text-left"
                    >
                      {nodeIcon(otherNode.type, 'w-4 h-4')}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-mono font-medium text-[#dae2fd] truncate">{otherNode.id}</h4>
                        <p className="text-[9px] text-[#8d90a0] truncate">{l.relation}</p>
                      </div>
                    </button>
                  );
                })}
            </div>

            <button
              onClick={handleExpandClick}
              className="w-full mt-1.5 bg-[#131b2e] border border-[#2563eb]/50 text-[#b4c5ff] hover:bg-[#2563eb] hover:text-white py-2 rounded-md text-[11px] font-medium transition-all duration-200"
            >
              {isGraphExpanded ? '2-Hop Active' : 'Expand 2-Hop'}
            </button>
          </div>

          {/* Evidence */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#b4c5ff] block">Visual Evidence</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-24 bg-[#0b1326] border border-[#434655]/50 rounded-md overflow-hidden relative group">
                <img
                  src={ASSET_IMAGES.cctvCar}
                  alt="CCTV"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 left-1 bg-[#0b1326]/70 text-[8px] font-mono px-1 py-0.5 rounded text-white/80">
                  CCTV #44
                </span>
              </div>

              <div className="h-24 bg-[#0b1326] border border-[#434655]/50 rounded-md overflow-hidden relative group">
                <img
                  src={ASSET_IMAGES.fingerprint}
                  alt="Fingerprint"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 left-1 bg-[#0b1326]/70 text-[8px] font-mono px-1 py-0.5 rounded text-white/80">
                  LATENT #1
                </span>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="pt-3 border-t border-[#434655]/60">
            <button
              onClick={onOpenExportModal}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors duration-150"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Export Case File</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
