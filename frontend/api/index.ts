import { createHash } from 'node:crypto';

function createToken(payload: Record<string, unknown>): string {
  const h = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const b = Buffer.from(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 900 })).toString('base64url');
  return `${h}.${b}.${createHash('sha256').update(`${h}.${b}`).digest('base64url')}`;
}

const auditLog: any[] = [];
function computeHash(e: any) { return createHash('sha256').update(JSON.stringify(e)).digest('hex'); }
function appendAudit(entry: any) {
  const ph = auditLog.length ? auditLog[auditLog.length - 1].hash : '';
  const n = { id: auditLog.length + 1, previous_hash: ph, timestamp: new Date().toISOString(), ...entry, hash: '' };
  n.hash = computeHash({ id: n.id, previous_hash: n.previous_hash, timestamp: n.timestamp, user_id: n.user_id, action: n.action, resource: n.resource, metadata: n.metadata });
  auditLog.push(n);
}

const GRAPH = {
  nodes: [
    { id: 'S-192-KLR', label: 'S-192-KLR', type: 'suspect', code: 'Karan Singh (Primary)', riskScore: 82, x: 400, y: 300, subLabel: 'Primary Suspect' },
    { id: 'KA-01-MQ-XXXX', label: 'KA-01-MQ-XXXX', type: 'vehicle', code: 'Vehicle Ownership', x: 520, y: 400, subLabel: 'BLACK SUV' },
    { id: 'FIR-102/2023', label: 'FIR 102/2023', type: 'fir', code: 'CASE ASSOCIATION', x: 280, y: 310, subLabel: 'Malleswaram Theft' },
    { id: 'LOC-SPOT-88', label: 'Spot 44-B', type: 'location', code: 'GPS Spotted', x: 580, y: 200, subLabel: 'Majestic Tower' },
    { id: 'S-401-MYS', label: 'S-401-MYS', type: 'suspect', code: 'Co-conspirator', x: 200, y: 180, subLabel: 'Active Group A-14' },
    { id: 'BANK-9912', label: 'ACC-88219-X', type: 'bank', code: 'Financial Link', x: 650, y: 330, subLabel: 'UPI Hash #991' },
  ],
  edges: [
    { source: 'S-192-KLR', target: 'KA-01-MQ-XXXX', relation: 'Vehicle Ownership', type: 'vehicle' },
    { source: 'S-192-KLR', target: 'FIR-102/2023', relation: 'Case Association', type: 'fir' },
    { source: 'S-192-KLR', target: 'LOC-SPOT-88', relation: 'Spotted At', type: 'location' },
    { source: 'FIR-102/2023', target: 'S-401-MYS', relation: 'Linked Case', type: 'suspect' },
    { source: 'KA-01-MQ-XXXX', target: 'BANK-9912', relation: 'Transaction Track', type: 'financial' },
  ],
};

const CASES = [
  { id: 'FIR-2024-KAR-9981', firNumber: 'FIR #2024-KAR-9981', districtTag: 'CROSS-DISTRICT: MYSURU', isCrossDistrict: true, matchScore: 94, summaryText: 'Forced entry via rear ventilation shaft, bypass of biometric alarm...', highlights: ['specific hydraulic tension tool', 'powdered graphite'], tags: ['NIGHT SHIFT', 'HIGH-VALUE TARGET', 'ACTIVE SUSPECT GROUP A-14'], moCategory: 'Organized Burglary', date: '2024-03-12' },
  { id: 'FIR-2024-KAR-8120', firNumber: 'FIR #2024-KAR-8120', districtTag: 'LOCAL: BENGALURU URBAN', isCrossDistrict: false, matchScore: 87, summaryText: 'Industrial warehouse breach, neutralization of surveillance...', highlights: ['severing of secondary power lines', 'signal jammers'], tags: ['TECH SAVVY', 'COORDINATED'], moCategory: 'Warehouse Breach', date: '2024-02-18' },
  { id: 'FIR-2023-KAR-0144', firNumber: 'FIR #2023-KAR-0144', districtTag: 'CROSS-DISTRICT: HUBBALLI', isCrossDistrict: true, matchScore: 82, summaryText: 'Jewelry store heist via adjacent wall penetration...', highlights: ['structural demolition techniques'], tags: ['WALL BREACH', 'SILENT COBRA GROUP'], moCategory: 'Commercial Heist', date: '2023-11-04' },
];

function getBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c: string) => { data += c; });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });
}

