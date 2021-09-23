import React from 'react';
import styles from './styles.sass';

const AMPPageSection = ({
  id = '',
  children,
  className = '',
  color = 'white',
  forceAlign = true,
}) => (
  <div
    className={`
      ${styles.content}
      ${styles[color]}
      ${className}`}
    id={id}
  >
    <div
      className={forceAlign ? styles.alignedContent : styles.unalignedContent}
    >
      {children}
    </div>
  </div>
);

export default AMPPageSection;
