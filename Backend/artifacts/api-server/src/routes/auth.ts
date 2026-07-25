import { Router, type Request, type Response } from "express";
import { createAccessToken, createRefreshToken, rotateRefreshToken } from "../lib/auth";
import { appendAuditEntry } from "../lib/audit";

const router = Router();

router.post("/v1/auth/token", (req: Request, res: Response) => {
  const { user_id, role, home_district, clearance_level, mfa_verified } = req.body as {
    user_id: string;
    role: string;
    home_district?: string;
    clearance_level?: number;
    mfa_verified?: boolean;
  };

  const payload = { user_id, role, home_district, clearance_level, mfa_verified };
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  appendAuditEntry({
    user_id,
    action: "auth_token_issue",
    resource: "oauth2_token",
    metadata: { role, home_district, clearance_level },
  });

  res.json({ access_token: accessToken, refresh_token: refreshToken, expires_in: 900 });
});

router.post("/v1/auth/refresh", (req: Request, res: Response) => {
  const { refresh_token } = req.body as { refresh_token: string };
  if (!refresh_token) {
    return res.status(400).json({ error: "refresh_token is required" });
  }

  try {
    const newRefreshToken = rotateRefreshToken(refresh_token);
    appendAuditEntry({
      user_id: "unknown",
      action: "auth_refresh",
      resource: "oauth2_refresh",
      metadata: { rotated: true },
    });
    return res.json({ refresh_token: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

export default router;
