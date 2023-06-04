/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const domNode = document.getElementById('app');
const root = ReactDOM.createRoot(domNode);

root.render(<App />);

// service worker
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      // Registration was successful
      // eslint-disable-next-line no-console
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      // registration failed :(
      // eslint-disable-next-line no-console
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
