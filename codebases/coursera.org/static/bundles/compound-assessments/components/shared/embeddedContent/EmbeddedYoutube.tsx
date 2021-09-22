import React from 'react';
import initBem from 'js/lib/bem';
import { EmbeddedContentProps } from './EmbeddedContent';

import 'css!./__styles__/EmbeddedYoutube';

const bem = initBem('EmbeddedYoutube');

const minRegexMatchLength = 7;
const getVideoIdFromUrl = (url: string) => {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

  const match = url.match(regex);

  return match?.[minRegexMatchLength];
};

const videoIdLength = 11;
const matchesUrl = (url: string) => {
  const id = getVideoIdFromUrl(url);
  return id && id.length === videoIdLength;
};

const baseUrl = '//www.youtube.com/embed/';
export const EmbeddedYoutube: React.SFC<EmbeddedContentProps> = ({ url, title }: EmbeddedContentProps) => {
  const iframeUrl = baseUrl + getVideoIdFromUrl(url);
  return (
    <div className={bem()}>
      <iframe title={title} src={iframeUrl} frameBorder="0" allowFullScreen={true} />
    </div>
  );
};

export const isEmbeddedYoutube = (url: string) => {
  if (matchesUrl(url)) {
    return true;
  }

  return false;
};

export default EmbeddedYoutube;
