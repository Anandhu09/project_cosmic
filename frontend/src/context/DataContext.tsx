import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import config from '../config';
import { Exoplanet } from '../types/exoplanets';
import { NEO } from '../types/neo';
import { InsightsApiResponse } from '../types/insights';

interface ExoplanetApiResponse {
  data: Exoplanet[];
  total: number;
  statistics: {
    averageRadius: string;
    anomalies: Array<{ name: string; radius: number; deviation: string }>;
  };
}

interface NEOApiResponse {
  data: NEO[];
  total: number;
  page: number;
  limit: number;
}

interface DataContextType {
  exoplanets: Exoplanet[] | undefined;
  totalExoplanets: number;
  statistics: ExoplanetApiResponse['statistics'] | undefined;
  exoplanetLoading: boolean;
  exoplanetError: string | null;
  setExoplanetFilters: (filters: { starType?: string; radiusMin?: string; radiusMax?: string }) => void;
  neos: NEO[] | undefined;
  totalNeos: number;
  neoLoading: boolean;
  neoError: string | null;
  refetchNeos: () => void;
  insightsData: InsightsApiResponse | undefined;
  insightsLoading: boolean;
  insightsError: string | null;
  refetchInsights: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exoplanetFilters, setExoplanetFilters] = useState<{
    starType?: string;
    radiusMin?: string;
    radiusMax?: string;
  }>({});

  const fetchExoplanets = async (filters: { starType?: string; radiusMin?: string; radiusMax?: string }) => {
    const query = new URLSearchParams({
      ...(filters.starType && { starType: filters.starType }),
      ...(filters.radiusMin && { radiusMin: filters.radiusMin }),
      ...(filters.radiusMax && { radiusMax: filters.radiusMax }),
    }).toString();

    const response = await axios.get<ExoplanetApiResponse>(`${config.API_URL}/api/exoplanets?${query}`, {
      timeout: 10000,
    });
    return response.data;
  };

  const fetchNeos = async () => {
    const response = await axios.get<NEOApiResponse>(`${config.API_URL}/api/neo`, {
      timeout: 10000,
    });
    return response.data;
  };

  const fetchInsights = async () => {
    const response = await axios.get<InsightsApiResponse>(`${config.API_URL}/api/insights`, {
      timeout: 10000,
    });
    return response.data;
  };

  const exoplanetQuery = useQuery({
    queryKey: ['exoplanets', exoplanetFilters],
    queryFn: () => fetchExoplanets(exoplanetFilters),
    retry: 1,
  });

  const neoQuery = useQuery({
    queryKey: ['neos'],
    queryFn: fetchNeos,
    retry: 1,
    enabled: false,
  });

  const insightsQuery = useQuery({
    queryKey: ['insights'],
    queryFn: fetchInsights,
    retry: 1,
    enabled: false,
  });

  const refetchNeos = () => {
    neoQuery.refetch();
  };

  const refetchInsights = () => {
    insightsQuery.refetch();
  };

  const contextValue: DataContextType = {
    exoplanets: exoplanetQuery.data?.data,
    totalExoplanets: exoplanetQuery.data?.total || 0,
    statistics: exoplanetQuery.data?.statistics,
    exoplanetLoading: exoplanetQuery.isLoading,
    exoplanetError: exoplanetQuery.error
      ? (exoplanetQuery.error as any).response?.data?.error?.message || exoplanetQuery.error.message
      : null,
    setExoplanetFilters,
    neos: neoQuery.data?.data,
    totalNeos: neoQuery.data?.total || 0,
    neoLoading: neoQuery.isLoading,
    neoError: neoQuery.error
      ? (neoQuery.error as any).response?.data?.error?.message || neoQuery.error.message
      : null,
    refetchNeos,
    insightsData: insightsQuery.data,
    insightsLoading: insightsQuery.isLoading,
    insightsError: insightsQuery.error
      ? (insightsQuery.error as any).response?.data?.error?.message || insightsQuery.error.message
      : null,
    refetchInsights,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}