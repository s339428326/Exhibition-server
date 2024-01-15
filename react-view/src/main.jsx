import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../index.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ReducerProvider from './context/ReducerProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReducerProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ReducerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
