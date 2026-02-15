import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { newTransaction } from "../controllers/transactionControllers";

const transactionRouter: ExpressRouter = Router();

transactionRouter.post("/new", newTransaction);

export default transactionRouter;

