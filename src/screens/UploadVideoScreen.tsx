import React, { useState } from 'react';
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
  const { videoPath: origVideo } = sessionFile;

  const [videoPath, setVideoPath] = useState(origVideo);

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

  const validateUpload = (acceptedFiles) => {
    if (acceptedFiles.length !== 1) {
      console.log('more than one file uploaded');
      setVideoPath(undefined);
    } else if (!isVideo(acceptedFiles[0].path)) {
      console.log('Supported video types include .m4v, .avi, .mpg, and .mp4');
      setVideoPath(undefined);
    } else {
      setVideoPath(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="header">
          <h1>Upload a video</h1>
        </div>
        <div className={styles.textContainer}>
          <p style={{ textAlign: 'left' }}>
            Drag and drop your video into the area. Alternatively, press the
            icon to select a video from your computer. Supported video types
            include .m4v, .avi, .mpg, and .mp4
          </p>
        </div>
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
        <div className={styles.videoContainer}>
          <ReactPlayer
            url={videoPath}
            width="100%"
            height="100%"
            style={{ flex: 1 }}
            controls={true}
            playing={true}
          />
        </div>
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
