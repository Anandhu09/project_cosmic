export interface Insights {
  sol: number;
  temperature: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  season: string;
  lastUpdated: string;
}

export interface InsightsApiResponse {
  insights: Insights[];
  summary: {
    averageTemperature: string;
    averagePressure: string;
    averageWindSpeed: string;
    temperatureTrend: string;
    anomalies: any[];
  };
}