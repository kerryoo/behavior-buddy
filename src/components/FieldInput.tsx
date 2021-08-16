import React from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import styles from './FieldInput.module.css';

interface Props {
  control: Control<FieldValues>;
  name: string;
  defaultValue?: string;
  rules: any;
  style?: string;
  extraOnChange?: any;
}

const FieldInput = ({
  control,
  name,
  defaultValue,
  rules,
  extraOnChange,
}: Props) => {
  return (
    <div className={styles.container}>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            className={styles.input}
            onBlur={onBlur}
            onChange={
              (e) => {
              onChange(e.target.value);
              extraOnChange && extraOnChange(e.target.value);
            }}
            value={value}
            defaultValue={defaultValue}
          />
        )}
        name={name}
      />
    </div>
  );
};

export default FieldInput;
