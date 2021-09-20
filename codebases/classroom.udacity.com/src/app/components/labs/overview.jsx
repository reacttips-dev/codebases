import { TabKeys, getLabTabPath } from './_lab-tabs';
import { __, i18n } from 'services/localization-service';

import ButtonLink from 'components/common/button-link';
import ClassroomPropTypes from 'components/prop-types';
import Markdown from '@udacity/ureact-markdown';
import Player from '@udacity/ureact-player';
import PropTypes from 'prop-types';
import Section from './_section';
import { THEMES } from 'constants/theme';
import TextHelper from 'helpers/text-helper';
import VideoHelper from 'helpers/video-helper';
import Wrapper from './_wrapper';
import styles from './overview.scss';

@cssModule(styles)
export default class LabOverview extends React.Component {
  static displayName = 'components/labs/overview';

  static propTypes = {
    lab: ClassroomPropTypes.lab,
  };

  static contextTypes = {
    location: PropTypes.object,
  };

  render() {
    const {
      lab,
      lab: {
        estimated_session_duration: estimatedSessionDuration,
        overview: {
          title: overviewTitle,
          summary,
          key_takeaways: keyTakeaways,
        },
      },
      nanodegree,
    } = this.props;
    const video = lab.overview.video || {};
    const {
      location: { pathname: labPath },
    } = this.context;
    const isAlternativePlayer = VideoHelper.isAlternativePlayer(nanodegree);

    return (
      <Wrapper selectedTabId={TabKeys.OVERVIEW} lab={lab}>
        {video.youtube_id ? (
          <div styleName="video-section">
            <Player
              countryCode={i18n.getCountryCode()}
              overlay={<div className={styles.video_overlay} />}
              youtubeId={video.youtube_id}
              chinaCdnId={video.china_cdn_id}
              transcodings={video.transcodings}
              isAlternativePlayer={isAlternativePlayer}
            />
          </div>
        ) : null}

        <div styleName={video.youtube_id ? 'container' : 'container-no-border'}>
          <div styleName="overview">
            <h1 styleName="title">{overviewTitle}</h1>
            <Section theme={THEMES.DARK} title={__('Task')}>
              <Markdown text={summary} />
            </Section>
            <Section theme={THEMES.DARK} title={__('Key Takeaways')}>
              <ul styleName="key-takeaways">
                {_.map(keyTakeaways, (takeaway, index) => (
                  <li key={index}>{takeaway}</li>
                ))}
              </ul>
            </Section>
          </div>
          <div styleName="duration-partner-section">
            <ButtonLink
              label={__('Instructions')}
              variant="primary"
              to={getLabTabPath(labPath, TabKeys.INSTRUCTIONS)}
            />
            {estimatedSessionDuration ? (
              <div styleName="duration">
                <h2>Duration</h2>
                <h1>{TextHelper.formatDuration(estimatedSessionDuration)}</h1>
              </div>
            ) : null}
          </div>
        </div>
      </Wrapper>
    );
  }
}
