import React from 'react';

// withRetina assumes another asset with format <src url>@2x.png
const Img = ({
  src,
  height,
  width,
  alt,
  layout = '',
  withRetina = false, // can also just pass srcSet
  ...props
}) => (
  <img
    src={src}
    srcSet={withRetina ? `${src} 1x, ${src.slice(0, -4)}@2x.png 2x` : undefined}
    alt={alt}
    height={layout === 'responsive' ? '100%' : height}
    width={layout === 'responsive' ? '100%' : width}
    {...props}
  />
);

export default Img;
