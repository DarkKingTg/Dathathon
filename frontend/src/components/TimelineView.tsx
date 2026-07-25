import React, { useState, useMemo } from 'react';
import {
  Clock, FileText, User, Car, MapPin, AlertTriangle, CheckCircle,
  Filter, ChevronDown, ChevronRight, ExternalLink
} from 'lucide-react';
import { GraphNode, GraphLink } from '../types';

interface TimelineViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeSelect?: (nodeId: string) => void;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'filing' | 'sighting' | 'vehicle' | 'financial' | 'evidence' | 'alert';
  title: string;
  description: string;
  nodeId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 'evt-1',
    timestamp: '2023-11-04T02:30:00',
    type: 'filing',
    title: 'FIR #2023-KAR-0144 Filed',
    description: 'Jewelry store heist reported at Hubballi commercial district. Adjacent wall penetration with structural demolition tools.',
    nodeId: 'FIR-102/2023',
    severity: 'high',
    tags: ['WALL BREACH', 'SILENT COBRA GROUP'],
  },
  {
    id: 'evt-2',
    timestamp: '2023-11-08T14:15:00',
    type: 'sighting',
    title: 'Suspect S-192-KLR Spotted',
    description: 'CCTV confirmation at Majestic Tower, Bengaluru. Subject matched against facial recognition database with 94.2% confidence.',
    nodeId: 'S-192-KLR',
    severity: 'medium',
    tags: ['CCTV', 'FACIAL RECOGNITION'],
  },
  {
    id: 'evt-3',
    timestamp: '2023-12-01T09:45:00',
    type: 'vehicle',
    title: 'Vehicle KA-01-MQ-XXXX Tracked',
    description: 'GPS geofence alert triggered. Black SUV spotted near crime hotspot area. ANPR cross-reference confirmed.',
    nodeId: 'KA-01-MQ-XXXX',
    severity: 'medium',
    tags: ['ANPR', 'GPS TRACKING'],
  },
  {
    id: 'evt-4',
    timestamp: '2024-01-15T11:20:00',
    type: 'alert',
    title: 'Cross-District Pattern Detected',
    description: 'AI analysis flagged MO similarity between Hubballi and Mysuru incidents. Behavioral fingerprint match at 91.3%.',
    severity: 'critical',
    tags: ['AI FLAG', 'CROSS-DISTRICT'],
  },
  {
    id: 'evt-5',
    timestamp: '2024-02-18T03:10:00',
    type: 'filing',
    title: 'FIR #2024-KAR-8120 Filed',
    description: 'Industrial warehouse breach in Bengaluru Urban. Surveillance neutralization and secondary power line severance.',
    severity: 'high',
    tags: ['WAREHOUSE', 'TECH SAVVY'],
  },
  {
    id: 'evt-6',
    timestamp: '2024-03-01T16:40:00',
    type: 'financial',
    title: 'Suspicious Transaction Flagged',
    description: 'UPI transaction chain from ACC-88219-X linked to suspect network. Amount: ₹4,85,000 routed through 3 intermediary accounts.',
    nodeId: 'BANK-9912',
    severity: 'high',
    tags: ['FINTrail', 'MONEY LAUNDERING'],
  },
  {
    id: 'evt-7',
    timestamp: '2024-03-12T01:55:00',
    type: 'filing',
    title: 'FIR #2024-KAR-9981 Filed',
    description: 'Organized burglary with forced entry via rear ventilation shaft. Biometric alarm bypass using powdered graphite.',
    severity: 'critical',
    tags: ['HIGH-VALUE TARGET', 'ACTIVE SUSPECT GROUP A-14'],
  },
  {
    id: 'evt-8',
    timestamp: '2024-03-18T08:30:00',
    type: 'evidence',
    title: 'Latent Fingerprint Match',
    description: 'Partial print recovered from ventilation shaft matched to S-401-MYS in AFIS database. 12-point comparison confirmed.',
    nodeId: 'S-401-MYS',
    severity: 'high',
    tags: ['AFIS', 'FORENSICS'],
  },
  {
    id: 'evt-9',
    timestamp: '2024-03-22T13:15:00',
    type: 'sighting',
    title: 'Co-conspirator Location Confirmed',
    description: 'Mobile tower triangulation places S-401-MYS at Malleswaram 8th Cross during time window of latest incident.',
    nodeId: 'S-401-MYS',
    severity: 'medium',
    tags: ['CDR ANALYSIS', 'TOWER TRIANGULATION'],
  },
];

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  filing: { icon: <FileText className="w-4 h-4" />, color: 'text-[#2563eb]', bgColor: 'bg-[#2563eb]/15 border-[#2563eb]/30' },
  sighting: { icon: <User className="w-4 h-4" />, color: 'text-[#b4c5ff]', bgColor: 'bg-[#b4c5ff]/10 border-[#b4c5ff]/20' },
  vehicle: { icon: <Car className="w-4 h-4" />, color: 'text-[#ffb77d]', bgColor: 'bg-[#d97707]/10 border-[#d97707]/20' },
  financial: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-[#6ee7b7]', bgColor: 'bg-[#059669]/10 border-[#059669]/20' },
  evidence: { icon: <MapPin className="w-4 h-4" />, color: 'text-[#c3c6d7]', bgColor: 'bg-[#434655]/10 border-[#434655]/30' },
  alert: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-[#ffb4ab]', bgColor: 'bg-[#d52022]/10 border-[#d52022]/20' },
};

const SEVERITY_COLOR: Record<string, string> = {
  low: 'bg-[#059669]',
  medium: 'bg-[#d97707]',
  high: 'bg-[#2563eb]',
  critical: 'bg-[#d52022]',
};

export const TimelineView: React.FC<TimelineViewProps> = ({ nodes, links, onNodeSelect }) => {
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return MOCK_TIMELINE;
    return MOCK_TIMELINE.filter(e => e.type === filter);
  }, [filter]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    filteredEvents.forEach(evt => {
      const month = new Date(evt.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!groups[month]) groups[month] = [];
      groups[month].push(evt);
    });
    return groups;
  }, [filteredEvents]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b1326] text-[#dae2fd] p-4 sm:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#434655]/60 pb-3 mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#dae2fd] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8d90a0]" />
            <span>Case Timeline</span>
          </h1>
          <p className="text-[11px] text-[#8d90a0] mt-0.5">
            Chronological investigation events · {filteredEvents.length} events
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'filing', label: 'FIR Filings' },
          { key: 'sighting', label: 'Suspect Sightings' },
          { key: 'vehicle', label: 'Vehicle Activity' },
          { key: 'financial', label: 'Financial' },
          { key: 'evidence', label: 'Evidence' },
          { key: 'alert', label: 'Alerts' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              filter === key
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#171f33] text-[#8d90a0] hover:text-[#dae2fd] border border-[#434655]/40 hover:border-[#434655]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-[#434655]/40" />

        {Object.entries(groupedEvents).map(([month, events]: [string, TimelineEvent[]]) => (
          <div key={month} className="mb-8">
            {/* Month header */}
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="w-12 h-6 bg-[#2563eb] rounded-md flex items-center justify-center z-10">
                <span className="text-[10px] font-bold text-white">{month.split(' ')[0]?.slice(0, 3)}</span>
              </div>
              <span className="text-xs font-semibold text-[#b4c5ff]">{month}</span>
            </div>

            {/* Events */}
            <div className="space-y-3 ml-6">
              {events.map((evt, idx) => {
                const isExpanded = expandedId === evt.id;
                const config = TYPE_CONFIG[evt.type] || TYPE_CONFIG.filing;

                return (
                  <div
                    key={evt.id}
                    className="relative fade-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {/* Connector dot */}
                    <div className={`absolute -left-6 top-4 w-3 h-3 rounded-full border-2 border-[#0b1326] ${SEVERITY_COLOR[evt.severity]} z-10`} />

                    {/* Event card */}
                    <div
                      className={`bg-[#171f33] border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-[#434655] ${
                        isExpanded ? 'border-[#2563eb]/40' : 'border-[#434655]/40'
                      }`}
                      onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-md border ${config.bgColor} ${config.color} shrink-0`}>
                          {config.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-semibold text-[#dae2fd]">{evt.title}</h3>
                            {isExpanded ? (
                              <ChevronDown className="w-3 h-3 text-[#8d90a0] shrink-0" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-[#8d90a0] shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-[#8d90a0]">
                              {new Date(evt.timestamp).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </span>
                            <span className="text-[10px] text-[#8d90a0]">·</span>
                            <span className="text-[10px] font-mono text-[#8d90a0]">
                              {new Date(evt.timestamp).toLocaleTimeString('en-IN', {
                                hour: '2-digit', minute: '2-digit', hour12: false
                              })}
                            </span>
                            <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_COLOR[evt.severity]}`} />
                            <span className="text-[9px] text-[#8d90a0] capitalize">{evt.severity}</span>
                          </div>

                          {isExpanded && (
                            <div className="mt-2.5 space-y-2 fade-in">
                              <p className="text-[11px] text-[#c3c6d7] leading-relaxed">
                                {evt.description}
                              </p>

                              {evt.nodeId && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNodeSelect?.(evt.nodeId!);
                                  }}
                                  className="flex items-center gap-1 text-[10px] text-[#b4c5ff] hover:text-[#dae2fd] transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>View {evt.nodeId} in graph</span>
                                </button>
                              )}

                              <div className="flex flex-wrap gap-1 pt-1">
                                {evt.tags.map(tag => (
                                  <span key={tag} className="bg-[#222a3d] text-[9px] font-medium px-2 py-0.5 rounded text-[#8d90a0]">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
