import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { getCurrentStock, updateCurrentStock } from "../controllers/stockControllers";

const stockRouter: ExpressRouter = Router();

stockRouter.get("/", getCurrentStock);

stockRouter.post("/update", updateCurrentStock);

export default stockRouter;