import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'polotno/model/store';

import './index.css';
import App from './App';

const store = createStore({ key: 'nFA5H9elEytDyPyvKL7T' });
window.store = store;

store.addPage();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);
