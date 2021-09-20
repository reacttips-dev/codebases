import React from 'react';
import styles from './Sticker.less';

interface StickerProps {
  top: number;
  left: number;
  rotate: number;
  img: string;
  zIndex: number;
  alt?: string;
}

export const Sticker: React.FC<StickerProps> = ({
  top,
  left,
  rotate,
  img,
  zIndex = 0,
  alt = '',
}) => {
  const stickerStyle = {
    left: `${left}%`,
    top: `${top}%`,
    zIndex,
  };

  const imageStyle = {
    transform: `rotate(${rotate}deg)`,
  };

  return (
    <div className={styles.sticker} style={stickerStyle}>
      <img
        className={styles.stickerImage}
        src={img}
        alt={alt}
        style={imageStyle}
      />
    </div>
  );
};
