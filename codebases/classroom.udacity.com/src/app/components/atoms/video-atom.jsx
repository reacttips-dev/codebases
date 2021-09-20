import AnalyticsMixin from 'mixins/analytics-mixin';
import ClassroomPropTypes from 'components/prop-types';
import PropTypes from 'prop-types';
import { UreactVideoAtom } from '@udacity/ureact-atoms';
import VideoHelper from 'helpers/video-helper';
import createReactClass from 'create-react-class';
import { findDOMNode } from 'react-dom';
import { i18n } from 'services/localization-service';
import styles from './video-atom.scss';
import withAppLayoutContext from 'decorators/with-app-layout-context';
import withFeedbackContext from 'components/content-feedback/with-feedback-context';

const FIXED_HEADER_HEIGHT = 70;
const MIN_VIEWPORT_HEIGHT = 400;

export const VideoAtom = createReactClass({
  displayName: 'atoms/video-atom',

  propTypes: {
    atom: ClassroomPropTypes.videoAtom.isRequired,
    nodeKey: PropTypes.string.isRequired,
    isWideLayout: PropTypes.bool,
    onFinish: PropTypes.func,
    overlayPresent: PropTypes.bool,

    /* appLayoutContext */
    isSidebarOpen: PropTypes.bool,

    /* withFeedbackContext */
    isSelectingContent: PropTypes.bool,
  },

  contextTypes: {
    root: PropTypes.object,
  },

  mixins: [AnalyticsMixin],

  getDefaultProps() {
    return {
      isWideLayout: false,
      overlayPresent: false,
      onFinish: _.noop,
    };
  },

  componentDidMount() {
    if (this.props.isWideLayout) {
      this._fitToViewportHeight();

      this.resizeHandler = _.debounce(this._fitToViewportHeight, 100);
      window.addEventListener('resize', this.resizeHandler);
    }
  },

  componentDidUpdate(prevProps) {
    if (prevProps.isSidebarOpen !== this.props.isSidebarOpen) {
      _.delay(this._fitToViewportHeight, 350); // wait for CSS animation to finish, which is currently 0.3s
    }
  },

  componentWillUnmount() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  },

  /* Ensure the video's height fits within the viewport */
  _fitToViewportHeight() {
    var video = findDOMNode(this.refs['video']);
    if (this.props.isWideLayout) {
      var viewportHeight = document.documentElement.clientHeight;
      var { height } = video.getBoundingClientRect();
      var maxHeight = Math.max(
        viewportHeight - FIXED_HEADER_HEIGHT,
        MIN_VIEWPORT_HEIGHT
      );

      var videoWidth =
        height > maxHeight ? (maxHeight * 16) / 9 + 'px' : '100%';
      video.style.width = videoWidth;
    } else {
      video.style.width = '100%';
    }
  },

  handleVideoSeen(trackingProps) {
    const { nodeKey } = this.props;
    this.trackVideoSeen({
      ...trackingProps,
      atomKey: nodeKey,
    });
  },

  render() {
    const {
      isWideLayout,
      overlayPresent,
      onFinish,
      atom: { video },
      isSelectingContent,
    } = this.props;
    const { nanodegree } = this.context;
    const isPlaying = isWideLayout && !overlayPresent;
    const isAlternativePlayer = VideoHelper.isAlternativePlayer(nanodegree);

    return (
      <div className={styles[isWideLayout ? 'container-wide' : '']}>
        <div ref="video" className={styles['video']}>
          <UreactVideoAtom
            youtubeId={video.youtube_id}
            chinaCdnId={video.china_cdn_id}
            topherId={video.topher_id}
            onEnd={onFinish}
            onVideoSeen={this.handleVideoSeen}
            isPlaying={!isSelectingContent && isPlaying}
            isAlternativePlayer={isAlternativePlayer}
            transcodings={video.transcodings}
            countryCode={i18n.getCountryCode()}
          />
        </div>
      </div>
    );
  },
});

export default withFeedbackContext(
  withAppLayoutContext(cssModule(VideoAtom, styles))
);
