/* eslint-disable */
import React, { useEffect } from 'react';

import './App.css';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';

/*
// Required imports when recording audio-only using the videojs-wavesurfer plugin
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
WaveSurfer.microphone = MicrophonePlugin;

// Register videojs-wavesurfer plugin
import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
*/

// register videojs-record plugin with this import
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

export default function App({ ...options }) {


  useEffect(() => {
    /*    let preview = document.getElementById("preview");
       const canvas = document.getElementById("c1");; */
    var devices, deviceId;
    var inputSection = document.getElementsByClassName('inputSelector')[0];

    // Anything in here is fired on component mount.
    const player = videojs('preview', options, function () {
      // print version information at startup
      const msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record');
      videojs.log(msg);

      console.log("videojs-record is ready!");
    });

    // user clicked the record button and started recording
    player.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    player.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      /*    player.record().saveAs({ 'video': 'my-video-file-name.webm' }); */
      console.log('finished recording: ', player.recordedData);
    });

    player.on('finishConvert', function () {
      console.log('finished converting: ', player.convertedData);
      // show save as dialog
      /*   player.record().saveAs({ 'video': 'my-video-file-name.mp4' }, 'convert');  */
    });

    // error handling
    player.on('error', (element, error) => {
      console.warn(error);
    });

    player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });

    // enumerate devices once
    player.one('deviceReady', function () {
      processor.doLoad();
      player.record().enumerateDevices();
    });

    player.on('enumerateReady', function () {
      devices = player.record().devices;

      // handle selection changes
      var inputSelector = document.getElementById('selector');

      inputSelector.addEventListener('change', changeVideoInput);

      // populate select options
      var deviceInfo, option, i;
      for (i = 0; i !== devices.length; ++i) {
        deviceInfo = devices[i];
        option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
          console.info('Found video input device: ', deviceInfo.label);
          option.text = deviceInfo.label || 'input device ' +
            (inputSelector.length + 1);
          inputSelector.appendChild(option);
        }
      }

      if (inputSelector.length == 0) {
        // no output devices found, disable select
        option = document.createElement('option');
        option.text = 'No video input devices found';
        option.value = undefined;
        inputSelector.appendChild(option);
        inputSelector.disabled = true;
        console.warn(option.text);
      } else {
        console.info('Total video input devices found:', inputSelector.length);
      }

      // show input selector section
      inputSection.style.display = 'block';
    });

    function changeVideoInput(event) {
      var label = event.target.options[event.target.selectedIndex].text;
      deviceId = event.target.value;

      try {

        // change video input device
        player.record().setVideoInput(deviceId);

        console.log("Changed video input to '" + label + "' (deviceId: " +
          deviceId + ")");

      } catch (error) {
        console.warn(error);

        // jump back to first output device in the list as it's the default
        event.target.selectedIndex = 0;
      }
    }

    // error handling
    player.on('enumerateError', function () {
      console.warn('enumerate error:', player.enumerateErrorCode);
    });





    return () => {
      // Anything in here is fired on component unmount.
      if (player) {
        player.dispose();
      }
    }
  }, [])

  let processor = {
    timerCallback: function () {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
      setTimeout(function () {
        self.timerCallback();
      }, 0);
    },

    doLoad: function () {
      console.log("Enter Here")
      this.video = document.querySelector('.preview>video');

      this.c1 = document.getElementById("c1");
      this.ctx1 = this.c1.getContext("2d");
      let self = this;
      /*   this.video.addEventListener("play", function () { */
      self.width = self.video.videoWidth / 2;
      self.height = self.video.videoHeight / 2;

      c1.width = self.width
      c1.height = self.height
      self.timerCallback();
      /*  }, false); */
    },

    computeFrame: function () {

      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
      let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
      let l = frame.data.length / 4;

      for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];

        frame.data[i * 4 + 1] += 100
        frame.data[i * 4 + 2] += 20
        frame.data[i * 4 + 3] += 50;
      }
      this.ctx1.putImageData(frame, 0, 0);
      return;
    }
  };


  return (
    <div data-vjs-player>
      <div>
        <video id="preview" className="video-js vjs-default-skin preview" playsInline>
        </video>
      </div>
      <div className="inputSelector">
        <label>Select video input: </label>
        <select id="selector"></select>
      </div>
      <div >
        <h2>Canvas</h2>
        <canvas id="c1"></canvas>
      </div>
      <div hidden>
        <video id="myPlayer" className="video-js vjs-default-skin"
          width="640"
          height="640"
          preload={"auto"}
          autoPlay muted loop >
          <source src="https://collab-project.github.io/videojs-wavesurfer/demo/media/example.mp4" type="video/mp4" />
        </video>
      </div>
    </div >

  );

}