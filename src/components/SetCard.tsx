import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { SetType } from '../constants/userDefinedTypes';
import styles from './SetCard.module.css';

interface Props {
  setProps: SetType;
  selected: boolean;
  onPress: () => void;
  onRemovePress: () => void;
}

const SetCard = ({ setProps, selected, onPress, onRemovePress }: Props) => {
  const { name, interval, codes, description } = setProps;

  const renderCodes = () => {
    return codes
      .map((elem) => {
        return elem.name;
      })
      .join(', ');
  };

  const removeSet = (e) => {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    const sets = JSON.parse(localStorage.getItem('sets'));
    const newSets = sets.filter((obj) => obj.name !== name);
    localStorage.setItem('sets', JSON.stringify(newSets));
  };

  return (
    <div
      className={styles.container}
      style={selected ? { borderColor: '#FE5F55' } : { borderColor: 'white' }}
      onClick={onPress}
    >
      <div className={styles.nameContainer}>
        <h3>{name}</h3>
        <AiOutlineClose
          className={styles.close}
          onClick={(e) => {
            removeSet(e);
            onRemovePress();
          }}
        />
      </div>
      <div className={styles.property}>
        <p style={{ textAlign: 'left', margin: 0 }}>Interval: {interval}</p>
        <p style={{ textAlign: 'left', margin: 0 }}>Codes: {renderCodes()}</p>
        <p style={{ textAlign: 'left', margin: 0 }}>
          Description: {description}
        </p>
      </div>
    </div>
  );
};

export default SetCard;

{
  /* <div className={styles.propertyName}>
        <p>Interval:</p>
        <p>Codes:</p>
        <p>Description:</p>
      </div>
      <div className={styles.propertyValues}>
      <p>{interval}</p>
        <p>{renderCodes()}</p>
        <p>{description}</p>
      </div> */
}
