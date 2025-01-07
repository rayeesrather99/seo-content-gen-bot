import React from 'react';
import Chatbot from './components/Chatbot';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import './Chatbot.css';

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <Chatbot />
      </main>
      <Footer />
    </div>
  );
}

export default App;

