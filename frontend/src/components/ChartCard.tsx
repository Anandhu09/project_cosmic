import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { useData } from '../context/DataContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const ChartCard: React.FC = () => {
  const { exoplanets, exoplanetLoading, exoplanetError } = useData();

  if (exoplanetLoading) return <div className="p-4 text-gray-400">Loading...</div>;
  if (exoplanetError) return <div className="p-4 text-red-500">{exoplanetError}</div>;

  const discoveryMethods = Array.from(new Set(exoplanets?.map((exo) => exo.discoveryMethod)));
  const dataByMethod = discoveryMethods.map((method) => {
    const exos = exoplanets?.filter((exo) => exo.discoveryMethod === method) || [];
    const avgRadius = exos.length ? exos.reduce((sum, exo) => sum + exo.radius, 0) / exos.length : 0;
    return avgRadius;
  });

  const barColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6EE7B7', // Light Green
    '#F472B6', // Light Pink
  ];

  const chartData = {
    labels: discoveryMethods,
    datasets: [
      {
        label: 'Average Radius (R⊕)',
        data: dataByMethod,
        backgroundColor: barColors.slice(0, discoveryMethods.length), 
        borderColor: barColors
          .slice(0, discoveryMethods.length)
          .map((color) => color.replace(/([0-9A-F]{6})/, '$1CC')), 
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Average Radius (R⊕)' } },
      x: { title: { display: true, text: 'Discovery Method' } },
    },
    plugins: {
      title: { display: true, text: 'Exoplanet Sizes by Discovery Method' },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw.toFixed(2)} R⊕`,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Exoplanet Sizes</h2>
      {exoplanets && exoplanets.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <div className="p-4">No exoplanet data available</div>
      )}
    </div>
  );
};

export default ChartCard;