import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChartCard from './components/ChartCard';
import Exoplanets from './pages/Exoplanets';
import NEO from './pages/NEO';
import Insights from './pages/Insights';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white flex">
        <Sidebar />
        <div className="flex-1">
          <Header toggleSidebar={function (): void {
            throw new Error('Function not implemented.');
          }} />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<ChartCard />} />
              <Route path="/exoplanets" element={<Exoplanets />} />
              <Route path="/neo" element={<NEO />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;