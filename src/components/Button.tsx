import React from 'react';
import styles from './Button.module.css';

interface Props {
  label: string;
  onClick?: () => void;
}

const Button = ({ label, onClick }: Props) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
