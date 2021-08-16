import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router';
import ReactPlayer from 'react-player/file';
import {
  AiOutlineMinusCircle,
  AiOutlinePlusCircle,
  AiFillPauseCircle,
  AiOutlinePauseCircle,
} from 'react-icons/ai';

import styles from './VideoPlayerScreen.module.css';
import LinkButton from '../components/LinkButton';
import { DataPoint, TableRow, SetType } from '../constants/userDefinedTypes';
import ErrorScreen from './ErrorScreen';

const VideoPlayerScreen = () => {
  const location = useLocation();
  if (!location.state) {
    return <ErrorScreen />;
  }
  const { sessionFile } = location.state;
  const { videoPath } = sessionFile;
  const { codes, interval }: SetType = sessionFile.set;

  if (!videoPath || !sessionFile) {
    return <ErrorScreen />;
  }

  const initialRows = sessionFile.data ? sessionFile.data : [];

  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [autoPause, setAutoPause] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);
  const [currentTimeSlice, setCurrentTimeSlice] = useState<number>(0);
  const [timeUntilCode, setTimeUntilCode] = useState<number>(0);
  const playerRef = useRef();

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

  const renderDataPoint = (
    datapoint: DataPoint,
    rowIndex: number,
    colIndex: number
  ) => {
    return datapoint.frequency ? (
      <td
        style={
          rows[rowIndex].codes[colIndex].value > 0
            ? { backgroundColor: '#fe5f55' }
            : {}
        }
      >
        <input
          className={styles.input}
          style={
            rows[rowIndex].codes[colIndex].value > 0
              ? { backgroundColor: '#fe5f55', color: 'white' }
              : {}
          }
          type="number"
          defaultValue={0}
          min={0}
          onChange={(e) => {
            const newRows: TableRow[] = rows.slice();
            newRows[rowIndex].codes[colIndex].value = parseInt(e.target.value);
            setRows(newRows);
          }}
        />
      </td>
    ) : (
      <td
        style={datapoint.value > 0 ? { backgroundColor: '#fe5f55' } : {}}
        onClick={() => {
          const newRows: TableRow[] = rows.slice();
          newRows[rowIndex].codes[colIndex].value = +!newRows[rowIndex].codes[
            colIndex
          ].value;
          setRows(newRows);
        }}
      ></td>
    );
  };

  const renderRow = (row: TableRow, rowIndex: number) => {
    return (
      <tr>
        <td
          className={styles.timestamp}
          style={
            currentTimeSlice === row.timestamp
              ? { backgroundColor: '#FE5F55', color: 'white' }
              : {}
          }
          onClick={() => {
            playerRef.current.seekTo(row.timestamp, 'seconds');
            setCurrentTimeSlice(row.timestamp);
          }}
        >
          {msToTime(row.timestamp * 1000)}
        </td>
        {row.codes.map((datapoint, index) =>
          renderDataPoint(datapoint, rowIndex, index)
        )}
      </tr>
    );
  };

  const renderTable = () => {
    return <tbody>{rows.map((row, index) => renderRow(row, index))}</tbody>;
  };

  const onAddNewRow = () => {
    const timestamp = rows.length * interval;
    const codesCopy: DataPoint[] = codes.map((code) => ({
      code: code.name,
      value: 0,
      frequency: code.frequency,
    }));

    const rowToAdd: TableRow = {
      timestamp: timestamp,
      codes: codesCopy,
    };

    setRows([...rows, rowToAdd]);
  };

  const onClearRow = () => {
    setRows(
      rows.filter((row, index) => {
        return index !== rows.length - 1;
      })
    );
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.videoAndTable}>
          <div className={styles.videoSide}>
            <ReactPlayer
              url={videoPath}
              controls={true}
              width="100%"
              progressInterval={250}
              playing={playing}
              ref={playerRef}
              onProgress={() => {
                const time = Math.floor(playerRef.current?.getCurrentTime());
                if (time % interval === 0) {
                  if (currentTimeSlice !== time && autoPause) {
                    setPlaying(false);
                  }
                  setCurrentTimeSlice(time);
                  setTimeUntilCode(0);
                } else {
                  setPlaying(true);
                  setTimeUntilCode(
                    currentTimeSlice + parseInt(interval) - time
                  );
                }
              }}
              onSeek={() => {
                const time = Math.floor(playerRef.current?.getCurrentTime());
                const secsToRemove = time % interval;
                const target = time - secsToRemove;
                setCurrentTimeSlice(target);
                let timeTilCode = target + parseInt(interval) - time;
                if (timeTilCode === parseInt(interval)) timeTilCode = 0;
                setTimeUntilCode(timeTilCode);
              }}
            />
            <div>
              <div style={{ borderBottom: '2px solid #4F6367' }}>
                <h2 style={{ textAlign: 'center' }}>SECONDS UNTIL NEXT CODE</h2>
              </div>

              <h1
                style={
                  timeUntilCode <= 3
                    ? { fontSize: 144, color: '#FE5F55' }
                    : { fontSize: 144 }
                }
              >
                {timeUntilCode}
              </h1>
            </div>
          </div>
          <div className={styles.tableSide}>
            <div className={styles.tableSuperHeader}>
              <div className={styles.tableTitle}>
                <h2>{sessionFile.generalInfo.subject.toUpperCase()}</h2>
              </div>
              <div className={styles.tableButtons}>
                {autoPause ? (
                  <AiFillPauseCircle
                    className={styles.icon}
                    onClick={() => {
                      setAutoPause(false);
                      setPlaying(true);
                    }}
                  />
                ) : (
                  <AiOutlinePauseCircle
                    className={styles.icon}
                    onClick={() => setAutoPause(true)}
                  />
                )}
                <AiOutlineMinusCircle
                  className={styles.icon}
                  onClick={onClearRow}
                />
                <AiOutlinePlusCircle
                  className={styles.icon}
                  onClick={onAddNewRow}
                />
              </div>
            </div>
            <div className={styles.tableHeader}>
              <h4 style={{ flex: 1, textAlign: 'center' }}>TIME</h4>
              {sessionFile.set.codes.map((code) => (
                <h4 style={{ flex: 1, textAlign: 'center' }}>
                  {code.name.toUpperCase()}
                </h4>
              ))}
            </div>
            <div className={styles.tableContainer}>{renderTable()}</div>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <LinkButton
            label="Go Back"
            link="/uploadvideo"
            state={{ sessionFile: sessionFile }}
            disabled={false}
          />
          <LinkButton
            label="Finished"
            link="/confirm"
            state={{
              sessionFile: {
                generalInfo: sessionFile.generalInfo,
                set: sessionFile.set,
                data: rows,
                videoPath: sessionFile.videoPath,
              },
            }}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerScreen;
