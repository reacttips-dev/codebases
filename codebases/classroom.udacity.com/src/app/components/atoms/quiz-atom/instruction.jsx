import Markdown from '@udacity/ureact-markdown';
import Player from '@udacity/ureact-player';
import PropTypes from 'prop-types';
import { i18n } from 'services/localization-service';

export default class extends React.Component {
  static displayName = 'atoms/quiz-atom/intro';

  static propTypes = {
    video: PropTypes.shape({
      youtube_id: PropTypes.string,
      china_cdn_id: PropTypes.string,
    }),
    text: PropTypes.string,
    isVisible: PropTypes.bool.isRequired,
    isWideLayout: PropTypes.bool,
    onVideoSeen: PropTypes.func,
    onEnd: PropTypes.func,
    autoPlay: PropTypes.bool,
  };

  static defaultProps = {
    video: null,
    isVisible: false,
    isWideLayout: false,
    onEnd: _.noop,
  };

  componentDidMount() {
    if (this.props.isWideLayout && !this.props.autoPlay) {
      this.player && this.player.playVideo();
    }
  }

  componentWillReceiveProps(newProps) {
    if ((!newProps.isVisible && this.props.isVisible) || !newProps.autoPlay) {
      this.player && this.player.pauseVideo();
    }

    // resume video
    if (!this.props.autoPlay && newProps.autoPlay) {
      this.player && this.player.playVideo();
    }
  }

  handleGetPlayerWrapper = (player) => {
    this.player = player;
  };

  _shouldRenderVideo = (video) => {
    return video && video.youtube_id;
  };

  render() {
    const { onEnd, onVideoSeen, video, text, isAlternativePlayer } = this.props;

    return this._shouldRenderVideo(video) ? (
      <Player
        countryCode={i18n.getCountryCode()}
        youtubeId={video.youtube_id}
        chinaCdnId={video.china_cdn_id}
        topherId={video.topher_id}
        onVideoSeen={onVideoSeen}
        onEnd={onEnd}
        onMount={this.handleGetPlayerWrapper}
        isAlternativePlayer={isAlternativePlayer}
        transcodings={video.transcodings}
      />
    ) : (
      <Markdown text={text} />
    );
  }
}
