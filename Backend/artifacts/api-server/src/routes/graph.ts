import { Router, type Request, type Response } from "express";
import { appendAuditEntry } from "../lib/audit";

const router = Router();

const MOCK_GRAPH = {
  nodes: [
    { id: "S-192-KLR", label: "S-192-KLR", type: "suspect", code: "Karan Singh (Primary)", riskScore: 82, x: 400, y: 300, subLabel: "Primary Suspect" },
    { id: "KA-01-MQ-XXXX", label: "KA-01-MQ-XXXX", type: "vehicle", code: "Vehicle Ownership", x: 520, y: 400, subLabel: "BLACK SUV" },
    { id: "FIR-102/2023", label: "FIR 102/2023", type: "fir", code: "CASE ASSOCIATION", x: 280, y: 310, subLabel: "Malleswaram Theft" },
    { id: "LOC-SPOT-88", label: "Spot 44-B", type: "location", code: "GPS Spotted", x: 580, y: 200, subLabel: "Majestic Tower" },
    { id: "S-401-MYS", label: "S-401-MYS", type: "suspect", code: "Co-conspirator", x: 200, y: 180, subLabel: "Active Group A-14" },
    { id: "BANK-9912", label: "ACC-88219-X", type: "bank", code: "Financial Link", x: 650, y: 330, subLabel: "UPI Hash #991" },
  ],
  edges: [
    { source: "S-192-KLR", target: "KA-01-MQ-XXXX", relation: "Vehicle Ownership", type: "vehicle" },
    { source: "S-192-KLR", target: "FIR-102/2023", relation: "Case Association", type: "fir" },
    { source: "S-192-KLR", target: "LOC-SPOT-88", relation: "Spotted At", type: "location" },
    { source: "FIR-102/2023", target: "S-401-MYS", relation: "Linked Case", type: "suspect" },
    { source: "KA-01-MQ-XXXX", target: "BANK-9912", relation: "Transaction Track", type: "financial" },
  ],
};

router.post("/v1/query/graphInputs", async (req: Request, res: Response) => {
  const { cypher_query, user_jurisdiction } = req.body as {
    cypher_query: string;
    user_jurisdiction?: string;
  };

  appendAuditEntry({
    user_id: "frontend-user",
    action: "graph_query",
    resource: "cypher_query",
    metadata: { user_jurisdiction, query_preview: cypher_query?.slice(0, 100) },
  });

  return res.json({
    nodes: MOCK_GRAPH.nodes,
    edges: MOCK_GRAPH.edges,
    source_fir_references: ["FIR-102/2023", "FIR-2024-KAR-9981"],
    community_labels: ["Group A-14", "Malleswaram Cluster"],
  });
});

export default router;
