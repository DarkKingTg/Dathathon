export type ViewMode = 'field' | 'graph' | 'semantic' | 'leadership' | 'timeline' | 'audit';

export type UserRole = 'Field Officer (SHO)' | 'Investigative Analyst' | 'Leadership / Commissioner';

export interface Suspect {
  id: string;
  personId: string;
  name: string;
  firNumber: string;
  bnsSection: string;
  lastActivity: string;
  mugshotUrl: string;
  aadharUid: string;
  riskScore: number;
  riskLevel: 'CRITICAL / EXTREME' | 'HIGH' | 'MEDIUM' | 'LOW';
  networkDensity: number;
  status: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'suspect' | 'vehicle' | 'location' | 'fir' | 'phone' | 'bank';
  code: string;
  riskScore?: number;
  x: number;
  y: number;
  icon?: string;
  subLabel?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  relation: string;
  type: 'suspect' | 'vehicle' | 'financial' | 'fir' | 'location';
  color?: string;
}

export interface MatchingCase {
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

export interface XAILog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export interface DossierConfig {
  includeChatHistory: boolean;
  includeGraphSnapshot: boolean;
  includeMoMatches: boolean;
  includeXaiTrail: boolean;
  caseReference: string;
  analystNotes: string;
}

export interface VoiceQuery {
  id: string;
  timestamp: string;
  rawKannada: string;
  englishInterpretation: string;
  confidence: number;
  status: 'pending' | 'confirmed' | 'edited';
}
