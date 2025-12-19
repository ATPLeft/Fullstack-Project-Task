import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './styles/components.css';
import App from './App';

// Add this CSS override to fix input focus issues
const style = document.createElement('style');
style.textContent = `
  /* COMPLETE FIX FOR INPUT FOCUS ISSUES */
  input, textarea, select, button {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }
  
  input:focus, textarea:focus, select:focus {
    transition: none !important;
    transform: none !important;
    animation: none !important;
    outline: 2px solid #2563eb !important;
    outline-offset: 2px !important;
  }
  
  /* Remove any dropdown arrows */
  .btn-primary::after {
    display: none !important;
    content: none !important;
  }
  
  /* Fix navbar button */
  .nav .btn-primary {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .nav .btn-primary:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
  }
  
  /* Ensure inputs don't lose focus */
  input, textarea {
    -webkit-user-modify: read-write !important;
    user-select: text !important;
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);