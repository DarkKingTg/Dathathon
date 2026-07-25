import { Router, type Request, type Response } from "express";
import { appendAuditEntry } from "../lib/audit";

const router = Router();

router.post("/v1/dossier/exportInputs", async (req: Request, res: Response) => {
  const { session_id, graph_snapshot_ids, user_role } = req.body as {
    session_id: string;
    graph_snapshot_ids: string[];
    user_role: string;
  };

  appendAuditEntry({
    user_id: "frontend-user",
    action: "dossier_export",
    resource: "dossier_generation",
    metadata: { session_id, graph_snapshot_ids, user_role },
  });

  return res.json({
    signed_pdf_url: `https://example.com/downloads/${session_id || "KSP-DOSSIER"}.pdf`,
    watermark: "Analyst Verification Required",
    generated_at: new Date().toISOString(),
    signature: "KSP_ANAL_7721_AABB_CC",
    status: "ready",
  });
});

export default router;
