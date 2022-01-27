import React, { useState } from 'react';

import LinkButton from '../components/LinkButton';
import Dropzone from 'react-dropzone';
import { AiOutlineUpload } from 'react-icons/ai';
import { useForm, Controller } from 'react-hook-form';
import ReactPlayer from 'react-player/file';

import { useHistory } from 'react-router';

import FieldInput from '../components/FieldInput';
import {
  SessionFile,
  CodeType,
  MetaData,
  TableRow,
  DataPoint,
  SetType,
  GeneralInfo,
} from '../constants/userDefinedTypes';
import styles from './ImportScreen.module.css';

const ImportScreen = () => {
  const history = useHistory();
  const [sessionFile, setSessionFile] = useState<SessionFile>({
    generalInfo: {
      subject: '',
      observer: '',
      notes: '',
    },
    set: null,
    data: null,
    videoPath: null,
    videoStartTime: 0,
    videoName: '',
  });
  const [videoPath, setVideoPath] = useState();
  const [videoName, setVideoName] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [csvValid, setCsvValid] = useState(false);
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
  });

  const hmsToSecs = (hms) => {
    var p = hms.split(':'),
      s = 0,
      m = 1;
    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }

    return s;
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
  const isCSV = (filename) => {
    var ext = filename.split('.').pop();
    switch (ext.toLowerCase()) {
      case 'csv':
        return true;
    }
    return false;
  };

  const csvStrToArr = (text: string) => {
    let result: string[][] = [];
    const rows = text.trim().split('\n');
    rows.forEach((row: string) => result.push(row.split(',')));
    return result;
  };

  const getDataFromArr = (arr: string[][]) => {
    let result: TableRow[] = [];

    for (let i = 1; i < arr.length && arr[i][4] !== ''; i++) {
      const timestamp = arr[i][4];
      let currTableRow: TableRow = {
        timestamp: hmsToSecs(timestamp),
        codes: [],
      };
      for (let j = 5; j < arr[i].length; j++) {
        const code = arr[0][j];
        let currDataPoint: DataPoint = {
          code: code,
          value: parseInt(arr[i][j]),
        };
        currTableRow.codes.push(currDataPoint);
      }
      currTableRow.codes.sort((a, b) => (a.code > b.code ? 1 : -1));
      result.push(currTableRow);
    }
    return result;
  };

  const getCodesFromArr = (arr: string[][]) => {
    let codes: CodeType[] = [];
    for (let i = 12; i < arr.length && arr[i][0].length !== 0; i++) {
      const currCode: CodeType = {
        name: arr[i][0],
        description: arr[i][1],
        frequency: arr[i][2] === 'Frequency',
      };
      codes.push(currCode);
    }
    return codes.sort((a, b) => (a.name > b.name ? 1 : -1));
  };

  const getMetaDataFromArr = (arr: string[][]) => {
    const metaData: MetaData = {
      generalInfo: {
        subject: arr[0][1],
        observer: arr[1][1],
        notes: arr[3][1],
      },
      sessionDate: arr[2][1],
      setName: arr[4][1],
      interval: arr[5][1],
      setDescription: arr[6][1],
      numberOfEntries: arr[7][1],
      videoName: arr[8][1],
      videoStartTime: arr[9][1],
    };
    return metaData;
  };

  const readUploadedFileAsText = (inputFile) => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  };

  const validateUpload = async (acceptedFiles) => {
    if (acceptedFiles.length != 1) {
      setErrorMessage('It seems that you did not upload only one file.');
      setCsvValid(false);
    } else if (!isCSV(acceptedFiles[0].name)) {
      setErrorMessage('Please upload a file with the .csv file format.');
      setCsvValid(false);
    } else {
      const fileContents = await readUploadedFileAsText(acceptedFiles[0]);
      const tempArr = csvStrToArr(fileContents);

      const identifierArr = [
        'Subject Identifier',
        'Observer',
        'Session Date',
        'Notes',
        'Set Name',
        'Interval (seconds)',
        'Set Description',
        'Number of Entries',
        'Video Name',
        'Video Start Time',
        '',
        'Code',
      ];

      if (tempArr.length < 13) {
        setErrorMessage(
          'It seems your Behavior Buddy file was corrupted. Please try a different file.'
        );
        setCsvValid(false);
      } else {
        let identifiersPresent = true;
        for (let i = 0; i < 12; i++) {
          if (tempArr[i][0] !== identifierArr[i]) {
            identifiersPresent = false;
          }
        }

        if (!identifiersPresent) {
          setErrorMessage(
            'It seems your Behavior Buddy file was corrupted. Please try a different file.'
          );
          setCsvValid(false);
        } else {
          const codes = getCodesFromArr(tempArr);
          const metaData = getMetaDataFromArr(tempArr);

          setSessionFile({
            generalInfo: {
              subject: metaData.generalInfo.subject,
              observer: '',
              notes: '',
            },
            set: {
              name: metaData.setName,
              codes: codes,
              interval: parseInt(metaData.interval),
              description: metaData.setDescription,
            },
            data: null,
            videoPath: null,
            videoStartTime: (hmsToSecs(metaData.videoStartTime)),
            videoName: '',
          });

          setErrorMessage('');
          setCsvValid(true);
        }
      }
    }
  };

  const validateVideoUpload = (acceptedFiles) => {
    if (acceptedFiles.length !== 1) {
      setErrorMessage("It seems you've selected more than one file.");
      setVideoPath(undefined);
    } else if (!isVideo(acceptedFiles[0].path)) {
      console.log('Supported video types include .m4v, .avi, .mpg, and .mp4');
      setVideoPath(undefined);
    } else {
      setVideoPath(URL.createObjectURL(acceptedFiles[0]));
      setVideoName(acceptedFiles[0].name);
    }
  };
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

  const onSubmit = (data) => {
    history.push({
      pathname: '/videoplayer',
      state: {
        sessionFile: {
          generalInfo: {
            subject: sessionFile.generalInfo.subject,
            observer: data.observer,
            notes: data.notes,
          },
          set: sessionFile.set,
          data: sessionFile.data,
          videoPath: videoPath,
          videoStartTime: sessionFile.videoStartTime,
          videoName: videoName,
        },
        fromImport: true,
      },
    });
  };

  return (
    <div className="background">
      <div className="container">
        <h1>Start Session from Pre-Existing File</h1>
        <div className={styles.fieldsContainer}>
          <div className={styles.field}>
            <h4>&nbsp;OBSERVER/CODER</h4>
            <FieldInput
              control={control}
              name="observer"
              rules={{ required: true }}
            />
          </div>
          <div className={styles.textFieldContainer}>
            <h4>&nbsp;NOTES</h4>
            <div className={styles.textAreaContainer}>
              <Controller
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <textarea
                    className={styles.input}
                    style={{ resize: 'none', flex: '1' }}
                    onBlur={onBlur}
                    onChange={(value) => {
                      onChange(value);
                    }}
                    value={value}
                  />
                )}
                name="notes"
              />
            </div>
          </div>
        </div>

        {csvValid ? (
          <div
            style={{
              flex: 6,
              marginTop: '3%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex' }}>
              <p style={{ textAlign: 'left' }}>
                If this information is correct, upload your video.
                Otherwise,&nbsp;
              </p>
              <p
                style={{
                  textAlign: 'left',
                  color: '#FE5F55',
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  setCsvValid(false);
                  setSessionFile({
                    generalInfo: {
                      subject: '',
                      observer: '',
                      notes: '',
                    },
                    set: null,
                    data: null,
                    videoPath: null,
                    videoStartTime: 0,
                    videoName: '',
                  });
                  setErrorMessage('');
                }}
              >
                choose a different file.
              </p>
            </div>
            <p style={{ textAlign: 'left', color: '#FE5F55' }}>
              {errorMessage}
            </p>
            {/* subject identifier, set name, codes, start time, interval */}

            <p style={{ textAlign: 'left' }}>
              Subject Identifier: {sessionFile.generalInfo.subject}
            </p>
            <p style={{ textAlign: 'left' }}>
              Set Name: {sessionFile.set.name}
            </p>
            <p style={{ textAlign: 'left' }}>
              Start Time: {msToTime(sessionFile.videoStartTime * 1000)}
            </p>
            <p style={{ textAlign: 'left' }}>
              Interval: {sessionFile.set.interval}s
            </p>
            <p style={{ textAlign: 'left' }}>
              Codes:{' '}
              {sessionFile.set.codes
                .map((elem) => {
                  return elem.name;
                })
                .join(', ')}
            </p>
            {videoPath ? (
              <div className={styles.videoContainer}>
                <ReactPlayer
                  url={videoPath}
                  width="60%"
                  height="60%"
                  style={{ flex: 1 }}
                  controls={true}
                />
              </div>
            ) : (
              <div className={styles.uploadContainer}>
                <Dropzone
                  onDrop={(acceptedFiles) => validateVideoUpload(acceptedFiles)}
                >
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
          </div>
        ) : (
          <div style={{ flex: 6, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, marginTop: '3%' }}>
              <p style={{ textAlign: 'left' }}>
                Please upload the resulting .csv file from a previous session.
              </p>
              <p style={{ textAlign: 'left', color: '#FE5F55' }}>
                {errorMessage}
              </p>
            </div>
            <div className={styles.uploadContainer}>
              <Dropzone
                onDrop={(acceptedFiles) => validateUpload(acceptedFiles)}
              >
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
          </div>
        )}

        <div className={styles.buttonsContainer}>
          <LinkButton label="Home" link="/" disabled={false} />
          <LinkButton
            label="Continue"
            link="/videoplayer"
            onClick={handleSubmit(onSubmit)}
            state={{
              sessionFile: {
                generalInfo: sessionFile.generalInfo,
                set: sessionFile.set,
                data: sessionFile.data,
                videoPath: videoPath,
                videoStartTime: sessionFile.videoStartTime,
                videoName: videoName,
              },
              fromImport: true,
            }}
            disabled={!videoPath || !isValid}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportScreen;
