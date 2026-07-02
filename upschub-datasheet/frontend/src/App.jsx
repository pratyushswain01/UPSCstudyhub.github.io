import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { QuizEngine } from './games/quiz/QuizEngine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/quiz" element={<QuizEngine />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;