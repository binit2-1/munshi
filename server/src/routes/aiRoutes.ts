import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { getAIResponse, getChatHistory, getAIResponseWithAudio } from "../controllers/aiControllers";

const aiRouter : ExpressRouter = Router();

aiRouter.get("/response", getAIResponse);
aiRouter.post("/audio/response", getAIResponseWithAudio);
aiRouter.get("/history", getChatHistory);

export default aiRouter;
