import React from 'react';
import LinkButton from '../components/LinkButton';
import styles from './ErrorScreen.module.css';
import errorLogo from '../../assets/disabled-logo.png';

const ErrorScreen = () => {
  return (
    <div className="background">
      <div className={styles.container}>
        <div className="headerTextBox">
          <h1>Something went wrong...</h1>
        </div>
        <div className={styles.imageContainer}>
          <img width="50%" alt="logo" src={errorLogo} className="center" />
        </div>
        <div className={styles.text}>
          <p>Please return to the home page and try again.</p>
        </div>
        <div className={styles.buttonContainer}>
          <LinkButton label="Home" link="/" disabled={false} />
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
