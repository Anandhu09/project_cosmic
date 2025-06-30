import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="p-4 text-center text-2xl">
      <h2 className="mb-4">404 - Page Not Found</h2>
      <p className="mb-4">Sorry, the page you’re looking for doesn’t exist.</p>
      <Link to="/" className="text-blue-400 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;