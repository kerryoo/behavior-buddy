import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { SetType } from '../constants/userDefinedTypes';
import styles from './SetCard.module.css';

interface Props {
  setProps: SetType;
  selected: boolean;
  onPress: () => void;
  onRemovePress: () => void;
  onEdit: () => void;
}

const SetCard = ({ setProps, selected, onPress, onRemovePress, onEdit }: Props) => {
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
      <div className={styles.property}>
        <h3>{name}</h3>
        <p style={{ textAlign: 'left', margin: 0 }}>Interval: {interval}</p>
        <p style={{ textAlign: 'left', margin: 0 }}>Codes: {renderCodes()}</p>
        <p style={{ textAlign: 'left', margin: 0 }}>
          Description: {description}
        </p>
      </div>

      <div className={styles.icons}>
        <AiOutlineClose
          className={styles.icon}
          onClick={(e) => {
            removeSet(e);
            onRemovePress();
          }}
        />
        <AiOutlineEdit
          className={styles.icon}
          onClick={() => {
            onEdit();
          }}
        />
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
