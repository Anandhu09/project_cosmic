import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="p-4 bg-gray-800 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Cosmic Insights
      </Link>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-4">
          <Link to="/exoplanets" className="hover:text-blue-400">
            Exoplanets
          </Link>
          <Link to="/neo" className="hover:text-blue-400">
            NEOs
          </Link>
          <Link to="/insights" className="hover:text-blue-400">
            Insights
          </Link>
        </nav>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;