function json(res: any, data: any, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' });
  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const rawUrl = req.url || '/';
  const path = rawUrl.split('?')[0];

  try {
    if (path.includes('healthz')) {
      return json(res, { status: 'ok', timestamp: new Date().toISOString(), service: 'KSP-Chanakya API Server', version: '1.0.0' });
    }

    if (path.includes('natural-languageInputs') && req.method === 'POST') {
      const body = await getBody(req);
      appendAudit({ user_id: 'frontend-user', action: 'natural_language_query', resource: 'query_text', metadata: { query_length: body.query_text?.length || 0 } });
      const q = (body.query_text || '').toLowerCase();
      if (q.includes('vehicle') || q.includes('suv') || q.includes('car')) return json(res, { synthesized_text: 'Vehicle query: KA-01-MQ-XXXX (Black SUV) linked to S-192-KLR.', graph_payload: { nodes: [{ id: 'KA-01-MQ-XXXX', label: 'KA-01-MQ-XXXX', type: 'vehicle', code: 'Black SUV', x: 400, y: 300 }, { id: 'S-192-KLR', label: 'S-192-KLR', type: 'suspect', code: 'Karan Singh', x: 250, y: 400 }, { id: 'LOC-SPOT-88', label: 'Spot 44-B', type: 'location', code: 'Majestic Tower', x: 550, y: 200 }], edges: [{ source: 'S-192-KLR', target: 'KA-01-MQ-XXXX', relation: 'Vehicle Ownership', type: 'vehicle' }, { source: 'KA-01-MQ-XXXX', target: 'LOC-SPOT-88', relation: 'Last Seen At', type: 'location' }] }, citation_metadata: { referenced_fir_ids: ['FIR-102/2023'], legal_codes: ['BNS-303'], executed_statement: null }, verification_required: true });
      if (q.includes('location') || q.includes('area') || q.includes('malleshwaram') || q.includes('cross')) return json(res, { synthesized_text: 'Location: Malleshwaram 8th Cross flagged in 2 investigations.', graph_payload: { nodes: [{ id: 'LOC-MAL-8', label: 'Malleshwaram 8th Cross', type: 'location', code: 'Crime Hotspot', x: 400, y: 300 }, { id: 'S-192-KLR', label: 'S-192-KLR', type: 'suspect', code: 'Karan Singh', x: 250, y: 200 }, { id: 'S-401-MYS', label: 'S-401-MYS', type: 'suspect', code: 'Co-conspirator', x: 550, y: 200 }], edges: [{ source: 'S-192-KLR', target: 'LOC-MAL-8', relation: 'Spotted At', type: 'location' }, { source: 'S-401-MYS', target: 'LOC-MAL-8', relation: 'Spotted At', type: 'location' }] }, citation_metadata: { referenced_fir_ids: ['FIR-102/2023', 'FIR-2024-KAR-8120'], legal_codes: ['BNS-303'], executed_statement: null }, verification_required: true });
      return json(res, { synthesized_text: 'Query processed. Results matched against 3 active investigation threads.', graph_payload: { nodes: GRAPH.nodes.slice(0, 4), edges: GRAPH.edges.slice(0, 3) }, citation_metadata: { referenced_fir_ids: ['FIR-102/2023', 'FIR-2024-KAR-9981'], legal_codes: ['BNS-303', 'BNS-379'], executed_statement: "MATCH (s:Suspect)-[:LINKED_TO]->(f:FIR) WHERE s.id = 'S-192-KLR' RETURN s, f" }, verification_required: true });
    }

    if (path.includes('graphInputs') && req.method === 'POST') {
      appendAudit({ user_id: 'frontend-user', action: 'graph_query', resource: 'cypher', metadata: {} });
      return json(res, { nodes: GRAPH.nodes, edges: GRAPH.edges, source_fir_references: ['FIR-102/2023', 'FIR-2024-KAR-9981'], community_labels: ['Group A-14', 'Malleswaram Cluster'] });
    }

    if (path.includes('moInputs') && req.method === 'POST') {
      const body = await getBody(req);
      appendAudit({ user_id: 'frontend-user', action: 'mo_search', resource: 'mo', metadata: { district_filter: body.district_filter } });
      let filtered = CASES;
      if (body.district_filter && body.district_filter !== 'State-wide') filtered = CASES.filter(c => c.districtTag.includes(body.district_filter.toUpperCase()) || !c.isCrossDistrict);
      return json(res, { matches: filtered, threshold: body.similarity_threshold || 0.75, district_filter: body.district_filter, total_results: filtered.length });
    }

    if (path.includes('exportInputs') && req.method === 'POST') {
      const body = await getBody(req);
      appendAudit({ user_id: 'frontend-user', action: 'dossier_export', resource: 'dossier', metadata: {} });
      return json(res, { signed_pdf_url: `https://example.com/downloads/${body.session_id || 'KSP-DOSSIER'}.pdf`, watermark: 'Analyst Verification Required', generated_at: new Date().toISOString(), signature: 'KSP_ANAL_7721_AABB_CC', status: 'ready' });
    }

    if (path.includes('auth/token') && req.method === 'POST') {
      const body = await getBody(req);
      appendAudit({ user_id: body.user_id, action: 'auth_token_issue', resource: 'oauth2', metadata: { role: body.role } });
      return json(res, { access_token: createToken({ user_id: body.user_id, role: body.role }), refresh_token: createToken({ user_id: body.user_id, role: body.role, type: 'refresh' }), expires_in: 900 });
    }

    if (path.includes('auth/refresh') && req.method === 'POST') {
      appendAudit({ user_id: 'unknown', action: 'auth_refresh', resource: 'oauth2', metadata: {} });
      return json(res, { refresh_token: createToken({ user_id: 'unknown', role: 'analyst' }) });
    }

    if (path.includes('audit/logs') && req.method === 'GET') {
      return json(res, { logs: auditLog, merkle_root_valid: true });
    }

    return json(res, { error: 'Not found', path }, 404);
  } catch (err: any) {
    return json(res, { error: err.message }, 500);
  }
}
