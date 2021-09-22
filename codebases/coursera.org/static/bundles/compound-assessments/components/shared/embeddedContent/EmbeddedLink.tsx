import React from 'react';
import initBem from 'js/lib/bem';
import { EmbeddedContentProps } from './EmbeddedContent';

const bem = initBem('EmbeddedLink');

export const EmbeddedLink: React.SFC<EmbeddedContentProps> = ({ url, title }: EmbeddedContentProps) => {
  return (
    <div className={bem()}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </div>
  );
};

export default EmbeddedLink;
