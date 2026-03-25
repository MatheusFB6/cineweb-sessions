import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from '../components/NavLink';
import { useAuth } from '../contexts/AuthContext'; // Importe o hook!

export default function Navbar() {
  const { user, isAuthenticated, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/filmes" className="text-xl font-bold tracking-wider">
              CINEWEB
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <NavLink to="/filmes">Filmes</NavLink>
              <NavLink to="/sessoes">Sessões</NavLink>
              <NavLink to="/lanches">Lanches</NavLink>
              
              {/* Mostra a aba Salas apenas se for Admin */}
              {isAdmin && <NavLink to="/salas">Salas</NavLink>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Olá, <strong className="font-semibold">{user?.name}</strong>
                  {isAdmin && <span className="ml-2 text-xs bg-red-500 px-2 py-1 rounded">Admin</span>}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded font-semibold text-sm transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}