import type { ReactNode } from 'react';
import React from 'react';
import initBem from 'js/lib/bem';

import { isEmbeddedImage, EmbeddedImage } from './EmbeddedImage';
import { isEmbeddedYoutube, EmbeddedYoutube } from './EmbeddedYoutube';
import { isEmbeddedSoundCloud, EmbeddedSoundCloud } from './EmbeddedSoundCloud';
import { isEmbeddedVimeo, EmbeddedVimeo } from './EmbeddedVimeo';
import EmbeddedLink from './EmbeddedLink';

const bem = initBem('EmbeddedContent');

export type EmbeddedContentProps = {
  url: string;
  title: string;
};

const EmbeddedContent: React.SFC<EmbeddedContentProps> = ({ url, title }: EmbeddedContentProps) => {
  let content: ReactNode;

  if (isEmbeddedYoutube(url)) {
    content = <EmbeddedYoutube url={url} title={title} />;
  } else if (isEmbeddedSoundCloud(url)) {
    content = <EmbeddedSoundCloud url={url} title={title} />;
  } else if (isEmbeddedVimeo(url)) {
    content = <EmbeddedVimeo url={url} title={title} />;
  } else if (isEmbeddedImage(url)) {
    content = <EmbeddedImage url={url} title={title} />;
  } else {
    content = <EmbeddedLink url={url} title={title} />;
  }

  return <div className={bem()}>{content}</div>;
};

export default EmbeddedContent;
