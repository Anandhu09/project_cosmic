import { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Line, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  PolarAreaController,
  ArcElement,
  RadialLinearScale,
  LinearScaleOptions,
  CategoryScaleOptions,
} from 'chart.js';
import { type Insights, type InsightsApiResponse } from '../types/insights';

// Register Chart.js components
ChartJS.register(
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  PolarAreaController,
  ArcElement,
  RadialLinearScale
);

const Insights: React.FC = () => {
  const { insightsData, insightsLoading, insightsError, refetchInsights } = useData();

  useEffect(() => {
    refetchInsights(); 
  }, [refetchInsights]);

  if (insightsLoading) return <div className="p-4 text-gray-400">Loading...</div>;
  if (insightsError) return <div className="p-4 text-red-500">{insightsError}</div>;

  const insights: Insights[] = insightsData?.insights || [];
  const summary: InsightsApiResponse['summary'] = insightsData?.summary || {
    averageTemperature: '0',
    averagePressure: '0',
    averageWindSpeed: '0',
    temperatureTrend: 'Unknown',
    anomalies: [],
  };


  const colors = [
    { background: 'rgba(45, 212, 191, 0.5)', border: '#2DD4BF' }, // Teal
    { background: 'rgba(168, 85, 247, 0.5)', border: '#A855F7' }, // Purple
    { background: 'rgba(239, 68, 68, 0.5)', border: '#EF4444' }, // Red
    { background: 'rgba(16, 185, 129, 0.5)', border: '#10B981' }, // Green
    { background: 'rgba(250, 204, 21, 0.5)', border: '#FACC15' }, // Yellow
    { background: 'rgba(59, 130, 246, 0.5)', border: '#3B82F6' }, // Blue
    { background: 'rgba(236, 72, 153, 0.5)', border: '#EC4899' }, // Pink
  ];


  const polarData = {
    labels: insights.map((data) => `Sol ${data.sol} (${data.windDirection}°)`),
    datasets: [
      {
        label: 'Wind Speed (m/s)',
        data: insights.map((data) => data.windSpeed),
        backgroundColor: insights.map((_, index) => colors[index % colors.length].background),
        borderColor: insights.map((_, index) => colors[index % colors.length].border),
        borderWidth: 1,
      },
    ],
  };

  const polarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#fff' },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const data = insights[index];
            return [
              `Sol: ${data.sol}`,
              `Wind Speed: ${data.windSpeed.toFixed(2)} m/s`,
              `Wind Direction: ${data.windDirection}°`,
              `Temperature: ${data.temperature.toFixed(2)} °C`,
              `Pressure: ${data.pressure.toFixed(2)} Pa`,
              `Season: ${data.season}`,
              `Last Updated: ${data.lastUpdated}`,
            ];
          },
        },
      },
    },
    scales: {
      r: {
        type: 'radialLinear' as const,
        ticks: { color: '#fff', backdropColor: 'transparent' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#fff' },
      },
    },
  };


  const lineData = {
    labels: insights.map((data) => `Sol ${data.sol}`),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: insights.map((data) => data.temperature),
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        fill: false,
        tension: 0.4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#F97316',
        pointHoverBorderColor: '#EA580C',
        pointHoverBorderWidth: 2,
        pointHoverCursor: 'pointer',
        yAxisID: 'y',
      },
      {
        label: 'Pressure (Pa)',
        data: insights.map((data) => data.pressure),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: false,
        tension: 0.4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#3B82F6',
        pointHoverBorderColor: '#2563EB',
        pointHoverBorderWidth: 2,
        pointHoverCursor: 'pointer',
        yAxisID: 'y1',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#fff' } },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const data = insights[context.dataIndex];
            return [
              `Sol: ${data.sol}`,
              `Temperature: ${data.temperature.toFixed(2)} °C`,
              `Pressure: ${data.pressure.toFixed(2)} Pa`,
              `Wind Speed: ${data.windSpeed.toFixed(2)} m/s`,
              `Wind Direction: ${data.windDirection}°`,
              `Season: ${data.season}`,
              `Last Updated: ${data.lastUpdated}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        position: 'bottom' as const,
        axis: 'x' as const,
        title: { display: true, text: 'Sol', color: '#fff' },
        ticks: {
          color: '#fff',
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      } as unknown as CategoryScaleOptions,
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        axis: 'y' as const,
        title: { display: true, text: 'Temperature (°C)', color: '#fff' },
        ticks: {
          color: '#fff',
          callback: (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      } as unknown as LinearScaleOptions,
      y1: {
        type: 'linear' as const,
        position: 'right' as const,
        axis: 'y' as const,
        title: { display: true, text: 'Pressure (Pa)', color: '#fff' },
        ticks: {
          color: '#fff',
          callback: (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        },
        grid: { display: false },
      } as unknown as  LinearScaleOptions,
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Insights Dashboard</h2>
      {insights.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-white">Average Temperature: {summary.averageTemperature} °C</p>
            <p className="text-white">Average Pressure: {summary.averagePressure} Pa</p>
            <p className="text-white">Average Wind Speed: {summary.averageWindSpeed} m/s</p>
            <p className="text-white">Temperature Trend: {summary.temperatureTrend}</p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">Insights Data Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse bg-gray-800 rounded-lg">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="border border-gray-600 p-2 text-left">Sol</th>
                    <th className="border border-gray-600 p-2 text-left">Temperature (°C)</th>
                    <th className="border border-gray-600 p-2 text-left">Pressure (Pa)</th>
                    <th className="border border-gray-600 p-2 text-left">Wind Speed (m/s)</th>
                    <th className="border border-gray-600 p-2 text-left">Wind Direction (°)</th>
                    <th className="border border-gray-600 p-2 text-left">Season</th>
                    <th className="border border-gray-600 p-2 text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.map((data) => (
                    <tr key={data.sol} className="hover:bg-gray-700">
                      <td className="border border-gray-600 p-2">{data.sol}</td>
                      <td className="border border-gray-600 p-2">{data.temperature.toFixed(2)}</td>
                      <td className="border border-gray-600 p-2">{data.pressure.toFixed(2)}</td>
                      <td className="border border-gray-600 p-2">{data.windSpeed.toFixed(2)}</td>
                      <td className="border border-gray-600 p-2">{data.windDirection}</td>
                      <td className="border border-gray-600 p-2">{data.season}</td>
                      <td className="border border-gray-600 p-2">{data.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">Insights Graphs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-white mb-2">Wind Patterns</h4>
                <div className="h-[40vh]">
                  <PolarArea data={polarData} options={polarOptions} />
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-white mb-2">Environmental Trends Over Time</h4>
                <div className="h-[40vh]">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 text-white">No insights data available</div>
      )}
    </div>
  );
};

export default Insights;