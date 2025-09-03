import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MyTickets from './pages/MyTickets';
import { WalletProvider } from './context/WalletContext';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-tickets" element={<MyTickets />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
