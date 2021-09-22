import React from 'react';
import { Box } from '@coursera/coursera-ui';
import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/VideoHighlightsPlaceholder';

import config from 'js/app/config';

const noteIcon = `${config.url.resource_assets}learner/icon_note.svg`;
const highlightIcon = `${config.url.resource_assets}learner/icon_highlight.svg`;

const VideoHighlightsPlaceholder = () => {
  return (
    <div className="rc-VideoHighlightsPlaceholder">
      <Box justifyContent="center">
        <img src={noteIcon} alt={_t('Take notes')} className="icon note-icon" />
        <img src={highlightIcon} alt={_t('Highlight')} className="icon" />
      </Box>

      <div className="help-text">
        {_t(
          'Click the “Save Note” button below the lecture when you want to capture a screen. You can also highlight and save lines from the transcript below. Add your own notes to anything you’ve captured.'
        )}
      </div>
    </div>
  );
};

export default VideoHighlightsPlaceholder;
