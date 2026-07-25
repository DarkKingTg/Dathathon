const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export interface QueryResponse {
  synthesized_text: string;
  graph_payload: {
    nodes: Array<{
      id: string;
      label: string;
      type: string;
      code: string;
      riskScore?: number;
      x: number;
      y: number;
      subLabel?: string;
    }>;
    edges: Array<{
      source: string;
      target: string;
      relation: string;
      type: string;
    }>;
  };
  citation_metadata: {
    referenced_fir_ids: string[];
    legal_codes: string[];
    executed_statement: string | null;
  };
  verification_required: boolean;
}

export interface SearchMatch {
  id: string;
  firNumber: string;
  districtTag: string;
  isCrossDistrict: boolean;
  matchScore: number;
  summaryText: string;
  highlights: string[];
  tags: string[];
  moCategory: string;
  date: string;
}

export interface SearchResponse {
  matches: SearchMatch[];
  threshold: number;
  district_filter: string | undefined;
  total_results: number;
}

export interface DossierResponse {
  signed_pdf_url: string;
  watermark: string;
  generated_at: string;
  signature: string;
  status: string;
}

export interface GraphResponse {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    code: string;
    riskScore?: number;
    x: number;
    y: number;
    subLabel?: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    relation: string;
    type: string;
  }>;
  source_fir_references: string[];
  community_labels: string[];
}

export const api = {
  health: () => apiGet<{ status: string; timestamp: string }>('/healthz'),

  interpretQuery: (queryText: string, languageCode?: string) =>
    apiPost<QueryResponse>('/v1/query/natural-languageInputs', {
      query_text: queryText,
      language_code: languageCode,
    }),

  searchMo: (moText: string, similarityThreshold?: number, districtFilter?: string) =>
    apiPost<SearchResponse>('/v1/search/moInputs', {
      mo_text: moText,
      similarity_threshold: similarityThreshold,
      district_filter: districtFilter,
    }),

  exportDossier: (sessionId: string, graphSnapshotIds: string[], userRole: string) =>
    apiPost<DossierResponse>('/v1/dossier/exportInputs', {
      session_id: sessionId,
      graph_snapshot_ids: graphSnapshotIds,
      user_role: userRole,
    }),

  graphQuery: (cypherQuery: string, userJurisdiction?: string) =>
    apiPost<GraphResponse>('/v1/query/graphInputs', {
      cypher_query: cypherQuery,
      user_jurisdiction: userJurisdiction,
    }),
};
