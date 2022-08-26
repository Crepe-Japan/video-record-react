import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const videoJsOptions = {
  controls: true,
  bigPlayButton: false,
  width: 320,
  height: 240,
  fluid: false,
  plugins: {
    /*
    // wavesurfer section is only needed when recording audio-only
    wavesurfer: {
        backend: 'WebAudio',
        waveColor: '#36393b',
        progressColor: 'black',
        debug: true,
        cursorWidth: 1,
        msDisplayMax: 20,
        hideScrollbar: true,
        displayMilliseconds: true,
        plugins: [
            // enable microphone plugin
            WaveSurfer.microphone.create({
                bufferSize: 4096,
                numberOfInputChannels: 1,
                numberOfOutputChannels: 1,
                constraints: {
                    video: false,
                    audio: true
                }
            })
        ]
    },
    */
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      debug: true
    }
  }
};

ReactDOM.render(
  <React.StrictMode>
    <App {...videoJsOptions} />
  </React.StrictMode>,
  document.getElementById('root')
);