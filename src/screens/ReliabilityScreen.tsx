import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { AiOutlineUpload, AiOutlineDownload } from 'react-icons/ai';

import styles from './ReliabilityScreen.module.css';
import LinkButton from '../components/LinkButton';
import {
  CodeType,
  MetaData,
  TableRow,
  DataPoint,
} from '../constants/userDefinedTypes';

const ReliabilityScreen = () => {
  const XLSX = require('xlsx');
  var fileDownload = require('js-file-download');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [complete, setComplete] = useState<boolean>(false);
  const [firstFileData, setFirstFileData] = useState<TableRow[]>([]);
  const [secondFileData, setSecondFileData] = useState<TableRow[]>([]);
  const [firstFileName, setFirstFileName] = useState<string>('');
  const [secondFileName, setSecondFileName] = useState<string>('');
  const [comparisonFileName, setComparisonFileName] = useState<string>('');

  const [arr1, setArr1] = useState<string[][]>([]);
  const [arr2, setArr2] = useState<string[][]>([]);

  const getEmptyTableRow = (toCopy: TableRow) => {
    let codes: DataPoint[] = [];

    for (let i = 0; i < toCopy.codes.length; i++) {
      codes.push({ code: toCopy.codes[i].code, value: 0 });
    }
    let tableRow = {
      timestamp: toCopy.timestamp,
      codes: codes,
    };

    return tableRow;
  };

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
    return codes;
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

  const validateUpload = async (acceptedFiles) => {
    if (acceptedFiles.length != 2) {
      setErrorMessage('It seems that you did not upload two files.');
    } else if (!isCSV(acceptedFiles[0].name) || !isCSV(acceptedFiles[1].name)) {
      setErrorMessage('Please upload files with the .csv file format.');
    } else {
      const firstFileContents = await readUploadedFileAsText(acceptedFiles[0]);
      const secondFileContents = await readUploadedFileAsText(acceptedFiles[1]);

      const tempArr1 = csvStrToArr(firstFileContents);
      const tempArr2 = csvStrToArr(secondFileContents);

      const codes1 = getCodesFromArr(tempArr1);
      const codes2 = getCodesFromArr(tempArr2);

      const metaData1 = getMetaDataFromArr(tempArr1);
      const metaData2 = getMetaDataFromArr(tempArr2);

      if (JSON.stringify(codes1) !== JSON.stringify(codes2)) {
        setErrorMessage(
          'It seems that the code set is different between the two files.'
        );
      } else if (metaData1.interval !== metaData2.interval) {
        setErrorMessage(
          'It seems that there are a mismatch of interval between the two files.'
        );
      } else if (hmsToSecs(metaData1.videoStartTime) !== hmsToSecs(metaData2.videoStartTime)) {
        setErrorMessage(
          'It seems the start time between the two files do not match.'
        );
      } else {
        setErrorMessage('');
        const data1 = getDataFromArr(tempArr1);
        const data2 = getDataFromArr(tempArr2);

        if (data1.length > data2.length) {
          for (let i = data2.length; i < data1.length; i++) {
            data2.push(getEmptyTableRow(data1[i]));
          }
        } else if (data1.length < data2.length) {
          for (let i = data1.length; i < data2.length; i++) {
            data1.push(getEmptyTableRow(data2[i]));
          }
        }

        setFirstFileName(
          metaData1.generalInfo.subject + '_' + metaData1.generalInfo.observer
        );
        setSecondFileName(
          metaData2.generalInfo.subject + '_' + metaData2.generalInfo.observer
        );

        if (firstFileName === secondFileName) {
          setSecondFileName(secondFileName + '_1');
        }

        setFirstFileData(data1);
        setSecondFileData(data2);
        setComparisonFileName(
          metaData1.generalInfo.subject + '_' + 'Comparison'
        );

        setArr1(tempArr1);
        setArr2(tempArr2);
        setComplete(true);
      }

      // const tempSessionFile1: SessionFile = {};
    }
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

  const createExcel = () => {
    let sheetHeader = ['Time'];
    for (let i = 0; i < firstFileData[0].codes.length; i++) {
      const codeName = firstFileData[0].codes[i].code;
      sheetHeader.push(codeName + ', ' + firstFileName);
      sheetHeader.push(codeName + ', ' + secondFileName);
      sheetHeader.push(codeName + ' Match');
    }

    let sheetArray = [sheetHeader];

    for (let i = 0; i < firstFileData.length; i++) {
      const { timestamp: timestamp1, codes: codes1 } = firstFileData[i];
      const { timestamp: timestamp2, codes: codes2 } = secondFileData[i];

      let row = [msToTime(timestamp1 * 1000)];

      for (let j = 0; j < codes1.length; j++) {
        row.push(codes1[j].value.toString());
        row.push(codes2[j].value.toString());

        row.push(
          codes1[j].value === codes2[j].value
            ? '100.00%'
            : codes1[j].value > codes2[j].value
            ? ((codes2[j].value / codes1[j].value) * 100)
                .toFixed(2)
                .toString() + '%'
            : ((codes1[j].value / codes2[j].value) * 100)
                .toFixed(2)
                .toString() + '%'
        );
      }
      sheetArray.push(row);
    }

    let sheetFooter = [' '];
    let totalReliability = 0;
    let reliabilitiesCount = 0;

    for (let i = 3; i < sheetArray[0].length; i += 3) {
      let total = 0;
      for (let j = 1; j < sheetArray.length; j++) {
        total += parseFloat(sheetArray[j][i]);
      }
      sheetFooter.push(' ');
      sheetFooter.push(' ');

      const reliability = total / (sheetArray.length - 1);
      totalReliability += reliability;
      reliabilitiesCount++;
      sheetFooter.push(reliability.toFixed(2) + '%');
    }
    sheetArray.push(sheetFooter);
    sheetArray.push([]);
    sheetArray.push([
      'Reliability Average',
      (totalReliability / reliabilitiesCount).toFixed(2) + '%',
    ]);

    var worksheet = XLSX.utils.aoa_to_sheet(sheetArray);
    var originalSheet1 = XLSX.utils.aoa_to_sheet(arr1);
    var originalSheet2 = XLSX.utils.aoa_to_sheet(arr2);

    var wb = XLSX.utils.book_new();
    var date = new Date();
    XLSX.utils.book_append_sheet(wb, worksheet, comparisonFileName);
    XLSX.utils.book_append_sheet(wb, originalSheet1, firstFileName);
    XLSX.utils.book_append_sheet(wb, originalSheet2, secondFileName);
    var data = XLSX.write(wb, { type: 'buffer', bookType: 'xlsb' });
    fileDownload(
      data,
      comparisonFileName +
        '_' +
        date.toDateString().replaceAll(' ', '_') +
        '.xlsb'
    );
  };

  return (
    <div className="background">
      <div className="container">
        <div className="header">
          <h1>Upload two files</h1>
        </div>
        <div className={styles.textContainer}>
          <p style={{ textAlign: 'left' }}>
            Drag and drop your two CSV files into the area. Alternatively, you
            can press the area and select the two files. These should be CSV
            files produced by the same Behavior Buddy set.
          </p>
        </div>
        {complete ? (
          <div className={styles.iconContainer}>
            <AiOutlineDownload
              className={styles.download}
              onClick={createExcel}
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
            <div style={{ marginTop: '2%' }}>
              <p style={{ color: '#FE5F55', textAlign: 'left' }}>
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <div className={styles.buttonsContainer}>
          <LinkButton label="Home" link="/" disabled={false} />
        </div>
      </div>
    </div>
  );
};

export default ReliabilityScreen;
