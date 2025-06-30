import { Router } from "express";
import { getNeos } from "../controllers/neoController";

const router = Router();

router.get("/", getNeos);

export default router;
