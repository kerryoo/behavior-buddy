import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import {
  AiOutlinePlusSquare,
  AiOutlineClose,
  AiOutlineBorder,
  AiOutlineCheckSquare,
} from 'react-icons/ai';

import FieldInput from '../components/FieldInput';
import styles from './NewSetScreen.module.css';
import { CodeType, SetType } from '../constants/userDefinedTypes';
import ErrorScreen from './ErrorScreen';
import LinkButton from '../components/LinkButton';
import { useHistory } from 'react-router-dom';

const NewSetScreen = () => {
  const location = useLocation();
  if (!location.state) {
    return <ErrorScreen />;
  }

  const { sessionFile, setToEdit } = location.state;
  const history = useHistory();

  let editingSet = false;
  let initialData: SetType = {
    name: '',
    interval: 0,
    description: '',
    codes: [],
  };
  if (setToEdit) {
    editingSet = true;
    initialData = setToEdit;
  }

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: initialData.name,
      interval: initialData.interval,
      description: initialData.description,
    },
  });

  const {
    control: codeControl,
    handleSubmit: handleCodeSubmit,
    formState: { isValid: codesValid },
  } = useForm({ mode: 'onChange' });

  const [codes, setCodes] = useState<CodeType[]>(initialData.codes);
  const [frequency, setFrequency] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onCodeSubmit = (data) => {
    const code: CodeType = {
      name: data.code,
      description: data.codeDescription,
      frequency: frequency,
    };
    setCodes([...codes, code]);
  };

  const onRemoveCode = (code: CodeType) => {
    let originalCodes = [...codes];
    let index = originalCodes.indexOf(code);
    if (index !== -1) {
      originalCodes.splice(index, 1);
      setCodes(originalCodes);
    }
  };

  //return success or failure
  const onSetSubmit = (data) => {
    const { name, interval, description } = data;

    const setToBeSaved: SetType = {
      name: name,
      codes: codes,
      interval: interval,
      description: description,
    };
    const oldSetsString = localStorage.getItem('sets');

    let foundSameName = false;

    if (oldSetsString) {
      const oldSets = JSON.parse(oldSetsString);
      oldSets.forEach((set) => {
        if (set.name === name) {
          if (
            error ===
            'You have a set with the same name. Please click "Create Set" again if you would like to overwrite the old set.'
          ) {
            const newSets = oldSets.filter((obj) => obj.name !== name);
            newSets.push(setToBeSaved);
            localStorage.setItem('sets', JSON.stringify(newSets));
            console.log('Saved new set');
            history.push({
              pathname: '/setlibrary',
              state: {
                sessionFile: {
                  generalInfo: sessionFile.generalInfo,
                  set: setToBeSaved,
                  data: sessionFile.data,
                  videoPath: sessionFile.videoPath,
                  videoStartTime: sessionFile.videoStartTime,
                },
              },
            });
          } else {
            setError(
              'You have a set with the same name. Please click "Create Set" again if you would like to overwrite the old set.'
            );
          }
          foundSameName = true;
        }
      });
      if (!foundSameName) {
        oldSets.push(setToBeSaved);
        localStorage.setItem('sets', JSON.stringify(oldSets));
        console.log('Saved new set');
        history.push({
          pathname: '/setlibrary',
          state: {
            sessionFile: {
              generalInfo: sessionFile.generalInfo,
              set: setToBeSaved,
              data: sessionFile.data,
              videoPath: sessionFile.videoPath,
              videoStartTime: sessionFile.videoStartTime,
              videoName: sessionFile.videoName,
            },
          },
        });
      }
    } else {
      localStorage.setItem('sets', JSON.stringify([setToBeSaved]));
      history.push({
        pathname: '/setlibrary',
        state: {
          sessionFile: {
            generalInfo: sessionFile.generalInfo,
            set: setToBeSaved,
            data: sessionFile.data,
            videoPath: sessionFile.videoPath,
            videoStartTime: sessionFile.videoStartTime,
            videoName: sessionFile.videoName,
          },
        },
      });
    }
  };

  const validateCode = (codeName) => {
    let flag = true;
    codes.forEach((element) => {
      if (element.name === codeName) {
        flag = false;
      }
    });
    return flag;
  };

  const renderCode = (item: CodeType) => {
    return (
      <div className={styles.code}>
        <p style={{ flex: 1, textAlign: 'left' }}>{item.name + ': '}</p>
        <p style={{ flex: 5, textAlign: 'left' }}> {item.description}</p>
        <AiOutlineClose
          className={styles.remove}
          onClick={() => onRemoveCode(item)}
        />
      </div>
    );
  };

  return (
    <div className={'background'}>
      <div className="container">
        <h1>{editingSet ? 'Edit Set' : 'New Set'}</h1>
        <div className={styles.fieldsContainer}>
          <div className={styles.header}>
            <div className={styles.inputBox} style={{ paddingRight: '2%' }}>
              <h4>&nbsp;NAME</h4>
              <FieldInput
                control={control}
                name="name"
                rules={{ required: true }}
                defaultValue={initialData.name}
              />
            </div>
            <div className={styles.inputBox}>
              <h4>&nbsp;INTERVAL</h4>
              <FieldInput
                control={control}
                name="interval"
                rules={{ required: true }}
                defaultValue={initialData.interval.toString()}
              />
            </div>
          </div>
          <div className={styles.inputBox} style={{ flex: 2 }}>
            <h4>&nbsp;DESCRIPTION</h4>
            <FieldInput
              control={control}
              name="description"
              rules={{ required: false }}
              defaultValue={initialData.description}
            />
          </div>
        </div>
        <h2>Add a few tags:</h2>
        <div className={styles.fieldsContainer}>
          <div className={styles.header}>
            <div className={styles.inputBox} style={{ paddingRight: '2%' }}>
              <h4>&nbsp;CODE NAME</h4>
              <FieldInput
                control={codeControl}
                name="code"
                rules={{
                  required: true,
                  validate: (code) => validateCode(code),
                }}
              />
            </div>

            <div className={styles.inputBox} style={{ flex: 2 }}>
              <h4>&nbsp;DESCRIPTION</h4>
              <FieldInput
                control={codeControl}
                name="codeDescription"
                rules={{ required: false }}
              />
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                marginLeft: '2%',
              }}
            >
              <h4>FREQUENCY</h4>
              {frequency ? (
                <AiOutlineCheckSquare
                  className={styles.add}
                  onClick={() => setFrequency(false)}
                />
              ) : (
                <AiOutlineBorder
                  className={styles.add}
                  onClick={() => setFrequency(true)}
                />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AiOutlinePlusSquare
                className={styles.add}
                onClick={handleCodeSubmit(onCodeSubmit)}
              />
            </div>
          </div>
        </div>
        <div className={styles.tags}>
          {codes.map((code) => renderCode(code))}
        </div>
        <div style={{ flex: 1, marginTop: '1%' }}>
          <p style={{ color: '#FE5F55' }}>{error}</p>
        </div>
        <div className={styles.buttonsContainer}>
          <LinkButton
            label="Set Library"
            link="/setlibrary"
            state={{ sessionFile: sessionFile }}
            disabled={false}
          />
          <LinkButton
            label="Create Set"
            onClick={handleSubmit(onSetSubmit)}
            state={{ sessionFile: sessionFile }}
            disabled={!isValid || codes.length < 1}
          />
        </div>
      </div>
    </div>
  );
};

export default NewSetScreen;
