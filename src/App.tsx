import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Filmes from './pages/Filmes';
import Salas from './pages/Salas';
import Sessoes from './pages/Sessoes';
import Lanches from './pages/Lanches';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/filmes" replace />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/sessoes" element={<Sessoes />} />
          <Route path="/salas" element={<Salas />} />
          <Route path="/lanches" element={<Lanches />} />
          
          {/* Adicione a Rota de Login aqui */}
          <Route path="/login" element={<Login />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;