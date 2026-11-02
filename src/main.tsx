import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupPwaAutoReload } from './pwaUpdate';

// The event app's page (app.html) marks itself with data-page="app".
const isEventApp = document.documentElement.dataset.page === 'app';

setupPwaAutoReload();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App alwaysLive={isEventApp} />
  </React.StrictMode>
);
