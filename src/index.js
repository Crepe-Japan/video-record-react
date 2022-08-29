import React from 'react';
import './index.css';
import App from './App';
/* import FFmpegWasmEngine from 'videojs-record/dist/plugins/videojs.record.ffmpeg-wasm.js';
 */

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
      /*  video: true, */
      video: {
        // video media constraints: set resolution of camera
        width: { min: 640, ideal: 640, max: 1280 },
        height: { min: 480, ideal: 480, max: 920 }
      },
      // dimensions of captured video frames
      frameWidth: 640,
      frameHeight: 480,
      maxLength: 10,
      debug: true,
      // enable ffmpeg.wasm plugin
      convertEngine: 'ffmpeg.wasm',
      convertWorkerURL: '../../node_modules/@ffmpeg/core/dist/ffmpeg-core.js',
      // convert recorded data to MP4 (and copy over audio data without encoding)
      convertOptions: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-c:a', 'copy', '-f', 'mp4'],
      // specify output mime-type
      pluginLibraryOptions: {
        outputType: 'video/mp4'
      }
    }
  }
};

root.render(
  <App {...videoJsOptions} />
);
