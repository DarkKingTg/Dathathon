import { Router, type Request, type Response } from "express";
import { appendAuditEntry } from "../lib/audit";

const router = Router();

const MOCK_CASES = [
  {
    id: "FIR-2024-KAR-9981",
    firNumber: "FIR #2024-KAR-9981",
    districtTag: "CROSS-DISTRICT: MYSURU",
    isCrossDistrict: true,
    matchScore: 94,
    summaryText: "Forced entry via rear ventilation shaft, bypass of biometric alarm...",
    highlights: ["specific hydraulic tension tool", "powdered graphite"],
    tags: ["NIGHT SHIFT", "HIGH-VALUE TARGET", "ACTIVE SUSPECT GROUP A-14"],
    moCategory: "Organized Burglary",
    date: "2024-03-12",
  },
  {
    id: "FIR-2024-KAR-8120",
    firNumber: "FIR #2024-KAR-8120",
    districtTag: "LOCAL: BENGALURU URBAN",
    isCrossDistrict: false,
    matchScore: 87,
    summaryText: "Industrial warehouse breach, neutralization of surveillance...",
    highlights: ["severing of secondary power lines", "signal jammers"],
    tags: ["TECH SAVVY", "COORDINATED"],
    moCategory: "Warehouse Breach",
    date: "2024-02-18",
  },
  {
    id: "FIR-2023-KAR-0144",
    firNumber: "FIR #2023-KAR-0144",
    districtTag: "CROSS-DISTRICT: HUBBALLI",
    isCrossDistrict: true,
    matchScore: 82,
    summaryText: "Jewelry store heist via adjacent wall penetration...",
    highlights: ["structural demolition techniques"],
    tags: ["WALL BREACH", "SILENT COBRA GROUP"],
    moCategory: "Commercial Heist",
    date: "2023-11-04",
  },
];

router.post("/v1/search/moInputs", async (req: Request, res: Response) => {
  const { mo_text, similarity_threshold = 0.75, district_filter } = req.body as {
    mo_text: string;
    similarity_threshold?: number;
    district_filter?: string;
  };

  appendAuditEntry({
    user_id: "frontend-user",
    action: "mo_search",
    resource: "modi_operandi_search",
    metadata: { district_filter, similarity_threshold, query_length: mo_text?.length || 0 },
  });

  let filteredCases = MOCK_CASES;
  if (district_filter && district_filter !== "State-wide") {
    filteredCases = MOCK_CASES.filter(
      (c) => c.districtTag.includes(district_filter.toUpperCase()) || !c.isCrossDistrict,
    );
  }

  return res.json({
    matches: filteredCases,
    threshold: similarity_threshold,
    district_filter,
    total_results: filteredCases.length,
  });
});

export default router;
