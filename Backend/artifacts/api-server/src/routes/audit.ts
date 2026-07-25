import { Router, type Request, type Response } from "express";
import { getAuditLogs, verifyAuditLogIntegrity } from "../lib/audit";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/v1/audit/logs", requireAuth, (req: Request, res: Response) => {
  const logs = getAuditLogs();
  const valid = verifyAuditLogIntegrity();
  return res.json({ logs, merkle_root_valid: valid });
});

export default router;
