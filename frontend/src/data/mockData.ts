import { Suspect, GraphNode, GraphLink, MatchingCase, XAILog, VoiceQuery } from '../types';

export const ASSET_IMAGES = {
  policeOfficer: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEoq35WuTb3UPw-MN-Jb2g10IcMwOR-sd7UeiZ-IX7JWRoeuY18La-KNFZtiCqQ3iPmyKft3f9U9TDwOrMj_fL6ulTnHw5s4Fkdki-tK4pUMO_7tPCo92R4u_SP-ejNZanxVgVlwInjTqu26ZYLYKbYzFCN0R73tZO0x5oWgaxefrqcki9IP7ZGQesPbWRK-1gjFiXLmnUK5KOIzcJv-yjmZ6QQYT97ln4qhsPgj0JiN4Br69j8hZcPJHg_olGD9BYe98dihwNMaN7',
  suspectMugshot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkAppC_AsXjuplmv_lOmciav7TCz5kIMjZ6w3iX7PWqjtfPQdB0NWgn1jVj2V-DLqu_amgQQ5JLV1GvVb2KxQIsWKr-wNb-2mcwqp8LRTneT6mErNpRzWEIknkL9H3I2o29Dnn1ex6drCign9OeoMLLdZncXT1G5Z_nnMFX5GWSvynPfW7cEolDQv4jHlC0iXghoQfxJdHAuh_ClV2Kr8PKDXLh7J8MjjwnKzhtnJMd0-Jdyf1BHGcNVfAuDJrtnr0G4HgGC3ooNBV',
  policeEmblem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc38YsOtvLp_MGLohiVJMXVEM3-aHkQ-RE6lqwBU4ZaXn7GkKQ1b690ngrAEB6dKz-WgLpBj0JBlfJ6mWeh1_n7jsTtxPfkPxjnHnqOklZGqkoH8jD2dgsmBmQ4H25Wa7yV5Q8a0D4RkOe6vzqntve6BUq8sge2kSazAnMW6iVUE7IwpuCU9OhWAd99Upnoft0WesMhwAu961pPntoUir135VPgyZkOMey9BV0d1eBSqCyGbncskA7XwLpt2R0FxY8erdpQ3N-IuuU',
  graphSnapshot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_T2THOAYIfYJfROCesg-jUUSrSzSUDPCEZxOnRmJgU0ac1G3KXknlWPq-9McJw4Co49ShMfXsIzPM1glNjiMhTzjiDS7zyOvJdB_FnfMQUtyhMpkBhr1Mj1R1FNV6wmmDv3y3JpedvqLFBFpiE-q2emTRbk-AB5KAndXLtv0FjKvIjSD6sFai_xQY2DDL43bwW88w7Fb50dl9QFBIvO41WrGUggMD3kzwGDzo2wTrLh2fY4nUjyJkczIDyvO_211K6Wi2tdPEbCAn',
  cctvCar: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
  fingerprint: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80'
};

export const INITIAL_SUSPECTS: Suspect[] = [
  {
    id: 'S-192-KLR',
    personId: '99283-K',
    name: 'Karan Singh',
    firNumber: '102/2023',
    bnsSection: 'BNS-303',
    lastActivity: '14-Nov-2023',
    mugshotUrl: ASSET_IMAGES.suspectMugshot,
    aadharUid: 'XXXX-XXXX-8821',
    riskScore: 82,
    riskLevel: 'CRITICAL / EXTREME',
    networkDensity: 42,
    status: 'Primary Suspect'
  },
  {
    id: '99283-K',
    personId: '99283-K',
    name: 'Karthik S.',
    firNumber: '#22/2024',
    bnsSection: 'BNS-303',
    lastActivity: '2h ago',
    mugshotUrl: ASSET_IMAGES.suspectMugshot,
    aadharUid: 'XXXX-XXXX-4419',
    riskScore: 78,
    riskLevel: 'HIGH',
    networkDensity: 18,
    status: 'Active Field Target'
  }
];

export const INITIAL_GRAPH_NODES: GraphNode[] = [
  {
    id: 'S-192-KLR',
    label: 'S-192-KLR',
    code: 'Karan Singh (Primary)',
    type: 'suspect',
    riskScore: 82,
    x: 400,
    y: 300,
    subLabel: 'Primary Suspect'
  },
  {
    id: 'KA-01-MQ-XXXX',
    label: 'KA-01-MQ-XXXX',
    code: 'Vehicle Ownership',
    type: 'vehicle',
    x: 520,
    y: 400,
    subLabel: 'BLACK SUV'
  },
  {
    id: 'FIR-102/2023',
    label: 'FIR 102/2023',
    code: 'CASE ASSOCIATION',
    type: 'fir',
    x: 280,
    y: 310,
    subLabel: 'Malleswaram Theft'
  },
  {
    id: 'LOC-SPOT-88',
    label: 'Spot 44-B',
    code: 'GPS Spotted',
    type: 'location',
    x: 580,
    y: 200,
    subLabel: 'Majestic Tower'
  },
  // 2-Hop Nodes (expandable)
  {
    id: 'S-401-MYS',
    label: 'S-401-MYS',
    code: 'Co-conspirator',
    type: 'suspect',
    x: 200,
    y: 180,
    subLabel: 'Active Group A-14'
  },
  {
    id: 'BANK-9912',
    label: 'ACC-88219-X',
    code: 'Financial Link',
    type: 'bank',
    x: 650,
    y: 330,
    subLabel: 'UPI Hash #991'
  }
];

