    // src/index.js (если ValentineQuestion.js - это ваш корневой компонент)
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import './index.css'; // Опционально
    import ValentineQuestion from './ValentineQuestion'; // Импортируем ваш компонент

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <ValentineQuestion /> {/* Используем ваш компонент здесь */}
      </React.StrictMode>
    );
    
