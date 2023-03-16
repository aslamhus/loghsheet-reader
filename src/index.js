import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App/App';

window.onload = () => {
  const renderDiv = document.getElementById('render');
  const root = createRoot(renderDiv);
  root.render(<App />);
};

if (module.hot) {
  console.log('incoming hot! mod');
  module.hot.accept();
}
