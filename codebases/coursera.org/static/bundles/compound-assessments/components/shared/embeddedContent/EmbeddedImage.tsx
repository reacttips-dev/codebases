import React from 'react';
import initBem from 'js/lib/bem';
import type { EmbeddedContentProps } from './EmbeddedContent';

import 'css!./__styles__/EmbeddedImage';

const bem = initBem('EmbeddedImage');

export const EmbeddedImage: React.SFC<EmbeddedContentProps> = ({ url, title }: EmbeddedContentProps) => {
  return (
    <div className={bem()}>
      <img src={url} alt={title} />
    </div>
  );
};

export const isEmbeddedImage = (url: string) => {
  const regex = /\.(jpeg|jpg|jfif|pjepg|pjp|gif|png|apng|bmp|ico|cur|svg|tif|tiff|webp)$/i;

  if (url.match(regex)) {
    return true;
  }

  return false;
};

export default EmbeddedImage;
