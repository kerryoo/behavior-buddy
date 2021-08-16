import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './LinkButton.module.css';

interface Props {
  label: string;
  link?: string;
  state?: any;
  disabled: boolean;
  onClick?: any;
}

const LinkButton = ({ label, link, state, disabled, onClick }: Props) => {
  const history = useHistory();
  if (onClick) {
    return disabled ? (
      <button className={styles.disabled}>{label}</button>
    ) : (
      <button className={styles.button} onClick={onClick}>
        {label}
      </button>
    );
  } else {
    return disabled ? (
      <button className={styles.disabled}>{label}</button>
    ) : (
      <button
        className={styles.button}
        onClick={() => history.push({ pathname: link, state: state })}
      >
        {label}
      </button>
    );
  }
};

export default LinkButton;
