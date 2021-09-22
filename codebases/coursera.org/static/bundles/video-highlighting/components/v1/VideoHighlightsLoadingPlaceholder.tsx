import React from 'react';
import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/VideoHighlightsLoadingPlaceholder';

import config from 'js/app/config';

const notePlaceholder = `${config.url.resource_assets}learner/note_placeholder.svg`;

const VideoHighlightsLoadingPlaceholder = () => {
  return (
    <div className="rc-VideoHighlightsLoadingPlaceholder">
      <img src={notePlaceholder} alt={_t('Note placeholder')} />
      <img src={notePlaceholder} alt={_t('Note placeholder')} />
      <img src={notePlaceholder} alt={_t('Note placeholder')} />
    </div>
  );
};

export default VideoHighlightsLoadingPlaceholder;
