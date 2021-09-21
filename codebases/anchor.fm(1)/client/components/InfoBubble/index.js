import React from 'react';
import styles from './styles.sass';

// Infobubble a square 'tail' rotated 45deg to simulate "speech bubble"
// default style (positionAgainstParent) absolutely positions itself to the side (direction) of its parent component
// Radius needs to be set via classname
const InfoBubble = ({
  direction = 'bottom',
  positionAgainstParent = true,
  backgroundColor = '#292f36',
  color = 'white',
  children,
  width = 180,
  show = true,
  className = '',
  ...props
}) =>
  show ? (
    <div
      className={`${styles.container} ${
        positionAgainstParent ? styles.absolute : styles.relative
      } ${styles[direction]} ${className}`}
      style={{
        marginTop: 6,
        width: `${width}px`,
        color,
        backgroundColor,
        padding: 15,
      }}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children, { ...props })
        : children}
    </div>
  ) : null;

export default InfoBubble;
