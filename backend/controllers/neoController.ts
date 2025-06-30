import { Request, Response } from "express";
import * as NeoService from "../services/neoService";

export const getNeos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hazardous, date, page = "1", limit = "10" } = req.query;

    if (hazardous && !["true", "false"].includes(hazardous as string)) {
      const error = new Error("Invalid hazardous parameter");
      (error as any).status = 400;
      throw error;
    }
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date as string)) {
      const error = new Error("Invalid date parameter, must be YYYY-MM-DD");
      (error as any).status = 400;
      throw error;
    }
    if (
      isNaN(parseInt(page as string, 10)) ||
      parseInt(page as string, 10) < 1
    ) {
      const error = new Error("Invalid page parameter");
      (error as any).status = 400;
      throw error;
    }
    if (
      isNaN(parseInt(limit as string, 10)) ||
      parseInt(limit as string, 10) < 1
    ) {
      const error = new Error("Invalid limit parameter");
      (error as any).status = 400;
      throw error;
    }

    const responseData = await NeoService.fetchNeos(
      hazardous ? hazardous === "true" : undefined,
      date as string | undefined,
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    res.status(200).json(responseData);
  } catch (error) {
    const status = (error as any).status || 500;
    const message =
      (error as any).response?.data?.error || (error as Error).message;
    res.status(status).json({ error: { message, status } });
  }
};
