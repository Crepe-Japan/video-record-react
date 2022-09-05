/* eslint-disable */
import React, { useEffect } from 'react';

import './App.css';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import { startRecording } from './canvas-record'
import { canvasStreamer } from './canvas-stream'

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
  let recordingTimeMS = 5000;

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
      player.record().enumerateDevices();
    });
    player.on('deviceReady', function () {
      let playerVideo = document.getElementById('playerVideo')
      playerVideo.play()

      canvasStreamer.doLoad()
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



  const canvasRecorder = (e) => {

    const canvas = document.getElementById("c1");
    let recording = document.getElementById("recording");
    let downloadButton = document.getElementById("downloadButton");
    const canvasStream = canvas.captureStream(25);
    e.target.innerText = "Recording .... "
    e.target.disabled = true
    startRecording(canvasStream, recordingTimeMS).then((recordedChunks) => {
      let recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });
      recording.src = URL.createObjectURL(recordedBlob);
      downloadButton.href = recording.src;
      downloadButton.download = "RecordedVideo.mp4";
      e.target.innerText = "Record"
      e.target.disabled = false
      /* log(`Successfully recorded ${recordedBlob.size} bytes of ${recordedBlob.type} media.`); */
    })
      .catch((error) => {
        if (error.name === "NotFoundError") {
          log("Camera or microphone not found. Can't record.");
        } else {
          console.log(error)
          //log(error);
        }
      })


  }

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
        <h2>Canvas (From Camera )</h2>
        <canvas id="c1"></canvas>
      </div>
      <button onClick={(e) => canvasRecorder(e)}> Record </button>
      <div >
        <h2>Recording (From Canvas)</h2>
        <video id="recording" controls></video>
        <br />
        <br />
        <button>
          <a id="downloadButton" className="button">
            Download
          </a>
        </button>
      </div>

      <div >
        <video id="playerVideo"
          width="200"
          height="200"
          autoPlay
          muted loop playsinline>
          <source src="example.mp4" type="video/mp4" />
        </video>
      </div>
    </div >

  );

}