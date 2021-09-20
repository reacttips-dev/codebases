import Markdown from '@udacity/ureact-markdown';
import Player from '@udacity/ureact-player';
import PropTypes from 'prop-types';
import { i18n } from 'services/localization-service';

export default class extends React.Component {
  static displayName = 'atoms/quiz-atom/answers/answer';

  static propTypes = {
    video: PropTypes.shape({
      youtube_id: PropTypes.string,
      china_cdn_id: PropTypes.string,
    }),
    text: PropTypes.string,
    isVisible: PropTypes.bool.isRequired,
    onVideoSeen: PropTypes.func,
    onFinish: PropTypes.func,
  };

  static defaultProps = {
    video: null,
    isVisible: false,
    text: null,
    onFinish: _.noop,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.isVisible !== this.props.isVisible) {
      if (newProps.isVisible) {
        this.player && this.player.playVideo();
      }
      if (!newProps.isVisible) {
        this.player && this.player.pauseVideo();
      }
    }
  }

  handleGetPlayerWrapper = (player) => {
    this.player = player;
  };

  _shouldRenderVideo = (video) => {
    return video && video.youtube_id;
  };

  render() {
    const { text, video, isAlternativePlayer } = this.props;

    return (
      <div>
        {text ? <Markdown text={text} /> : null}
        {this._shouldRenderVideo(video) ? (
          <Player
            ref="player"
            countryCode={i18n.getCountryCode()}
            youtubeId={video.youtube_id}
            chinaCdnId={video.china_cdn_id}
            topherId={video.topher_id}
            onVideoSeen={this.props.onVideoSeen}
            onEnd={this.props.onFinish}
            onMount={this.handleGetPlayerWrapper}
            isAlternativePlayer={isAlternativePlayer}
            transcodings={video.transcodings}
          />
        ) : null}
      </div>
    );
  }
}
