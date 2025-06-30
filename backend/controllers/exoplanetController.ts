import { Request, Response } from "express";
import * as ExoplanetService from "../services/exoplanetService";

export const getExoplanets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { starType, radiusMin, radiusMax } = req.query;

    if (starType && typeof starType !== "string") {
      console.log(starType, "JJ");
      const error = new Error("starType must be a string");
      (error as any).status = 400;
      throw error;
    }
    if (radiusMin && (isNaN(Number(radiusMin)) || Number(radiusMin) < 0)) {
      const error = new Error("Invalid radiusMin parameter");
      (error as any).status = 400;
      throw error;
    }
    if (radiusMax && (isNaN(Number(radiusMax)) || Number(radiusMax) < 0)) {
      const error = new Error("Invalid radiusMax parameter");
      (error as any).status = 400;
      throw error;
    }
    if (radiusMin && radiusMax && Number(radiusMin) > Number(radiusMax)) {
      const error = new Error("radiusMin cannot be greater than radiusMax");
      (error as any).status = 400;
      throw error;
    }

    const exoplanets = await ExoplanetService.fetchExoplanets(
      starType as string | undefined,
      radiusMin ? Number(radiusMin) : undefined,
      radiusMax ? Number(radiusMax) : undefined
    );

    res.status(200).json(exoplanets);
  } catch (error) {
    const status = (error as any).status || 500;
    const message =
      (error as any).response?.data?.error?.message || (error as Error).message;
    res.status(status).json({ error: { message, status } });
  }
};
