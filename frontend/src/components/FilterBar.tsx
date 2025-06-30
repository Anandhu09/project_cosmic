import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const FilterBar: React.FC = () => {
  const { setExoplanetFilters } = useData();
  const [starType, setStarType] = useState('');
  const [radiusMin, setRadiusMin] = useState('');
  const [radiusMax, setRadiusMax] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (radiusMin && isNaN(Number(radiusMin))) {
      setError('Invalid radiusMin');
      return;
    }
    if (radiusMax && isNaN(Number(radiusMax))) {
      setError('Invalid radiusMax');
      return;
    }
    if (radiusMin && radiusMax && Number(radiusMin) > Number(radiusMax)) {
      setError('radiusMin cannot be greater than radiusMax');
      return;
    }
    setExoplanetFilters({ starType, radiusMin, radiusMax });
  };

  return (
    <div>
      {error && <div className="p-2 text-red-500">{error}</div>}
      <form onSubmit={handleFilter} className="p-4 bg-gray-700 rounded-lg flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={starType}
          onChange={(e) => setStarType(e.target.value)}
          placeholder="Star Type (e.g., M0 V)"
          className="p-2 rounded bg-gray-800 text-white flex-1"
          aria-label="Star Type Filter"
        />
        <input
          type="number"
          value={radiusMin}
          onChange={(e) => setRadiusMin(e.target.value)}
          placeholder="Min Radius (R⊕)"
          className="p-2 rounded bg-gray-800 text-white flex-1"
          aria-label="Minimum Radius Filter"
        />
        <input
          type="number"
          value={radiusMax}
          onChange={(e) => setRadiusMax(e.target.value)}
          placeholder="Max Radius (R⊕)"
          className="p-2 rounded bg-gray-800 text-white flex-1"
          aria-label="Maximum Radius Filter"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 rounded hover:bg-blue-700"
          aria-label="Apply Filters"
        >
          Filter
        </button>
      </form>
    </div>
  );
};

export default FilterBar;