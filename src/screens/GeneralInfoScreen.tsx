import React, { useState, useEffect } from 'react';
import styles from './GeneralInfoScreen.module.css';
import FieldInput from '../components/FieldInput';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useHistory } from 'react-router';
import { GeneralInfo, SessionFile } from '../constants/userDefinedTypes';
import ErrorScreen from './ErrorScreen';
import LinkButton from '../components/LinkButton';

const GeneralInfoScreen = () => {
  const location = useLocation();
  const history = useHistory();
  if (!location.state) {
    return <ErrorScreen />;
  }

  const { sessionFile } = location.state;
  const { generalInfo } = sessionFile;

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      subject: generalInfo.subject,
      observer: generalInfo.observer,
      notes: generalInfo.notes,
    },
  });

  const onSubmit = (data) => {
    history.push({
      pathname: '/setlibrary',
      state: {
        sessionFile: {
          generalInfo: {
            subject: data.subject,
            observer: data.observer,
            notes: data.notes,
          },
          set: sessionFile.set,
          data: sessionFile.data,
          videoPath: sessionFile.videoPath,
        },
      },
    });
  };

  return (
    <div className="background">
      <div className={styles.container}>
        <div className="headerTextBox">
          <h1>Enter session information</h1>
        </div>
        <div className={styles.fieldsContainer}>
          <div className={styles.field}>
            <h4>&nbsp;SUBJECT IDENTIFIER</h4>
            <FieldInput
              control={control}
              name="subject"
              rules={{ required: true }}
              defaultValue={generalInfo.subject}
            />
          </div>
          <div className={styles.field}>
            <h4>&nbsp;OBSERVER/CODER</h4>
            <FieldInput
              control={control}
              name="observer"
              rules={{ required: true }}
              defaultValue={generalInfo.observer}
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
                    onBlur={onBlur}
                    onChange={(value) => {
                      onChange(value);
                    }}
                    value={value}
                    defaultValue={generalInfo.notes}
                  />
                )}
                name="notes"
              />
            </div>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <LinkButton label="Go Home" link="/" disabled={false} />
          <LinkButton
            label="Continue"
            link="/setlibrary"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoScreen;
