import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create root element and render React app
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}