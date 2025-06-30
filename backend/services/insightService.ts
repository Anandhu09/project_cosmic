import axios from 'axios';
import cache from 'memory-cache';
import InsightModel from '../models/Insights';
import type { Insight, InsightSummary } from '../types/insight';
import { env } from '../config/env';

const CACHE_DURATION = 24 * 60 * 60 * 1000; 

interface Anomaly {
  sol: number;
  temperature: number;
  deviation: string;
}

const generateInsightsSummary = (insights: Insight[]): InsightSummary => {
  const temperatures = insights.map((i) => i.temperature).filter((t) => t !== 0);
  const pressures = insights.map((i) => i.pressure).filter((p) => p !== 0);
  const windSpeeds = insights.map((i) => i.windSpeed).filter((w) => w !== 0);

  const mean = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const stdDev = (arr: number[], meanVal: number) =>
    arr.length ? Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0) / arr.length) : 0;

  const tempMean = mean(temperatures);
  const tempStd = stdDev(temperatures, tempMean);
  const anomalies = insights.filter((i) => i.temperature !== 0 && Math.abs(i.temperature - tempMean) > tempStd);

  return {
    averageTemperature: tempMean.toFixed(2),
    averagePressure: mean(pressures).toFixed(1),
    averageWindSpeed: mean(windSpeeds).toFixed(2),
    temperatureTrend: temperatures.length < 2 ? 'Unknown' : temperatures[0] < temperatures[temperatures.length - 1] ? 'Increasing' : 'Decreasing',
    anomalies: anomalies.map((i) => ({
      sol: i.sol,
      temperature: i.temperature,
      deviation: (i.temperature - tempMean).toFixed(2),
    })),
  };
};

export const fetchInsights = async (
  isFullResponse: boolean,
  solFilter: number | null
): Promise<{ insights: Insight[]; summary: InsightSummary | null } | any> => {
  const cacheKey = isFullResponse
    ? `insights_full_${solFilter || 'all'}`
    : `insights_${solFilter || 'all'}`;
  let data = cache.get(cacheKey);

  if (!data) {
    if (!env.NASA_API_KEY) {
      const error = new Error('NASA_API_KEY is not defined');
      (error as any).status = 500;
      throw error;
    }

    const response = await axios.get(
      `https://api.nasa.gov/insight_weather/?api_key=${env.NASA_API_KEY}&feedtype=json&ver=1.0`,
      { timeout: 10000 }
    );

    if (!response.data.sol_keys || response.data.sol_keys.length === 0) {
      const error = new Error('No Mars weather data available');
      (error as any).status = 503;
      throw error;
    }

    let insights: Insight[] = response.data.sol_keys.map((sol: string): Insight => ({
      sol: Number(sol),
      temperature: response.data[sol].AT?.av || 0,
      pressure: response.data[sol].PRE?.av || 0,
      windSpeed: response.data[sol].HWS?.av || 0,
      windDirection: response.data[sol].WD?.most_common?.compass_degrees || 0,
      season: response.data[sol].Season || 'Unknown',
      lastUpdated: response.data[sol].First_UTC || '',
    }));

    if (solFilter !== null) {
      insights = insights.filter((i) => i.sol === solFilter);
      if (!insights.length) {
        const error = new Error(`No data found for sol ${solFilter}`);
        (error as any).status = 404;
        throw error;
      }
    }

    const summary = isFullResponse || solFilter !== null ? null : generateInsightsSummary(insights);
    data = isFullResponse ? response.data : { insights, summary };
    cache.put(cacheKey, data, CACHE_DURATION);

    const bulkOps = insights.map((insight) => ({
      updateOne: {
        filter: { sol: insight.sol },
        update: { $set: insight },
        upsert: true,
      },
    }));
    if (bulkOps.length > 0) {
      await InsightModel.bulkWrite(bulkOps);
    }
  }

  return data;
};