import { Link } from "react-router-dom";
import nasaLogo from "../assets/nasa_logo.png"; 

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 h-screen p-4 flex flex-col">
      <div className="flex items-center mb-4">
        <img
          src={nasaLogo}
          alt="NASA Logo"
          className="w-10 h-10 ml-[3px] rounded-full"
          loading="lazy"
        />
        <span className="ml-2 text-white text-lg font-semibold">NASA</span>
      </div>
      <nav className="flex flex-col gap-2">
        <Link
          to="/"
          className="p-2 hover:bg-gray-700 rounded"
          aria-label="Dashboard"
        >
          Dashboard
        </Link>
        <Link
          to="/exoplanets"
          className="p-2 hover:bg-gray-700 rounded"
          aria-label="Exoplanets"
        >
          Exoplanets
        </Link>
        <Link
          to="/neo"
          className="p-2 hover:bg-gray-700 rounded"
          aria-label="NEOs"
        >
          NEOs
        </Link>
        <Link
          to="/insights"
          className="p-2 hover:bg-gray-700 rounded"
          aria-label="Insights"
        >
          Insights
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
