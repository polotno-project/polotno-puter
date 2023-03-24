import React from 'react';
import ReactDOM from 'react-dom/client';

import { createStore } from 'polotno/model/store';

import './index.css';
import App from './App';
import './logger';

if (window.location.host !== 'studio.polotno.com') {
  console.log(
    `%cWelcome to Polotno Studio! Thanks for your interest in the project!
This repository has many customizations from the default version Polotno SDK.
I don't recommend to use it as starting point. 
Instead, you can start from any official demos, e.g.: https://polotno.com/docs/demo-full-editor 
or direct sandbox: https://codesandbox.io/s/github/polotno-project/polotno-site/tree/source/examples/polotno-demo?from-embed.
But feel free to use this repository as a reference for your own project and to learn how to use Polotno SDK.`,
    'background: rgba(54, 213, 67, 1); color: white; padding: 5px;'
  );
}

const store = createStore({ key: 'nFA5H9elEytDyPyvKL7T' });
window.store = store;
store.addPage();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App store={store} />);
