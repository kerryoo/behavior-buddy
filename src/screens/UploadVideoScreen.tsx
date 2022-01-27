import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router';
import Dropzone from 'react-dropzone';
import { AiOutlineUpload } from 'react-icons/ai';
import ReactPlayer from 'react-player/file';

import styles from './UploadVideoScreen.module.css';
import ErrorScreen from './ErrorScreen';
import LinkButton from '../components/LinkButton';

const UploadVideoScreen = () => {
  const location = useLocation();
  if (!location.state) {
    return <ErrorScreen />;
  }
  const { sessionFile } = location.state;
  const { videoPath: origVideo, videoName: origVideoName } = sessionFile;

  const [videoPath, setVideoPath] = useState(origVideo);
  const [videoName, setVideoName] = useState(origVideoName);
  const [startTime, setStartTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef();

  const isVideo = (filename) => {
    var ext = filename.split('.').pop();
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return true;
    }
    return false;
  };

  const msToTime = (s) => {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return (
      (hrs < 10 ? '0' : '') +
      hrs +
      (mins < 10 ? ':0' : ':') +
      mins +
      (secs < 10 ? ':0' : ':') +
      secs
    );
  };

  const validateUpload = (acceptedFiles) => {
    if (acceptedFiles.length !== 1) {
      console.log('more than one file uploaded');
      setVideoPath(undefined);
    } else if (!isVideo(acceptedFiles[0].path)) {
      console.log('Supported video types include .m4v, .avi, .mpg, and .mp4');
      setVideoPath(undefined);
    } else {
      setVideoPath(URL.createObjectURL(acceptedFiles[0]));
      setVideoName(acceptedFiles[0].name)
      sessionFile.data = [];
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="header">
          <h1>Upload a video</h1>
        </div>
        <div className={styles.textContainer}>
          {videoPath ? (
            <div>
              <p style={{ textAlign: 'left' }}>
                Select a custom start time by pausing at the start time. If you
                would not like to use a custom start time, simply press
                continue.
              </p>
              <p
                style={{
                  marginTop: '2%',
                  textDecoration: 'underline',
                  color: '#FE5F55',
                }}
                onClick={() => setVideoPath(null)}
              >
                Click here to select a different video.
              </p>
              <div style={{ marginTop: '3%' }}>
                <h3>START TIME: {msToTime(startTime * 1000)}</h3>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'left' }}>
              Drag and drop your video into the area. Alternatively, press the
              icon to select a video from your computer. Supported video types
              include .m4v, .avi, .mpg, and .mp4
            </p>
          )}
        </div>

        {videoPath ? (
          <div className={styles.videoContainer}>
            <ReactPlayer
              url={videoPath}
              width="100%"
              height="100%"
              style={{ flex: 1 }}
              controls={true}
              playing={playing}
              ref={playerRef}
              progressInterval={250}
              onProgress={() => {
                const time = Math.floor(playerRef.current?.getCurrentTime());
                setStartTime(time);
              }}
              onSeek={() => {
                const time = Math.floor(playerRef.current?.getCurrentTime());
                setStartTime(time);
                setPlaying(false);
              }}
            />
          </div>
        ) : (
          <div className={styles.uploadContainer}>
            <Dropzone onDrop={(acceptedFiles) => validateUpload(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section className={styles.zoneContainer}>
                  <div {...getRootProps()} className={styles.iconContainer}>
                    <input {...getInputProps()} />
                    <AiOutlineUpload className={styles.upload} />
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        )}
        <div className={styles.buttonsContainer}>
          <LinkButton
            label="Set Library"
            link="/setlibrary"
            state={{
              sessionFile: {
                generalInfo: sessionFile.generalInfo,
                set: sessionFile.set,
                data: sessionFile.data,
                videoPath: videoPath,
                videoStartTime: startTime,
                videoName: videoName,
              },
            }}
            disabled={false}
          />
          <LinkButton
            label="Continue"
            link="/videoplayer"
            state={{
              sessionFile: {
                generalInfo: sessionFile.generalInfo,
                set: sessionFile.set,
                data: sessionFile.data,
                videoPath: videoPath,
                videoStartTime: startTime,
                videoName: videoName,
              },
            }}
            disabled={!videoPath}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadVideoScreen;
