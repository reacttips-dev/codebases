import React from 'react';
import styles from './styles.sass';

const InfoButtonIcon = ({ className = '', onClick = () => {}, ariaLabel }) => (
  <button
    onClick={onClick}
    className={`${styles.infoButton} ${className}`}
    aria-label={ariaLabel}
  >
    <span aria-hidden={Boolean(ariaLabel)}>i</span>
  </button>
);

export default InfoButtonIcon;
