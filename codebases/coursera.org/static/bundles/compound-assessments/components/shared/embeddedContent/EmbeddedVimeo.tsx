import React from 'react';

import OembeddedContent from './OembeddedContent';
import { EmbeddedContentProps } from './EmbeddedContent';

const apiUrl = 'https://vimeo.com/api/oembed.json';

export const EmbeddedVimeo: React.FC<EmbeddedContentProps> = (props) => {
  return <OembeddedContent apiUrl={apiUrl} {...props} />;
};

export const isEmbeddedVimeo = (url: string) => {
  const regexes = [/https?:\/\/(www\.)?vimeo.com\/.*/, /https?:\/\/(www\.)?vimeo.com\/groups\/.*\/videos\/.*/];

  if (regexes.some((regex) => url.match(regex))) {
    return true;
  }

  return false;
};

export default EmbeddedVimeo;
