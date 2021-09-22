import React from 'react';
import PropTypes from 'prop-types';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import VideoContent from 'bundles/video-player/models/VideoContent';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/item-lecture';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

class SubtitleDownloadItem extends React.Component {
  static propTypes = {
    videoContent: PropTypes.instanceOf(VideoContent).isRequired,
    languageCode: PropTypes.string.isRequired,
  };

  render() {
    const { languageCode, videoContent } = this.props;
    /**
     * The language for the WebVTT file will be determined in this order of precedence:
     *   1. The selected language if subtitles are turned on for this video
     *   2. The user's language account setting, if subtitles exist for that language
     *   3. English
     */
    const subtitleSource = videoContent.getSubtitlesUrl('subtitlesVtt', languageCode);
    const subtitleLabel = videoContent.getSubtitlesLabel('subtitlesVtt', languageCode);

    const vttTooltip = (
      <Tooltip>
        {_t(
          `Open this file in your video player to display subtitles.
WebVTT files are compatible with most video players.`
        )}
      </Tooltip>
    );

    return subtitleSource ? (
      <li className="rc-SubtitleDownloadItem resource-list-item">
        <TrackedA
          trackingName="download_subtitle"
          data={{
            languageCode,
            format: 'vtt',
          }}
          className="resource-link nostyle"
          href={subtitleSource}
          download="subtitles.vtt"
          title={_t('Download Subtitles')}
        >
          <div className="horizontal-box align-items-vertical-center wrap">
            <span className="resource-name body-2-text color-secondary-text">
              <FormattedMessage message={_t('Subtitles ({subtitleLanguage})')} subtitleLanguage={subtitleLabel} />
            </span>
            <OverlayTrigger placement="top" overlay={vttTooltip}>
              <span className="caption-text color-hint-text">{_t('WebVTT')}</span>
            </OverlayTrigger>
          </div>
        </TrackedA>
      </li>
    ) : null;
  }
}

class TranscriptDownloadItem extends React.Component {
  static propTypes = {
    videoContent: PropTypes.instanceOf(VideoContent).isRequired,
    languageCode: PropTypes.string.isRequired,
  };

  render() {
    const { languageCode, videoContent } = this.props;
    /**
     * The language for the WebVTT file will be determined in this order of precedence:
     *   1. The selected language if subtitles are turned on for this video
     *   2. The user's language account setting, if subtitles exist for that language
     *   3. English
     */
    const subtitleSource = videoContent.getSubtitlesUrl('subtitlesTxt', languageCode);
    const subtitleLabel = videoContent.getSubtitlesLabel('subtitlesTxt', languageCode);

    return subtitleSource ? (
      <li className="rc-TranscriptDownloadItem resource-list-item">
        <TrackedA
          className="resource-link nostyle"
          href={subtitleSource}
          download="transcript.txt"
          trackingName="download_subtitle"
          data={{
            languageCode,
            format: 'txt',
          }}
          title={_t('Download Transcript')}
        >
          <div className="horizontal-box align-items-vertical-center wrap">
            <span className="resource-name body-2-text color-secondary-text">
              <FormattedMessage message={_t('Transcript ({subtitleLanguage})')} subtitleLanguage={subtitleLabel} />
            </span>
            <span className="caption-text color-hint-text">{_t('txt')}</span>
          </div>
        </TrackedA>
      </li>
    ) : null;
  }
}

export { SubtitleDownloadItem, TranscriptDownloadItem };
