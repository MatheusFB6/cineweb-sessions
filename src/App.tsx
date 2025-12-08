import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Filmes from './pages/Filmes';
import Salas from './pages/Salas';
import Sessoes from './pages/Sessoes';
import Lanches from './pages/Lanches';
import NotFound from './pages/NotFound';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/filmes" element={<Filmes />} />
      <Route path="/salas" element={<Salas />} />
      <Route path="/sessoes" element={<Sessoes />} />
      <Route path="/lanches" element={<Lanches />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;