export const INITIAL_GRAPH_LINKS: GraphLink[] = [
  { source: 'S-192-KLR', target: 'KA-01-MQ-XXXX', relation: 'Vehicle Ownership', type: 'vehicle' },
  { source: 'S-192-KLR', target: 'FIR-102/2023', relation: 'Case Association', type: 'fir' },
  { source: 'S-192-KLR', target: 'LOC-SPOT-88', relation: 'Spotted At', type: 'location' },
  { source: 'FIR-102/2023', target: 'S-401-MYS', relation: 'Linked Case', type: 'suspect' },
  { source: 'KA-01-MQ-XXXX', target: 'BANK-9912', relation: 'Transaction Track', type: 'financial' }
];

export const INITIAL_MATCHING_CASES: MatchingCase[] = [
  {
    id: 'FIR-2024-KAR-9981',
    firNumber: 'FIR #2024-KAR-9981',
    districtTag: 'CROSS-DISTRICT: MYSURU',
    isCrossDistrict: true,
    matchScore: 94,
    summaryText: '"Forced entry via rear ventilation shaft, bypass of biometric alarm..."',
    highlights: ['specific hydraulic tension tool', 'powdered graphite'],
    tags: ['NIGHT SHIFT', 'HIGH-VALUE TARGET', 'ACTIVE SUSPECT GROUP A-14'],
    moCategory: 'Organized Burglary',
    date: '2024-03-12'
  },
  {
    id: 'FIR-2024-KAR-8120',
    firNumber: 'FIR #2024-KAR-8120',
    districtTag: 'LOCAL: BENGALURU URBAN',
    isCrossDistrict: false,
    matchScore: 87,
    summaryText: '"Industrial warehouse breach, neutralization of surveillance..."',
    highlights: ['severing of secondary power lines', 'signal jammers'],
    tags: ['TECH SAVVY', 'COORDINATED'],
    moCategory: 'Warehouse Breach',
    date: '2024-02-18'
  },
  {
    id: 'FIR-2023-KAR-0144',
    firNumber: 'FIR #2023-KAR-0144',
    districtTag: 'CROSS-DISTRICT: HUBBALLI',
    isCrossDistrict: true,
    matchScore: 82,
    summaryText: '"Jewelry store heist via adjacent wall penetration..."',
    highlights: ['structural demolition techniques'],
    tags: ['WALL BREACH', 'SILENT COBRA GROUP'],
    moCategory: 'Commercial Heist',
    date: '2023-11-04'
  }
];

export const INITIAL_XAI_LOGS: XAILog[] = [
  { timestamp: '01.24.23 14:10:02', level: 'INFO', message: 'Identifying cross-referenced FIR 102/2023.' },
  { timestamp: '01.24.23 14:10:15', level: 'INFO', message: 'Mapping GPS coordinates to Bangalore North Zone.' },
  { timestamp: '01.25.23 09:22:40', level: 'WARN', message: 'Link probability exceeds threshold for direct collaboration.' },
  { timestamp: '01.25.23 11:05:12', level: 'INFO', message: 'Cross-reference with central ledger complete. 4 secondary hits verified.' }
];

export const PENDING_VOICE_QUERIES: VoiceQuery[] = [
  {
    id: 'VQ-1092',
    timestamp: '14:05',
    rawKannada: 'ಮಲ್ಲೇಶ್ವರಂ 8ನೇ ಕ್ರಾಸ್‌ನಲ್ಲಿ ಶಂಕಿತ ವ್ಯಕ್ತಿಯನ್ನು ಪತ್ತೆ ಹಚ್ಚಿ',
    englishInterpretation: 'Locate suspect at Malleshwaram 8th cross',
    confidence: 64,
    status: 'pending'
  },
  {
    id: 'VQ-1093',
    timestamp: '13:42',
    rawKannada: 'ಮಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣದ ಬಳಿ KA 01 MQ ಸರಣಿಯ ಕಪ್ಪು SUV ವಿವರ ಕೊಡಿ',
    englishInterpretation: 'Provide details for black SUV of KA 01 MQ series near Majestic bus stand',
    confidence: 89,
    status: 'confirmed'
  }
];
