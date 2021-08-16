import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import logo from '../../assets/Behavior-Buddy-Logo.png';
import styles from './HomeScreen.module.css';
import { SessionFile } from '../constants/userDefinedTypes';

const HomeScreen = () => {
  const state = {
    sessionFile: {
      generalInfo: {
        subject: "",
        observer: "",
        notes: "",
      },
      set: null,
      data: null,
      videoPath: null,
    },
  };

  return (
    <div className="background">
      <div className={styles.imageContainer}>
        <img width="65%" alt="logo" src={logo} className="center" />
      </div>
      <div className={styles.buttonContainer}>
        <Link
          to="/reliability"
          style={{ flex: 1, display: 'flex', textDecoration: 'none' }}
        >
          <Button label="Inter-Rater Reliability" />
        </Link>
      </div>
      <div className={styles.buttonContainer}>
        <Link
          to={{ pathname: '/generalInfo', state: state }}
          style={{ flex: 1, display: 'flex', textDecoration: 'none' }}
        >
          <Button label="New Session" />
        </Link>
      </div>

      <div className={styles.buttonContainer}>
        <Button label="About" onClick={() => console.log('about')} />
      </div>
    </div>
  );
};

export default HomeScreen;
