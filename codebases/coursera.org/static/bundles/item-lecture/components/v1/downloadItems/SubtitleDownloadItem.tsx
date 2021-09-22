import React from 'react';
import DownloadItemLink from 'bundles/item-lecture/components/v1/downloadItems/DownloadItemLink';
import VideoContent from 'bundles/video-player/models/VideoContent';

import { LanguageCode } from 'bundles/interactive-transcript/types';

import _t from 'i18n!nls/item-lecture';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

type Props = {
  videoContent: VideoContent;
  languageCode: LanguageCode;
};

const SubtitleDownloadItem = ({ videoContent, languageCode }: Props) => {
  /**
   * The language for the WebVTT file will be determined in this order of precedence:
   *   1. The selected language if subtitles are turned on for this video
   *   2. The user's language account setting, if subtitles exist for that language
   *   3. English
   */
  const subtitleSource = videoContent.getSubtitlesUrl('subtitlesVtt', languageCode);
  const subtitleLabel = videoContent.getSubtitlesLabel('subtitlesVtt', languageCode);

  if (!subtitleSource) {
    return null;
  }

  return (
    <DownloadItemLink
      trackingName="download_subtitle"
      data={{
        languageCode,
        format: 'vtt',
      }}
      href={subtitleSource}
      title={_t('Download Subtitles')}
      download={`subtitles-${languageCode}.vtt`}
    >
      <span style={{ marginRight: '8px' }}>
        <FormattedMessage message={_t('Subtitles ({subtitleLanguage})')} subtitleLanguage={subtitleLabel} />
      </span>

      <span className="caption-text color-secondary-dark-text">{_t('WebVTT')}</span>
    </DownloadItemLink>
  );
};

export default SubtitleDownloadItem;
