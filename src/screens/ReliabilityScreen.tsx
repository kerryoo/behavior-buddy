import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { AiOutlineUpload, AiOutlineDownload } from 'react-icons/ai';

import styles from './ReliabilityScreen.module.css';
import LinkButton from '../components/LinkButton';

const ReliabilityScreen = () => {
  const XLSX = require('xlsx');
  var fileDownload = require('js-file-download');
  const jetpack = require('fs-jetpack');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [complete, setComplete] = useState<boolean>(false);
  const [firstArr, setFirstArr] = useState<string[][]>();
  const [secondArr, setSecondArr] = useState<string[][]>();
  const [firstFileName, setFirstFileName] = useState<string>('');
  const [secondFileName, setSecondFileName] = useState<string>('');

  const isCSV = (filename) => {
    var ext = filename.split('.').pop();
    switch (ext.toLowerCase()) {
      case 'csv':
        return true;
    }
    return false;
  };

  const validateUpload = (acceptedFiles) => {
    if (acceptedFiles.length !== 2) {
      console.log('two files not uploaded');
      setErrorMessage('Please upload two files.');
    } else if (!isCSV(acceptedFiles[0].path) || !isCSV(acceptedFiles[1].path)) {
      console.log('Supported video types include .csv');
      setErrorMessage('Please make sure your files are .csv files.');
    } else {
      setFirstFileName(acceptedFiles[0].name);
      setSecondFileName(acceptedFiles[1].name);
      let arr1: string[][] = [];
      let arr2: string[][] = [];

      const firstReader = new FileReader();
      firstReader.onload = function (e) {
        arr1 = [];
        const text = e.target.result;
        const rows = text.trim().split('\n');
        rows.forEach((row: string) => arr1.push(row.split(',')));
      };

      const secondReader = new FileReader();
      secondReader.onload = function (e) {
        arr2 = [];
        const text = e.target.result;
        const rows = text.trim().split('\n');
        rows.forEach((row: string) => arr2.push(row.split(',')));
      };

      firstReader.readAsText(acceptedFiles[0]);
      secondReader.readAsText(acceptedFiles[1]);

      setTimeout(function () {
        let valid = true;
        if (arr1?.length !== arr2?.length) {
          setErrorMessage(
            'There are a different number of entries in the two files. Please edit them, or upload different files.'
          );
          console.log(
            'There are a different number of entries in the two files. Please edit them, or upload different files.'
          );
          setFirstArr(undefined);
          setSecondArr(undefined);
          valid = false;
        } else if (arr1[0].length !== arr2[0].length) {
          console.log(
            'There are a different amount of codes in the two files. Please upload compatible files.'
          );
          setErrorMessage(
            'There are a different amount of codes in the two files. Please upload compatible files.'
          );
          setFirstArr(undefined);
          setSecondArr(undefined);
          valid = false;
        } else {
          let flag = false;
          for (let i = 1; i < arr1[0].length; i++) {
            if (arr1[0][i] !== arr2[0][i]) {
              flag = true;
            }
          }

          if (flag) {
            console.log('not the same codes');
            setErrorMessage(
              'The files do not share the same set or order of codes. Please reformat or upload compatible files.'
            );
            setFirstArr(undefined);
            setSecondArr(undefined);
            valid = false;
          }

          flag = false;
          for (let i = 1; i < arr1.length; i++) {
            if (arr1[i][0] !== arr2[i][0]) {
              flag = true;
            }
          }
          if (flag) {
            console.log('not the same timestamps');
            setErrorMessage(
              'The files do not share the same intervals. Please upload compatible files.'
            );
            setFirstArr(undefined);
            setSecondArr(undefined);
            valid = false;
          }
        }

        if (valid) {
          console.log('Success!');
          setFirstArr(arr1);
          setSecondArr(arr2);
          setErrorMessage('');
          setComplete(true);
        } else {
          setComplete(false);
        }
      }, 500);
    }
  };

  const createExcel = () => {
    let sheetHeader = ['Time'];
    for (let i = 1; i < firstArr[0].length; i++) {
      const codeName = firstArr[0][i];
      sheetHeader.push(codeName + ', ' + firstFileName);
      sheetHeader.push(codeName + ', ' + secondFileName);
      sheetHeader.push(codeName + ' Match');
    }

    let sheetArray = [sheetHeader];
    for (let i = 1; i < firstArr.length; i++) {
      const timestamp = firstArr[i][0];
      let row = [timestamp];
      for (let j = 1; j < firstArr[i].length; j++) {
        row.push(firstArr[i][j]);
        row.push(secondArr[i][j]);
        row.push(firstArr[i][j] === secondArr[i][j] ? '1' : '0');
      }
      sheetArray.push(row);
    }

    let sheetFooter = [' '];

    for (let i = 3; i < sheetArray[0].length; i += 3) {
      let count = 0;
      for (let j = 1; j < sheetArray.length; j++) {
        if (sheetArray[j][i] === '1') {
          count++;
        }
      }
      sheetFooter.push(' ');
      sheetFooter.push(' ');
      sheetFooter.push(
        ((count / (sheetArray.length - 1)) * 100).toFixed(2) + '%'
      );
    }
    sheetArray.push(sheetFooter);

    var worksheet = XLSX.utils.aoa_to_sheet(sheetArray);
    var originalSheet1 = XLSX.utils.aoa_to_sheet(firstArr);
    var originalSheet2 = XLSX.utils.aoa_to_sheet(secondArr);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Comparison');
    XLSX.utils.book_append_sheet(wb, originalSheet1, 'file1');
    XLSX.utils.book_append_sheet(wb, originalSheet2, 'file2');
    var data = XLSX.write(wb, { type: 'buffer', bookType: 'xlsb' });
    fileDownload(data, 'out.xlsb');
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
