import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useData } from '../context/DataContext';
import FilterBar from '../components/FilterBar';
import ChartCard from '../components/ChartCard';
import OrbitalView from '../components/OrbitalView';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Exoplanets: React.FC = () => {
  const { exoplanets, totalExoplanets, statistics, exoplanetLoading, exoplanetError } = useData();
  const barColors = [
    '#3B82F6', // Vibrant Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6EE7B7', // Light Green
    '#F472B6', // Light Pink
    '#60A5FA', // Light Blue
    '#FBBF24', // Amber
  ];

  // Bar chart for anomalies
  const anomalyChartData = {
    labels: statistics?.anomalies?.map((anomaly) => anomaly.name) ?? [],
    datasets: [
      {
        label: 'Radius (R⊕)',
        data: statistics?.anomalies?.map((anomaly) => anomaly.radius) ?? [],
        backgroundColor: barColors.slice(0, statistics?.anomalies?.length ?? 0),
        borderColor: barColors.slice(0, statistics?.anomalies?.length ?? 0),
        borderWidth: 1,
      },
      {
        label: 'Deviation',
        data: statistics?.anomalies?.map((anomaly) => Number(anomaly.deviation)) ?? [],
        backgroundColor: barColors.slice(0, statistics?.anomalies?.length ?? 0),
        borderColor: barColors.slice(0, statistics?.anomalies?.length ?? 0),
        borderWidth: 1,
      },
    ],
  };

  const anomalyChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Value (R⊕)' },
      },
      x: {
        title: { display: true, text: 'Exoplanet' },
      },
    },
    plugins: {
      title: { display: true, text: 'Exoplanet Anomalies: Radius and Deviation' },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw.toFixed(2)}`,
        },
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };


  useEffect(() => {
    statistics?.anomalies?.forEach((anomaly, index) => {
      console.log(`Bar ${anomaly.name} assigned color: ${barColors[index % barColors.length]}`);
    });
  }, [statistics]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Exoplanets Dashboard</h2>
      <FilterBar />
      {exoplanetLoading && <div className="p-4 text-gray-400">Loading...</div>}
      {exoplanetError && <div className="p-4 text-red-500">{exoplanetError}</div>}
      {exoplanets && exoplanets.length > 0 ? (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Statistics</h3>
            <p className="text-lg">Average Radius: {statistics?.averageRadius ?? 'N/A'} R⊕</p>
            {statistics?.anomalies && statistics.anomalies.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">Anomalies</h4>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Bar data={anomalyChartData} options={anomalyChartOptions} />
                </div>
              </div>
            ) : (
              <p className="mt-2">No anomalies detected</p>
            )}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">3D Visualization</h4>
              <OrbitalView />
            </div>
          </div>
          <ChartCard />
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2 text-left">Name</th>
                  <th className="border border-gray-600 p-2 text-left">Radius (R⊕)</th>
                  <th className="border border-gray-600 p-2 text-left">Orbital Period (days)</th>
                  <th className="border border-gray-600 p-2 text-left">Discovery Method</th>
                  <th className="border border-gray-600 p-2 text-left">Star Type</th>
                </tr>
              </thead>
              <tbody>
                {exoplanets.map((exo) => (
                  <tr key={exo.name} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-2">{exo.name}</td>
                    <td className="border border-gray-600 p-2">{exo.radius.toFixed(2)}</td>
                    <td className="border border-gray-600 p-2">{exo.orbitalPeriod.toFixed(3)}</td>
                    <td className="border border-gray-600 p-2">{exo.discoveryMethod}</td>
                    <td className="border border-gray-600 p-2">{exo.starType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4">Total Exoplanets: {totalExoplanets}</p>
          </div>
        </>
      ) : (
        <div className="p-4">No exoplanet data available</div>
      )}
    </div>
  );
};

export default Exoplanets;