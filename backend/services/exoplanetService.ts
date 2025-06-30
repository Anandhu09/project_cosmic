import axios from "axios";
import cache from "memory-cache";
import ExoplanetModel from "../models/Exoplanet";
import type { Exoplanet } from "../types/exoplanet";

const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const fetchExoplanets = async (
  starType?: string,
  radiusMin?: number,
  radiusMax?: number
): Promise<{
  data: Exoplanet[];
  total: number;
  statistics: { averageRadius: string; anomalies: any[] };
}> => {
  const cacheKey = `exoplanets_${starType || "all"}_${radiusMin || "all"}_${
    radiusMax || "all"
  }`;
  let exoplanets = cache.get(cacheKey);

  if (!exoplanets) {
    let query =
      "SELECT TOP 100 pl_name, pl_rade, pl_orbper, discoverymethod, st_spectype FROM pscomppars WHERE pl_name IS NOT NULL";
    if (starType) {
      const sanitizedStarType = starType.replace(/[^A-Za-z0-9\sV]/g, "").trim();
      if (!sanitizedStarType) {
        const error = new Error("Invalid starType parameter");
        (error as any).status = 400;
        throw error;
      }

      query += ` AND st_spectype LIKE '${sanitizedStarType}'`;
    }
    if (radiusMin) query += ` AND pl_rade >= ${radiusMin}`;
    if (radiusMax) query += ` AND pl_rade <= ${radiusMax}`;
    query = encodeURIComponent(query);

    console.log(`TAP Query: ${query}`);

    const response = await axios.get(
      `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${query}&format=json`,
      { timeout: 10000 }
    );

    console.log(`NASA API Response: ${response.data.length} exoplanets`);

    if (!response.data || response.data.length === 0) {
      const error = new Error("No exoplanet data available");
      (error as any).status = 404;
      throw error;
    }

    const exoplanetsData: Exoplanet[] = response.data.map(
      (exo: any): Exoplanet => ({
        name: exo.pl_name || "Unknown",
        radius: exo.pl_rade || 0,
        orbitalPeriod: exo.pl_orbper || 0,
        discoveryMethod: exo.discoverymethod || "Unknown",
        starType: (exo.st_spectype || "Unknown").trim(),
      })
    );

    const radii = exoplanetsData.map((exo) => exo.radius).filter((r) => r > 0);
    const meanRadius =
      radii.length > 0 ? radii.reduce((a, b) => a + b, 0) / radii.length : 0;
    const anomalies = exoplanetsData
      .filter((exo) => exo.radius > meanRadius * 2)
      .map((exo) => ({
        name: exo.name,
        radius: exo.radius,
        deviation: (exo.radius - meanRadius).toFixed(2),
      }));

    exoplanets = {
      data: exoplanetsData,
      total: exoplanetsData.length,
      statistics: {
        averageRadius: meanRadius.toFixed(2),
        anomalies,
      },
    };

    cache.put(cacheKey, exoplanets, CACHE_DURATION);

    const bulkOps = exoplanetsData.map((exoplanet) => ({
      updateOne: {
        filter: { name: exoplanet.name },
        update: { $set: exoplanet },
        upsert: true,
      },
    }));
    if (bulkOps.length > 0) {
      await ExoplanetModel.bulkWrite(bulkOps);
    }
  }

  return exoplanets;
};
