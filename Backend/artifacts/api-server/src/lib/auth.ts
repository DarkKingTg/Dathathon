import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET ?? "replace-with-secure-access-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? "replace-with-secure-refresh-secret";
const accessTokenExpiry = "15m";
const refreshTokenExpiry = "7d";

export interface JwtUserPayload {
  user_id: string;
  role: string;
  home_district?: string;
  clearance_level?: number;
  mfa_verified?: boolean;
}

const refreshTokenStore = new Map<string, string>();

export const createAccessToken = (payload: JwtUserPayload): string =>
  jwt.sign(payload, accessSecret, { expiresIn: accessTokenExpiry });

export const createRefreshToken = (payload: JwtUserPayload): string => {
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: refreshTokenExpiry });
  refreshTokenStore.set(payload.user_id, refreshToken);
  return refreshToken;
};

export const verifyAccessToken = (token: string): JwtUserPayload =>
  jwt.verify(token, accessSecret) as JwtUserPayload;

export const verifyRefreshToken = (token: string): JwtUserPayload =>
  jwt.verify(token, refreshSecret) as JwtUserPayload;

export const rotateRefreshToken = (oldToken: string): string => {
  const payload = verifyRefreshToken(oldToken);
  const storedToken = refreshTokenStore.get(payload.user_id);
  if (storedToken !== oldToken) {
    throw new Error("Refresh token is invalid or has already been rotated.");
  }
  return createRefreshToken(payload);
};

const getBearerToken = (req: Request): string | undefined => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }
  return authorization.slice(7);
};

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Authorization token missing" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    (req as Request & { user?: JwtUserPayload }).user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireMfa = (req: Request, res: Response, next: NextFunction): void => {
  const reqWithUser = req as Request & { user?: JwtUserPayload };
  const user = reqWithUser.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (user.role !== "analyst" && user.role !== "leadership") {
    res.status(403).json({ error: "MFA required for this endpoint" });
    return;
  }

  if (!user.mfa_verified) {
    res.status(403).json({ error: "MFA verification required" });
    return;
  }

  next();
};
