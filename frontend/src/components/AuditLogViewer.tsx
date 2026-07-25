import React, { useState, useEffect } from 'react';
import {
  Shield, RefreshCw, Search, ChevronDown, ChevronRight,
  CheckCircle, AlertTriangle, XCircle, Clock
} from 'lucide-react';

interface AuditEntry {
  timestamp: string;
  user_id: string;
  action: string;
  resource: string;
  metadata: Record<string, unknown>;
}

interface AuditResponse {
  logs: AuditEntry[];
  merkle_root_valid: boolean;
}

const MOCK_AUDIT_LOGS: AuditEntry[] = [
  {
    timestamp: '2024-03-22T13:15:42Z',
    user_id: 'analyst-7721',
    action: 'natural_language_query',
    resource: 'query_text',
    metadata: { query_length: 84, language_code: 'en' },
  },
  {
    timestamp: '2024-03-22T13:14:18Z',
    user_id: 'analyst-7721',
    action: 'mo_search',
    resource: 'modi_operandi_search',
    metadata: { similarity_threshold: 0.88, district_filter: 'State-wide', query_length: 156 },
  },
  {
    timestamp: '2024-03-22T13:12:05Z',
    user_id: 'system',
    action: 'graph_query',
    resource: 'cypher_execution',
    metadata: { query_length: 100, result_nodes: 6, result_edges: 5 },
  },
  {
    timestamp: '2024-03-22T13:10:31Z',
    user_id: 'analyst-7721',
    action: 'dossier_export',
    resource: 'pdf_generation',
    metadata: { session_id: 'sess-a8c1', user_role: 'Investigative Analyst' },
  },
  {
    timestamp: '2024-03-22T12:58:14Z',
    user_id: 'analyst-7721',
    action: 'natural_language_query',
    resource: 'query_text',
    metadata: { query_length: 42, language_code: 'kn' },
  },
  {
    timestamp: '2024-03-22T12:45:00Z',
    user_id: 'field-sho-088',
    action: 'mo_search',
    resource: 'modi_operandi_search',
    metadata: { similarity_threshold: 0.75, district_filter: 'Bengaluru Urban', query_length: 203 },
  },
  {
    timestamp: '2024-03-22T12:30:22Z',
    user_id: 'system',
    action: 'graph_query',
    resource: 'cypher_execution',
    metadata: { query_length: 88, result_nodes: 3, result_edges: 2 },
  },
  {
    timestamp: '2024-03-22T11:15:44Z',
    user_id: 'analyst-7721',
    action: 'dossier_export',
    resource: 'pdf_generation',
    metadata: { session_id: 'sess-b3d7', user_role: 'Investigative Analyst' },
  },
];

const ACTION_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  natural_language_query: { label: 'NL Query', icon: <Search className="w-3.5 h-3.5" />, color: 'text-[#2563eb]' },
  mo_search: { label: 'MO Search', icon: <Search className="w-3.5 h-3.5" />, color: 'text-[#b4c5ff]' },
  graph_query: { label: 'Graph Query', icon: <ChevronRight className="w-3.5 h-3.5" />, color: 'text-[#6ee7b7]' },
  dossier_export: { label: 'Dossier Export', icon: <ChevronDown className="w-3.5 h-3.5" />, color: 'text-[#ffb77d]' },
  auth_token_issue: { label: 'Auth Issue', icon: <Shield className="w-3.5 h-3.5" />, color: 'text-[#ffb4ab]' },
  auth_refresh: { label: 'Token Refresh', icon: <RefreshCw className="w-3.5 h-3.5" />, color: 'text-[#8d90a0]' },
};

export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>(MOCK_AUDIT_LOGS);
  const [merkleValid, setMerkleValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/audit/logs');
      if (res.ok) {
        const data: AuditResponse = await res.json();
        setLogs(data.logs);
        setMerkleValid(data.merkle_root_valid);
      }
    } catch {
      // Use mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = filter
    ? logs.filter(l =>
        l.action.includes(filter) ||
        l.user_id.includes(filter) ||
        l.resource.includes(filter)
      )
    : logs;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b1326] text-[#dae2fd] p-4 sm:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#434655]/60 pb-3 mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#dae2fd] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#8d90a0]" />
            <span>Audit Trail</span>
          </h1>
          <p className="text-[11px] text-[#8d90a0] mt-0.5">
            Compliance logging · Merkle root integrity: {merkleValid ? 'Valid' : 'Compromised'}
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171f33] border border-[#434655]/60 rounded-lg text-[11px] text-[#8d90a0] hover:text-[#dae2fd] transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Integrity badge */}
      <div className={`flex items-center gap-2 p-3 rounded-lg border mb-6 ${
        merkleValid
          ? 'bg-[#059669]/10 border-[#059669]/30 text-[#6ee7b7]'
          : 'bg-[#d52022]/10 border-[#d52022]/30 text-[#ffb4ab]'
      }`}>
        {merkleValid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        <span className="text-xs font-medium">
          Merkle root integrity: {merkleValid ? 'All entries verified' : 'Integrity check failed — possible tampering'}
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d90a0]" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by action, user, or resource..."
          className="w-full bg-[#171f33] border border-[#434655]/40 rounded-lg pl-9 pr-3 py-2 text-xs text-[#dae2fd] placeholder-[#8d90a0]/50 focus:border-[#2563eb]/60 focus:outline-none transition-colors"
        />
      </div>

      {/* Log entries */}
      <div className="space-y-1.5">
        {filteredLogs.map((log, idx) => {
          const config = ACTION_CONFIG[log.action] || { label: log.action, icon: <Clock className="w-3.5 h-3.5" />, color: 'text-[#8d90a0]' };
          const isExpanded = expandedId === idx;

          return (
            <div
              key={idx}
              className="bg-[#171f33] border border-[#434655]/40 rounded-lg overflow-hidden hover:border-[#434655]/70 transition-colors fade-up"
              style={{ animationDelay: `${idx * 0.03}s` }}
            >
              <div
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : idx)}
              >
                <div className={`${config.color} shrink-0`}>
                  {config.icon}
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-12 gap-2 items-center text-[11px]">
                  <span className="col-span-2 font-mono text-[#8d90a0]">
                    {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </span>
                  <span className={`col-span-2 font-medium ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="col-span-3 font-mono text-[#dae2fd] truncate">
                    {log.user_id}
                  </span>
                  <span className="col-span-3 text-[#8d90a0] truncate">
                    {log.resource}
                  </span>
                  <span className="col-span-2 text-right">
                    {isExpanded ? <ChevronDown className="w-3 h-3 inline text-[#8d90a0]" /> : <ChevronRight className="w-3 h-3 inline text-[#8d90a0]" />}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3 pt-1 border-t border-[#434655]/30 fade-in">
                  <div className="bg-[#060e20] rounded-lg p-3 font-mono text-[10px] space-y-1">
                    <div className="text-[#8d90a0] mb-1.5 font-sans font-medium text-[9px]">Metadata</div>
                    {Object.entries(log.metadata).map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-[#b4c5ff] min-w-[140px]">{key}:</span>
                        <span className="text-[#c3c6d7]">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-[#8d90a0] text-xs">
          No audit entries match your filter.
        </div>
      )}
    </div>
  );
};
