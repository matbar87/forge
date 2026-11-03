// Entry point of the admin panel (admin.html, served at /admin). Separate
// from the site's own bundle: no service worker, not linked from anywhere.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminApp } from './AdminApp';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
