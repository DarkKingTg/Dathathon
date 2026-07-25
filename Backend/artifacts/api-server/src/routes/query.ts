import { Router, type Request, type Response } from "express";
import { redactPII, anonymizeText } from "../lib/pii";
import { abacMiddleware, type AuthenticatedRequest } from "../lib/abac";
import { requireAuth, requireMfa } from "../lib/auth";
import { appendAuditEntry } from "../lib/audit";

const router = Router();

const MOCK_RESPONSES: Record<string, object> = {
  default: {
    synthesized_text: "Query processed. Results matched against 3 active investigation threads in Karnataka State Police intelligence ledger.",
    graph_payload: {
      nodes: [
        { id: "S-192-KLR", label: "S-192-KLR", type: "suspect", code: "Karan Singh", riskScore: 82, x: 400, y: 300 },
        { id: "FIR-102/2023", label: "FIR 102/2023", type: "fir", code: "Malleswaram Theft", x: 280, y: 310 },
        { id: "KA-01-MQ-XXXX", label: "KA-01-MQ-XXXX", type: "vehicle", code: "BLACK SUV", x: 520, y: 400 },
        { id: "LOC-SPOT-88", label: "Spot 44-B", type: "location", code: "Majestic Tower", x: 580, y: 200 },
      ],
      edges: [
        { source: "S-192-KLR", target: "FIR-102/2023", relation: "Case Association", type: "fir" },
        { source: "S-192-KLR", target: "KA-01-MQ-XXXX", relation: "Vehicle Ownership", type: "vehicle" },
        { source: "S-192-KLR", target: "LOC-SPOT-88", relation: "Spotted At", type: "location" },
      ],
    },
    citation_metadata: {
      referenced_fir_ids: ["FIR-102/2023", "FIR-2024-KAR-9981"],
      legal_codes: ["BNS-303", "BNS-379"],
      executed_statement: "MATCH (s:Suspect)-[:LINKED_TO]->(f:FIR) WHERE s.id = 'S-192-KLR' RETURN s, f",
    },
    verification_required: true,
  },
};

router.post(
  "/v1/query/natural-languageInputs",
  async (req: Request, res: Response) => {
    const { query_text, language_code } = req.body as {
      query_text: string;
      language_code?: string;
    };

    const sanitizedQuery = anonymizeText(redactPII(query_text || ""));

    appendAuditEntry({
      user_id: "frontend-user",
      action: "natural_language_query",
      resource: "query_text",
      metadata: { language_code, query_length: query_text?.length || 0 },
    });

    const lowerQuery = (query_text || "").toLowerCase();
    let response = MOCK_RESPONSES.default;

    if (lowerQuery.includes("vehicle") || lowerQuery.includes("suv") || lowerQuery.includes("car")) {
      response = {
        synthesized_text: `Vehicle query processed: Found 1 active vehicle match — KA-01-MQ-XXXX (Black SUV) linked to suspect S-192-KLR. Last GPS spotted near Majestic Tower.`,
        graph_payload: {
          nodes: [
            { id: "KA-01-MQ-XXXX", label: "KA-01-MQ-XXXX", type: "vehicle", code: "Black SUV", x: 400, y: 300 },
            { id: "S-192-KLR", label: "S-192-KLR", type: "suspect", code: "Karan Singh", x: 250, y: 400 },
            { id: "LOC-SPOT-88", label: "Spot 44-B", type: "location", code: "Majestic Tower", x: 550, y: 200 },
          ],
          edges: [
            { source: "S-192-KLR", target: "KA-01-MQ-XXXX", relation: "Vehicle Ownership", type: "vehicle" },
            { source: "KA-01-MQ-XXXX", target: "LOC-SPOT-88", relation: "Last Seen At", type: "location" },
          ],
        },
        citation_metadata: { referenced_fir_ids: ["FIR-102/2023"], legal_codes: ["BNS-303"], executed_statement: null },
        verification_required: true,
      };
    } else if (lowerQuery.includes("location") || lowerQuery.includes("area") || lowerQuery.includes("malleshwaram") || lowerQuery.includes("cross")) {
      response = {
        synthesized_text: `Location query processed: Malleshwaram 8th Cross flagged in 2 active investigations. 3 suspects spotted in the area within the last 48 hours.`,
        graph_payload: {
          nodes: [
            { id: "LOC-MAL-8", label: "Malleshwaram 8th Cross", type: "location", code: "Crime Hotspot", x: 400, y: 300 },
            { id: "S-192-KLR", label: "S-192-KLR", type: "suspect", code: "Karan Singh", x: 250, y: 200 },
            { id: "S-401-MYS", label: "S-401-MYS", type: "suspect", code: "Co-conspirator", x: 550, y: 200 },
          ],
          edges: [
            { source: "S-192-KLR", target: "LOC-MAL-8", relation: "Spotted At", type: "location" },
            { source: "S-401-MYS", target: "LOC-MAL-8", relation: "Spotted At", type: "location" },
          ],
        },
        citation_metadata: { referenced_fir_ids: ["FIR-102/2023", "FIR-2024-KAR-8120"], legal_codes: ["BNS-303"], executed_statement: null },
        verification_required: true,
      };
    }

    return res.json(response);
  },
);

export default router;
