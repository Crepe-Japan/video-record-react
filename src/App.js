/* eslint-disable */
import React, { Component, useEffect, useState } from 'react';

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

    // Anything in here is fired on component mount.
    const player = videojs('myVideo', options, function () {
      // print version information at startup
      const msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record');
      videojs.log(msg);

      console.log("videojs-record is ready!");
    });
    /*  setPlayer(vidPlayer) */


    player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    player.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    player.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData);
    });

    // error handling
    player.on('error', (element, error) => {
      console.warn(error);
    });

    player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });


    return () => {
      // Anything in here is fired on component unmount.
      if (player) {
        player.dispose();
      }
    }
  }, [])

  return (
    <div data-vjs-player>
      <video id="myVideo" className="video-js vjs-default-skin" playsInline></video>
    </div>
  );

}