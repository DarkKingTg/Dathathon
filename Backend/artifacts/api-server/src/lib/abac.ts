import { type NextFunction, type Request, type Response } from "express";
import { type JwtUserPayload } from "./auth";

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
  queryFilters?: Record<string, string>;
}

export const abacMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthenticatedRequest;
  const user = authReq.user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (user.role === "station") {
    if (!user.home_district) {
      res.status(403).json({ error: "Station-level user missing home district" });
      return;
    }
    authReq.queryFilters = { district: user.home_district };
  } else if (user.role === "leadership") {
    authReq.queryFilters = {};
  } else {
    authReq.queryFilters = { district: user.home_district ?? "" };
  }

  next();
};
