import axios from 'axios';
import cache from 'memory-cache';
import NEOModel from '../models/NEO';
import type { NEO } from '../types/neo';
import { env } from '../config/env';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const fetchNeos = async (
  hazardous?: boolean,
  date?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: NEO[]; total: number; page: number; limit: number }> => {
  const cacheKey = `neos_${hazardous ?? 'all'}_${date || 'all'}_${page}_${limit}`;
  let neos = cache.get(cacheKey);

  if (!neos) {
    if (!env.NASA_API_KEY) {
      const error = new Error('NASA_API_KEY is not defined');
      (error as any).status = 500;
      throw error;
    }

    const fetchDate = date || new Date().toISOString().split('T')[0];
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${fetchDate}&end_date=${fetchDate}&api_key=${env.NASA_API_KEY}`,
      { timeout: 10000 }
    );

    if (!response.data.near_earth_objects || Object.values(response.data.near_earth_objects).length === 0) {
      const error = new Error('No NEO data available');
      (error as any).status = 404;
      throw error;
    }

    const neosData: NEO[] = Object.values(response.data.near_earth_objects)
      .flat()
      .map((neo: any): NEO => ({
        id: neo.id,
        name: neo.name,
        diameter: neo.estimated_diameter.kilometers.estimated_diameter_max,
        velocity: parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour || 0),
        closeApproachDate: neo.close_approach_data[0]?.close_approach_date || '',
        isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
      }));

    let filteredNeos = neosData;
    if (hazardous !== undefined) {
      filteredNeos = neosData.filter((neo) => neo.isPotentiallyHazardous === hazardous);
    }

    const start = (page - 1) * limit;
    const paginatedNeos = filteredNeos.slice(start, start + limit);

    const responseData = {
      data: paginatedNeos,
      total: filteredNeos.length,
      page,
      limit,
    };

    cache.put(cacheKey, responseData, CACHE_DURATION);

    const bulkOps = neosData.map((neo) => ({
      updateOne: {
        filter: { id: neo.id },
        update: { $set: neo },
        upsert: true,
      },
    }));
    if (bulkOps.length > 0) {
      await NEOModel.bulkWrite(bulkOps);
    }

    neos = responseData;
  }

  return neos;
};