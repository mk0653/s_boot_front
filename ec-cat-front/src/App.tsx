import { Routes, Route } from 'react-router-dom';
import OrderPage from './pages/OrderPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<OrderPage />} />
      <Route path="/orders" element={<OrderPage />} />
    </Routes>
  );
}

export default App;
