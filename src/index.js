import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'polotno/model/store';
import { getImageSize } from 'polotno/utils/image';

import './index.css';
import App from './App';

const store = createStore({ key: 'nFA5H9elEytDyPyvKL7T' });
window.store = store;

store.addPage();

const url_params = new URLSearchParams(window.location.search);
function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
}

if (url_params.has('puter.item.read_url')) {
  // send GET request to puter.item.read_url to get file content
  fetch(url_params.get('puter.item.read_url'))
    .then((response) => {
      return response.blob();
    })
    .then(async (blob) => {
      // print out the contents of the file
      blobToDataURL(blob, (data_url) => {
        getImageSize(data_url).then((size) => {
          store.setSize(size.width, size.height);
          store.activePage.addElement({
            type: 'image',
            src: data_url,
            width: size.width,
            height: size.height,
          });
        });
      });
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);
