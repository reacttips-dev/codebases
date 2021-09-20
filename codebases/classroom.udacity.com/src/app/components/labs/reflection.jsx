import { IconInfo, IconLocked } from '@udacity/veritas-icons';
import { __, i18n } from 'services/localization-service';

import ClassroomPropTypes from 'components/prop-types';
import LabConfidenceRating from './_lab-confidence-rating';
import LabHelper from 'helpers/lab-helper';
import Player from '@udacity/ureact-player';
import PropTypes from 'prop-types';
import Section from './_section';
import { THEMES } from 'constants/theme';
import { TabKeys } from './_lab-tabs';
import VideoHelper from 'helpers/video-helper';
import Wrapper from './_wrapper';
import styles from './reflection.scss';

@cssModule(styles)
export default class LabReflection extends React.Component {
  static displayName = 'components/labs/reflection';

  static propTypes = {
    lab: ClassroomPropTypes.lab.isRequired,
    updateLabResults: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    showCompletionModal: PropTypes.bool.isRequired,
    trackLabActivity: PropTypes.func.isRequired,
  };

  handleLabRatingChange = (activeStar) => {
    const { lab, updateLabResult, userId, trackLabActivity } = this.props;
    trackLabActivity('lab_skill_confidence_rating_after', {
      rating: activeStar,
    });

    updateLabResult({
      labId: lab.id,
      userId,
      skillConfidenceRatingAfter: activeStar,
    });
  };

  _renderLocked() {
    return (
      <div styleName="locked-container">
        <h1 styleName="title">
          <IconLocked title={__('Locked')} size="lg" /> {__('Reflection')}
        </h1>
        <div styleName="locked-section">
          <h3 styleName="subtitle">
            {__(
              'This section is currently locked until you pass the workspace.'
            )}
          </h3>
        </div>
      </div>
    );
  }

  _renderReview() {
    const {
      lab,
      lab: {
        review_video,
        result: { skill_confidence_rating_after },
      },
      nanodegree,
    } = this.props;
    const isAlternativePlayer = VideoHelper.isAlternativePlayer(nanodegree);

    return (
      <div styleName="container">
        <h1 styleName="title">{__('Reflection')}</h1>
        {!skill_confidence_rating_after ? (
          <div styleName="review-alert">
            <IconInfo title={__('Alert')} />
            <p>
              {__('Please answer the following question to complete the lab.')}
            </p>
          </div>
        ) : null}

        <hr styleName="section-break" />
        <LabConfidenceRating
          evaluationObjective={lab.evaluation_objective}
          onChange={this.handleLabRatingChange}
          theme={THEMES.DARK}
          value={skill_confidence_rating_after}
        />

        {review_video && review_video.youtube_id ? (
          <div styleName="section">
            <Section
              theme={THEMES.DARK}
              title={__(
                'See how someone in industry went about solving this lab:'
              )}
            >
              <p>
                {__(
                  'Pay attention to details and how they worked through it to gain some new insights and techniques.'
                )}
              </p>
            </Section>

            <Player
              countryCode={i18n.getCountryCode()}
              overlay={<div className={styles.video_overlay} />}
              youtubeId={review_video.youtube_id}
              chinaCdnId={review_video.china_cdn_id}
              isAlternativePlayer={isAlternativePlayer}
              transcodings={review_video.transcodings}
            />
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const { lab } = this.props;

    return (
      <Wrapper selectedTabId={TabKeys.REFLECTION} lab={lab}>
        {LabHelper.isPassed(lab) ? this._renderReview() : this._renderLocked()}
      </Wrapper>
    );
  }
}
