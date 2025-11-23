import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Shop from './components/Shop.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
    </Routes>
  );
}
