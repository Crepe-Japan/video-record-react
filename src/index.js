import React from 'react';
import './index.css';
import App from './App';
/* import FFmpegWasmEngine from 'videojs-record/dist/plugins/videojs.record.ffmpeg-wasm.js';
 */
import { ChakraProvider } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);

const videoJsOptions = {
  controls: false,
  bigPlayButton: false,
  width: 2,
  height: 2,
  fluid: false,
  plugins: {
    record: {
      audio: true,
      /*  video: true, */
      video: {
        // video media constraints: set resolution of camera
        width: { min: 1280, ideal: 640, max: 1920 },
        height: { min: 920, ideal: 480, max: 1080 }
      },
      // dimensions of captured video frames
      frameWidth: 1920,
      frameHeight: 1080,
      maxLength: 10,
      debug: true,
      /*     // enable ffmpeg.wasm plugin
          convertEngine: 'ffmpeg.wasm',
          convertWorkerURL: '../../node_modules/@ffmpeg/core/dist/ffmpeg-core.js',
          // convert recorded data to MP4 (and copy over audio data without encoding)
          convertOptions: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-c:a', 'copy', '-f', 'mp4'],
          // specify output mime-type
          pluginLibraryOptions: {
            outputType: 'video/mp4'
          } */
    }
  }
};

root.render(
  <ChakraProvider>
    <App {...videoJsOptions} />
  </ChakraProvider>

);
