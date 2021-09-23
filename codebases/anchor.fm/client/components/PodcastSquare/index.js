import React, { Component } from 'react';
import SquareImage from '../SquareImage';
import styles from './styles.sass';

// TODO: title and subtitle sizes responsive to page
const PodcastSquare = ({
  containerClass,
  borderRadius = 4,
  image,
  imageFull,
  title,
  description,
  size = '100%',
  titleSize = '42px',
  subtitleSize = '16px',
  altText,
}) => (
  <SquareImage
    containerClass={`${styles.container} ${containerClass}`}
    borderRadius={borderRadius}
    responsive
    size={size}
    src={image}
    srcSet={makeSrcSet(image, imageFull)}
    altText={altText}
  />
);
// TODO (bui): clean up podcast square and instances of the component
/*
    <h2 className={styles.podcastTitle} style={{ fontSize: titleSize }}>
      {title}
      {description && (
        <span style={{ fontSize: subtitleSize }}>
          {description}
        </span>
      )}
    </h2>
  </SquareImage>
);
*/
export default PodcastSquare;

function makeSrcSet(image, imageFull) {
  if (!imageFull) {
    return null;
  }
  return `${image} 1x, ${imageFull} 2x`;
}
