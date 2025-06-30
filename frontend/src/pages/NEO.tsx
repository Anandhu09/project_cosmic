import { useEffect } from "react";
import { useData } from "../context/DataContext";
import { Scatter, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const NEO: React.FC = () => {
  const { neos, totalNeos, neoLoading, neoError, refetchNeos } = useData();

  useEffect(() => {
    refetchNeos(); 
  }, [refetchNeos]);

  if (neoLoading) return <div className="p-4 text-gray-400">Loading...</div>;
  if (neoError) return <div className="p-4 text-red-500">{neoError}</div>;

  
  const scatterData = {
    datasets: [
      {
        label: "Non-Hazardous NEOs",
        data: neos
          ?.filter((neo) => !neo.isPotentiallyHazardous)
          .map((neo) => ({
            x: neo.diameter,
            y: neo.velocity,
            name: neo.name,
            closeApproachDate: neo.closeApproachDate,
            isPotentiallyHazardous: neo.isPotentiallyHazardous,
          })),
        backgroundColor: "#3B82F6",
        pointRadius: neos
          ?.filter((neo) => !neo.isPotentiallyHazardous)
          .map((neo) => Math.min(Math.max(neo.diameter * 20, 5), 15)),
        pointHoverRadius: neos
          ?.filter((neo) => !neo.isPotentiallyHazardous)
          .map((neo) => Math.min(Math.max(neo.diameter * 20 + 2, 7), 17)),
        pointHoverBackgroundColor: "#3B82F6",
        pointHoverCursor: "pointer",
      },
      {
        label: "Hazardous NEOs",
        data: neos
          ?.filter((neo) => neo.isPotentiallyHazardous)
          .map((neo) => ({
            x: neo.diameter,
            y: neo.velocity,
            name: neo.name,
            closeApproachDate: neo.closeApproachDate,
            isPotentiallyHazardous: neo.isPotentiallyHazardous,
          })),
        backgroundColor: "#EF4444",
        pointRadius: neos
          ?.filter((neo) => neo.isPotentiallyHazardous)
          .map((neo) => Math.min(Math.max(neo.diameter * 20, 5), 15)),
        pointHoverRadius: neos
          ?.filter((neo) => neo.isPotentiallyHazardous)
          .map((neo) => Math.min(Math.max(neo.diameter * 20 + 2, 7), 17)),
        pointHoverBackgroundColor: "#EF4444",
        pointHoverCursor: "pointer",
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#fff" },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const { name, x, y, closeApproachDate, isPotentiallyHazardous } =
              context.raw;
            return [
              `Name: ${name}`,
              `Diameter: ${x.toFixed(3)} km`,
              `Velocity: ${y.toFixed(2)} km/h`,
              `Close Approach: ${closeApproachDate}`,
              `Hazardous: ${isPotentiallyHazardous ? "Yes" : "No"}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Diameter (km)", color: "#fff" },
        ticks: { color: "#fff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        title: { display: true, text: "Velocity (km/h)", color: "#fff" },
        ticks: { color: "#fff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };


  const lineData = {
    labels: neos?.map((neo) => neo.name),
    datasets: [
      {
        label: "Velocity (km/h, scaled)",
        data: neos?.map((neo) => neo.velocity), 
        borderColor: "#F97316",
        backgroundColor: "rgba(249, 115, 22, 0.2)",
        fill: false,
        tension: 0.4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#F97316",
        pointHoverBorderColor: "#EA580C",
        pointHoverBorderWidth: 2,
        pointHoverCursor: "pointer",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: "#fff" } },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const neo = neos?.[context.dataIndex];
            return [
              `Name: ${neo?.name}`,
              `Diameter: ${neo?.diameter.toFixed(3)} km`,
              `Velocity: ${neo?.velocity.toFixed(2)} km/h`,
              `Close Approach: ${neo?.closeApproachDate}`,
              `Hazardous: ${neo?.isPotentiallyHazardous ? "Yes" : "No"}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "NEO", color: "#fff" },
        ticks: {
          color: "#fff",
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        title: {
          display: true,
          text: "Velocity (km/h, scaled)",
          color: "#fff",
        },
        ticks: { color: "#fff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">NEO Dashboard</h2>
      {neos && neos.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-white">Total NEOs: {totalNeos}</p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              NEO Data Table
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse bg-gray-800 rounded-lg">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="border border-gray-600 p-2 text-left">
                      Name
                    </th>
                    <th className="border border-gray-600 p-2 text-left">
                      Diameter (km)
                    </th>
                    <th className="border border-gray-600 p-2 text-left">
                      Velocity (km/h)
                    </th>
                    <th className="border border-gray-600 p-2 text-left">
                      Close Approach
                    </th>
                    <th className="border border-gray-600 p-2 text-left">
                      Hazardous
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {neos.map((neo) => (
                    <tr key={neo.id} className="hover:bg-gray-700">
                      <td className="border border-gray-600 p-2">{neo.name}</td>
                      <td className="border border-gray-600 p-2">
                        {neo.diameter.toFixed(2)}
                      </td>
                      <td className="border border-gray-600 p-2">
                        {neo.velocity.toFixed(2)}
                      </td>
                      <td className="border border-gray-600 p-2">
                        {neo.closeApproachDate}
                      </td>
                      <td className="border border-gray-600 p-2">
                        {neo.isPotentiallyHazardous ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              NEO Graphs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-white mb-2">
                  Diameter vs. Velocity
                </h4>
                <div className="h-[40vh]">
                  <Scatter data={scatterData} options={scatterOptions} />
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-white mb-2">
                  NEO Velocity Over Time
                </h4>
                <div className="h-[40vh]">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 text-white">No NEO data available</div>
      )}
    </div>
  );
};

export default NEO;
