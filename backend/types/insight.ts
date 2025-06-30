export interface Insight {
  sol: number;
  temperature: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  season: string;
  lastUpdated: string;
}

export interface InsightSummary {
  averageTemperature: string;
  averagePressure: string;
  averageWindSpeed: string;
  temperatureTrend: 'Increasing' | 'Decreasing' | 'Unknown';
  anomalies: Array<{ sol: number; temperature: number; deviation: string }>;
}