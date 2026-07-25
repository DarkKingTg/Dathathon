import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import queryRouter from "./query";
import graphRouter from "./graph";
import searchRouter from "./search";
import dossierRouter from "./dossier";
import auditRouter from "./audit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(queryRouter);
router.use(graphRouter);
router.use(searchRouter);
router.use(dossierRouter);
router.use(auditRouter);

export default router;
