// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Опционально, если есть
import ValentineQuestion from './ValentineQuestion'; // <-- Импортируем ValentineQuestion

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ValentineQuestion /> {/* <-- Используем ValentineQuestion */}
  </React.StrictMode>
);
