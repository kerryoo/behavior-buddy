import React from 'react';
import { useLocation } from 'react-router-dom';
import { AiOutlineDownload } from 'react-icons/ai';

import { DataPoint, TableRow, CodeType } from '../constants/userDefinedTypes';
import ErrorScreen from './ErrorScreen';
import LinkButton from '../components/LinkButton';
import styles from './ConfirmationScreen.module.css';

const ConfirmationScreen = () => {
  const location = useLocation();

  var fileDownload = require('js-file-download');

  if (!location.state) {
    return <ErrorScreen />;
  }
  const { sessionFile } = location.state;
  const { generalInfo, data, set, videoPath} = sessionFile;
  const XLSX = require('xlsx');

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

  const getReformattedData = () => {
    let reformatted = data.map((row: TableRow) => {
      return [
        msToTime((row.timestamp) * 1000),
        ...row.codes.map((datapoint: DataPoint) => {
          return datapoint.value;
        }),
      ];
    });

    const fileHeader = [
      'Timestamp',
      ...set.codes.map((code: CodeType) => code.name),
    ];
    reformatted = [fileHeader, ...reformatted];

    return reformatted;
  };

  const createExcel = () => {
    const { subject, observer } = generalInfo;
    const reformattedData = getReformattedData();
    let date = new Date();
    var worksheet = XLSX.utils.aoa_to_sheet(reformattedData);
    fileDownload(
      XLSX.utils.sheet_to_csv(worksheet),
      subject + '_' + observer + '_' + date.toDateString().replaceAll(' ', '_') + '.csv'
    );
  };

  return (
    <div className="background">
      <div className="container">
        <h1>Save your file!</h1>
        <div style={{ flex: 1 }}>
          <p style={{ textAlign: 'left' }}>
            Thank you so much for using Behavior Buddy! Press the icon below to
            download your file. You can then return to the home screen and
            complete another session.
          </p>
        </div>

        <div className={styles.iconContainer}>
          <AiOutlineDownload
            className={styles.download}
            onClick={createExcel}
          />
        </div>
        <div className={styles.buttonsContainer}>
          <LinkButton
            label="Edit Codes"
            link="/videoplayer"
            state={{ sessionFile: sessionFile }}
            disabled={false}
          />
          <LinkButton label="Home" link="/" disabled={false} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
