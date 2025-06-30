import { Router } from "express";
import { getExoplanets } from "../controllers/exoplanetController";

const router = Router();

router.get("/", getExoplanets);

export default router;
