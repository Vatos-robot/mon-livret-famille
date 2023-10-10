import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createRoot } from 'react-dom/client';

// Utilisation de la nouvelle API createRoot pour React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

