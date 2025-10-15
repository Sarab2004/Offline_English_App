import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/c/:slug" element={<CategoryPage />} />
      </Routes>
    </main>
  );
}

export default App;
