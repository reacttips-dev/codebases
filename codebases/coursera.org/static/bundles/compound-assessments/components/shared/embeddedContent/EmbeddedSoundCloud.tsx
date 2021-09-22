import React from 'react';

import OembeddedContent from './OembeddedContent';
import { EmbeddedContentProps } from './EmbeddedContent';

const apiUrl = 'https://soundcloud.com/oembed';

export const EmbeddedSoundCloud: React.FC<EmbeddedContentProps> = (props) => {
  return <OembeddedContent apiUrl={apiUrl} {...props} />;
};

export const isEmbeddedSoundCloud = (url: string) => {
  const regexes = [/https?:\/\/soundcloud.com\/.*/];

  if (regexes.some((regex) => url.match(regex))) {
    return true;
  }

  return false;
};

export default EmbeddedSoundCloud;
