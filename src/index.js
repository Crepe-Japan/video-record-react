import React from 'react';
import './index.css';
import App from './App';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);

const videoJsOptions = {
  controls: true,
  bigPlayButton: false,
  width: 240,
  height: 180,
  fluid: true,
  plugins: {
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      debug: true
    }
  }
};

root.render(
  <App {...videoJsOptions} />
);
