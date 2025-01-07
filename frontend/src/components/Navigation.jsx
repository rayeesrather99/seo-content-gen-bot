import React from 'react';
import { motion } from 'framer-motion';

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-content">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          SEO Content Generator Chatbot
        </motion.h1>
        <motion.img 
          src="https://media.giphy.com/media/l0HlNaQ6gWfllcjDO/giphy.gif" 
          alt="SEO Animation" 
          className="nav-gif"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>
    </nav>
  );
};

export default Navigation;

