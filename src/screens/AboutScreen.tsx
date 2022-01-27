import React from 'react';
import { useLocation } from 'react-router-dom';

import styles from './AboutScreen.module.css';
import LinkButton from '../components/LinkButton';

const AboutScreen = () => {
  return (
    <div className="background">
      <div className="container">
        <h1>About</h1>
        <div style={{ flex: 1 }}>
          <p style={{ textAlign: 'left' }}>
            Developed at Vanderbilt University by Kerr Yoo, Catherine Seok, and
            Sage Pickren, Behavior Buddy is a tool for behavioral science
            research built with React and Electron, with the purpose of
            facilitating data collection from videos. It offers a
            straightforward, user-friendly experience. A coder can easily
            create, edit, and delete sets with which they may analyze uploaded
            videos. The codings can then be exported as a .csv file and compared
            against eachother within the application. Please enjoy using Behavior Buddy!
          </p>
        </div>
        <div className={styles.buttonsContainer}>
          {/* <LinkButton
            label="Edit Codes"
            link="/videoplayer"
            state={{ sessionFile: sessionFile }}
            disabled={false}
          /> */}
          <LinkButton label="Home" link="/" disabled={false} />
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
