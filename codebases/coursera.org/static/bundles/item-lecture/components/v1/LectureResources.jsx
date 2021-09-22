import React from 'react';
import PropTypes from 'prop-types';
import Q from 'q';
import API from 'js/lib/api';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import language from 'js/lib/language';
import redirect from 'js/lib/coursera.redirect';
import { SubtitleDownloadItem, TranscriptDownloadItem } from 'bundles/item-lecture/components/v1/SubtitleDownloadItems';
import AssetDownloadItem from 'bundles/item-lecture/components/v1/AssetDownloadItem';
import LectureDownloadItem from 'bundles/item-lecture/components/v1/LectureDownloadItem';
import VolunteerLink from 'bundles/translation/components/VolunteerLink';
import { isBlacklistedInEpic } from 'pages/open-course/common/utils/experiment';
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import videoPromise from 'pages/open-course/video/promises/video';
import lectureAssetsApi from 'bundles/item-lecture/utils/lectureAssetsApi';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/item-lecture';
import 'css!./__styles__/LectureResources';

const api = API('', { type: 'rest' });

class LectureResources extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    itemMetadata: PropTypes.instanceOf(ItemMetadata).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    videoPlayer: PropTypes.object,
    shouldShowVideoDownloads: PropTypes.bool,
    hideVolunteerLink: PropTypes.bool,
  };

  static defaultProps = {
    hideVolunteerLink: false,
  };

  constructor(props, context) {
    super(props, context);

    const downloadsEnabled = !isBlacklistedInEpic(
      'siteOnDemandCompletion',
      'itemVideoDownloadBlacklist',
      props.courseId
    );

    this.state = {
      downloadsEnabled,
      videoContent: null,
      assetSources: [],
    };
  }

  componentDidMount() {
    const { itemMetadata } = this.props;
    this.getAssets();

    videoPromise({ metadata: itemMetadata })
      .then((videoContent) => {
        this.setState({ videoContent });
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    const { videoPlayer } = this.props;
    const { videoPlayer: nextVideoPlayer } = nextProps;

    if (!videoPlayer && nextVideoPlayer) {
      // We're seeing a new video player. Register event listeners.
      nextVideoPlayer.on('subtitleschange', this.onSubtitlesChange);
    } else if (!nextVideoPlayer && videoPlayer) {
      // The video player has been removed. Remove event listeners.
      nextVideoPlayer.off('subtitleschange', this.onSubtitlesChange);
    }
  }

  onSubtitlesChange = () => {
    // The video player's underlying data has changed. Re-render.
    this.forceUpdate();
  };

  getLanguageCode() {
    const { itemMetadata, videoPlayer } = this.props;
    const { videoContent } = this.state;
    const primaryLanguageCodes = itemMetadata.get('course.primaryLanguageCodes');
    let languageCode = (primaryLanguageCodes && primaryLanguageCodes[0]) || 'en';
    const currentTrack = videoPlayer && videoPlayer.currentTrack();

    if (currentTrack) {
      // The user has a subtitles track selected. Allow them to download resources for
      // that language.
      languageCode = currentTrack.language;
    } else {
      // There is no subtitles track selected. See if there are subtitles for the user's
      // account language.
      const accountLanguageCode = language.getLanguageCode();
      const hasSourceForLanguage = !!videoContent.getCaptionForLanguage(accountLanguageCode);

      if (hasSourceForLanguage) {
        languageCode = accountLanguageCode;
      }
    }

    return languageCode;
  }

  getAssets() {
    const { itemMetadata } = this.props;
    Q(lectureAssetsApi.getLectureAssets(itemMetadata.get('course').get('id'), itemMetadata.get('id'))).then(
      (lectureAssets) => {
        Q.all(
          lectureAssets.linked['openCourseAssets.v1'].map((asset) => {
            return Q(api.get('/api/openCourseAssets.v1/' + redirect.unversionUrl(asset.id)));
          })
        ).then((results) => {
          this.setState({
            assetSources: results,
          });
        });
      }
    );
  }

  render() {
    const { shouldShowVideoDownloads, itemMetadata, hideVolunteerLink } = this.props;
    const { videoContent, downloadsEnabled, assetSources } = this.state;
    if (!videoContent || !downloadsEnabled) {
      return null;
    }

    const subtitleProps = {
      videoContent,
      languageCode: this.getLanguageCode(),
    };

    if (!shouldShowVideoDownloads && assetSources.length === 0) {
      return false;
    }

    return (
      <div className="rc-LectureResources styleguide flex-1">
        <p className="resources-list-title headline-2-text">{_t('Downloads')}</p>
        <ul className="resources-list card-rich-interaction">
          {shouldShowVideoDownloads && (
            <span>
              <LectureDownloadItem videoContent={videoContent} itemMetadata={itemMetadata} />
              <SubtitleDownloadItem {...subtitleProps} />
              <TranscriptDownloadItem {...subtitleProps} />
            </span>
          )}
          {assetSources.length > 0 &&
            assetSources.map((assetSource) => (
              <AssetDownloadItem assetData={assetSource.elements[0]} type={assetSource.elements[0].typeName} />
            ))}
        </ul>

        {!hideVolunteerLink && (
          <div className="translate-container">
            <FormattedMessage
              message={_t(
                'Would you like to {helpUsTranslate} the transcript and subtitles into additional languages?'
              )}
              helpUsTranslate={
                <VolunteerLink
                  linkTrackingName="lecture_translation_link"
                  modalTrackingName="lecture_translation_modal"
                >
                  {_t('help us translate')}
                </VolunteerLink>
              }
            />
          </div>
        )}
      </div>
    );
  }
}

export default connectToStores(LectureResources, ['CourseStore'], ({ CourseStore }) => ({
  courseId: CourseStore.getCourseId(),
}));
