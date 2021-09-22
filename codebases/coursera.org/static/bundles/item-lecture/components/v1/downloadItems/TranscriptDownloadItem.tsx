import React from 'react';
import { Box } from '@coursera/coursera-ui';

import DownloadItemLink from 'bundles/item-lecture/components/v1/downloadItems/DownloadItemLink';

import VideoContent from 'bundles/video-player/models/VideoContent';

import _t from 'i18n!nls/item-lecture';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

type Props = {
  videoContent: VideoContent;
  languageCode: string;
};

const TranscriptDownloadItem = ({ videoContent, languageCode }: Props) => {
  /**
   * The language for the WebVTT file will be determined in this order of precedence:
   *   1. The selected language if subtitles are turned on for this video
   *   2. The user's language account setting, if subtitles exist for that language
   *   3. English
   */
  const subtitleSource = videoContent.getSubtitlesUrl('subtitlesTxt', languageCode);
  const subtitleLabel = videoContent.getSubtitlesLabel('subtitlesTxt', languageCode);

  if (!subtitleSource) {
    return null;
  }

  return (
    <DownloadItemLink
      href={subtitleSource}
      download="transcript.txt"
      trackingName="download_subtitle"
      data={{
        languageCode,
        format: 'txt',
      }}
      title={_t('Download Transcript')}
    >
      <Box alignItems="center">
        <span style={{ marginRight: '8px' }}>
          <FormattedMessage message={_t('Transcript ({subtitleLanguage})')} subtitleLanguage={subtitleLabel} />
        </span>

        <span className="caption-text color-secondary-dark-text">{_t('txt')}</span>
      </Box>
    </DownloadItemLink>
  );
};

export default TranscriptDownloadItem;
