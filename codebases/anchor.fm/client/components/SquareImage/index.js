import React from 'react';
import styles from './styles.sass';

// if responsive flag is on, size needss to be percentage of containing div
const SquareImage = function({
  borderRadius,
  children,
  containerClass,
  onLoad,
  responsive,
  size,
  src,
  srcSet,
  altText = '',
}) {
  const imgProps = {
    onLoad,
    src,
  };
  if (srcSet) {
    imgProps.srcSet = srcSet;
  }
  return (
    <div
      className={`${
        responsive ? styles.containerResponsive : styles.containerStatic
      } ${containerClass}`}
      style={{
        height: size,
        width: size,
        minWidth: size,
        borderRadius: `${borderRadius}px`,
      }}
    >
      <img {...imgProps} alt={altText} />
      {children}
    </div>
  );
};

export default SquareImage;
