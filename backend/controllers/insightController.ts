import { Request, Response } from "express";
import * as InsightService from "../services/insightService";

export const getInsights = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const isFullResponse = req.query.full === "true";
    const solFilter = req.query.sol ? Number(req.query.sol) : null;

    if (solFilter !== null && isNaN(solFilter)) {
      const error = new Error("Invalid sol parameter");
      (error as any).status = 400;
      throw error;
    }

    const data = await InsightService.fetchInsights(isFullResponse, solFilter);

    res.status(200).json(data);
  } catch (error: any) {
    const status = error.status || 500;
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Internal server error";
    res.status(status).json({ error: { message, status } });
  }
};
