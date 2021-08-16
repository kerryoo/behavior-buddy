import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { AiOutlineFileAdd } from 'react-icons/ai';

import SetCard from '../components/SetCard';
import styles from './SetLibraryScreen.module.css';
import { SetType, SessionFile } from '../constants/userDefinedTypes';
import disabledLogo from '../../assets/disabled-logo.png';
import ErrorScreen from './ErrorScreen';
import LinkButton from '../components/LinkButton';

const SetLibraryScreen = () => {
  const location = useLocation();
  if (!location.state) {
    return <ErrorScreen />;
  }
  const { sessionFile } = location.state;
  const setsString = localStorage.getItem('sets');
  const sets = setsString ? JSON.parse(localStorage.getItem('sets')) : null;
  const { set: initialSet } = sessionFile;
  const [selection, setSelection] = useState<SetType>(initialSet);
  const [forceUpdateHook, setForceUpdateHook] = useState<boolean>(false);
  const [nextSessionFile, setNextSessionFile] = useState<SessionFile>(
    sessionFile
  );

  const forceUpdate = () => {
    setForceUpdateHook(!forceUpdateHook);
  };

  const renderSet = (item) => {
    const selected = selection && item.name === selection.name;
    const valueToSet = selected ? null : item;
    return (
      <SetCard
        setProps={item}
        selected={selected}
        onPress={() => {
          setSelection(valueToSet);
          setNextSessionFile({
            generalInfo: nextSessionFile.generalInfo,
            set: valueToSet,
            data: null,
            videoPath: null,
          });
        }}
        onRemovePress={() => {
          if (selected) {
            setSelection(null);
            setNextSessionFile({
              generalInfo: nextSessionFile.generalInfo,
              set: null,
              data: null,
              videoPath: null,
            });
          } else {
            forceUpdate();
          }
        }}
      />
    );
  };

  return (
    <div className="background">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.addContainer}></div>
          <div className={styles.titleContainer}>
            <h1>Set Library</h1>
          </div>
          <div className={styles.addContainer}>
            <Link
              to={{
                pathname: '/newset',
                state: { sessionFile: sessionFile },
              }}
            >
              <AiOutlineFileAdd className={styles.add} />
            </Link>
          </div>
        </div>

        <div className={styles.content}>
          {sets && sets.length !== 0 ? (
            sets.map((set) => renderSet(set))
          ) : (
            <div className={styles.emptySetContainer}>
              <p style={{ flex: 1, color: '#FE5F55' }}>
                You don't have any sets! Add a few by pressing the icon on the
                top right.
              </p>
              <img
                width="60%"
                alt="logo"
                src={disabledLogo}
                className="center"
                style={{ flex: 1 }}
              />
              <div style={{ flex: 1 }} />
            </div>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          <LinkButton
            label="General Info"
            link="/generalinfo"
            state={{ sessionFile: sessionFile }}
            disabled={false}
          />
          <LinkButton
            label="Continue"
            link="/uploadvideo"
            state={{ sessionFile: nextSessionFile }}
            disabled={!selection}
          />
        </div>
      </div>
    </div>
  );
};

export default SetLibraryScreen;
