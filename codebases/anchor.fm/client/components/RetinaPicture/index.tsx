import React from 'react';
import { CDN_PATH } from '../MarketingPagesShared/constants';

type FallbackExtension = 'png' | 'jpg';

type Props = {
  baseUrl?: string;
  imagePath: string;
  alt: string;
  className?: string;
  fallbackExtension?: FallbackExtension;
};

function getSrcSet(
  imagePath: string,
  extension: 'webp' | FallbackExtension,
  baseUrl: string
) {
  return `${baseUrl}${imagePath}.${extension} 1x, ${baseUrl}${imagePath}@2x.${extension} 2x`;
}

export function RetinaPicture({
  baseUrl = CDN_PATH,
  imagePath,
  alt,
  className,
  fallbackExtension = 'png',
}: Props) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={getSrcSet(imagePath, 'webp', baseUrl)}
      />
      <img
        className={className}
        loading="lazy"
        alt={alt}
        srcSet={getSrcSet(imagePath, fallbackExtension, baseUrl)}
      />
    </picture>
  );
}
