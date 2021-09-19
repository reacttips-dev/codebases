import { Component } from 'react';
import ReactPlayer from 'react-player/lib/players/YouTube';
import { connect } from 'react-redux';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { DESKTOP_PDP_VIDEO } from 'constants/appConstants';
import { trackEvent } from 'helpers/analytics';
import { evVideoClick, evVideoImpression } from 'events/symphony';
import { track } from 'apis/amethyst';
import { onEvent } from 'helpers/EventHelpers';
import MelodyVideoPlaceholder from 'components/common/melodyVideo/MelodyVideoPlaceholder';
import { getScreenSize } from 'helpers/HtmlHelpers';

import css from 'styles/components/landing/melodyVideo/melodyVideo.scss';

const DEBOUNCE_THRESHOLD = 250;

export class MelodyVideoPlayer extends Component {
  state = {
    isPlaying: false,
    intervals: [],
    source: ''
  };

  componentDidMount() {
    const { slotDetails, slotName, slotIndex } = this.props;
    const { componentName, autoplay } = slotDetails;

    this.buildResponsiveVideo();

    onEvent(window, 'resize', this.handleResize, null, this);

    if (componentName === DESKTOP_PDP_VIDEO || autoplay) {
      this.setIsPlaying(true);
    }

    track(() => ([evVideoImpression, { slotDetails, slotName, slotIndex }]));
  }

  // Since <source> tags don't work with videos, manually set the video source based on screen breakpoints
  // This won't be responsive in a sense that adjusting screen sizes manually will change the video dynamically,
  // But at least we can load the proper content for screens at the beginning using melody breakpoints
  buildResponsiveVideo = () => {
    const { slotDetails: { mobileVideoSrc, tabletVideoSrc, src } } = this.props;
    const screen = getScreenSize();
    if (mobileVideoSrc && screen === 'mobile') {
      this.setState({ source: mobileVideoSrc });
    } else if (tabletVideoSrc && screen === 'tablet') {
      this.setState({ source: tabletVideoSrc });
    } else {
      this.setState({ source: src });
    }
  };

  handleResize = debounce(this.buildResponsiveVideo, DEBOUNCE_THRESHOLD);

  onVideoEnded = () => {
    this.sendVideoAnalytics('ENDED');
    this.setState({ ended: true, isPlaying: false, lastPlayedTime: undefined, intervals: [] });
  };

  onVideoPause = () => {
    if (this.state.isPlaying) {
      this.setIsPlaying(false);
      this.sendVideoAnalytics('PAUSED');
      this.setState({ intervals: [] }); // clear intervals array in case user scrolls to previous time
      track(() => ([evVideoClick, { ...this.props, interactionType: 'PAUSE' }]));
    }
  };

  onVideoPlay = () => {
    const { isPlaying } = this.state;
    const el = this.melodyVideoElement;
    const yt = this.youTubeVideoElement;

    if (!isPlaying) {
      this.setIsPlaying(true);
      track(() => ([evVideoClick, { ...this.props, interactionType: 'PLAY' }]));
    }

    if (el) {
      el.controls = true;
      this.trackVideoPlay(el.currentTime, el.duration);
    } else if (yt) {
      this.trackVideoPlay(yt.getCurrentTime(), yt.getDuration());
    }
  };

  handlePlayerClick = e => {
    e.preventDefault(); // Stop browser's native pause/play functionality
    const el = this.melodyVideoElement;
    const { isPlaying } = this.state;

    if (el) {
      el.muted = false; // unmute if autoplayed initially

      if (isPlaying) {
        el.pause();
      } else {
        el.play();
      }
    }
  };

  onVideoTimeUpdate = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      const el = this.melodyVideoElement;
      const yt = this.youTubeVideoElement;

      if (el) {
        this.trackCurrentTime(el.currentTime);
      } else if (yt) {
        this.trackCurrentTime(yt.getCurrentTime());
      }
    }
  };

  setIsPlaying = isPlaying => {
    this.setState({ isPlaying });
  };

  makeTextHeading(heading) {
    return heading && <h2>{heading}</h2>;
  }

  sendVideoAnalytics = (action, currentTime) => {
    const { slotDetails: { heading, productId } } = this.props;

    if (productId) {
      trackEvent(`TE_PRODUCTVIDEO_${action}`, `${productId}${currentTime ? `:${currentTime}` : ''}`);
    } else {
      trackEvent(`TE_MELODYVIDEO_${action}`, `${heading}${currentTime ? `:${currentTime}` : ''}`);
    }

    this.setState({ lastEventName: action });
  };

  trackCurrentTime = currentRawTime => {
    const { intervals, lastPlayedTime } = this.state;
    const currentTime = Math.floor(currentRawTime);

    // assume a difference greater than 1 between currentTime and lastPlayedTime happened because of the user seeking
    if (Math.abs(currentTime - lastPlayedTime) > 1) {
      this.sendVideoAnalytics('SOUGHT', `${lastPlayedTime}:${currentTime}`);
      track(() => ([evVideoClick, { ...this.props, interactionType: 'SEEKED' }]));
    }

    // send analytics of video playtime periodically every 5 seconds (but not for the first "play")
    if (currentTime && (currentTime % 5 === 0) && !intervals.includes(currentTime)) {
      this.setState({ intervals: intervals.concat([currentTime]), lastPlayedTime: currentTime });
      this.sendVideoAnalytics('TIMEUPDATED', currentTime);
    } else {
      this.setState({ lastPlayedTime: currentTime });
    }
  };

  trackVideoPlay = (currentTime, duration) => {
    // if current time is 0 and we've ended, then this is a replay
    // depending on browser and clicking on control vs on video currentTime will either be 0 or the end if replaying
    const { ended, lastEventName } = this.state;
    const eventName = ended && (Math.floor(currentTime) === 0 || currentTime === duration) ? 'REPLAYED' : 'PLAYED';

    // YouTube (or react-player) issue where onPlay fires twice on a replay
    if (lastEventName !== 'REPLAYED') {
      this.sendVideoAnalytics(eventName);
    }
  };

  render() {
    const { isPlaying, source } = this.state;
    const {
      slotName,
      slotDetails: { className, poster, heading, alt, isEmbedded, embeddedRatio, componentName, autoplay, monetateId, type, loop = false, tracks = [] },
      heightValue,
      isYouTubeVideo,
      widthValue,
      showPlaceholder
    } = this.props;

    const isDesktopPdp = componentName === DESKTOP_PDP_VIDEO;
    // autoplay video if desktop PDP or set by SiteMerch
    const isAutoPlay = isDesktopPdp || autoplay;
    const posterImage = poster || '';
    const config = {
      file: {
        attributes: {
          poster: posterImage,
          preload: 'none'
        }
      },
      youtube: {
        playerVars: {
          cc_load_policy: 1,
          cc_lang_pref: 'en'
        }
      }
    };

    const containerClass = cn(css.melodyVideo,
      { [css.landingPageVideo] : componentName === 'melodyVideoPlayer' },
      { [css.fullwidth] : type === 'fullwidth' },
      className
    );
    if (ReactPlayer.canPlay(source) && isYouTubeVideo) {
      return (
        <div
          className={containerClass}
          data-slot-id={slotName}
          data-monetate-id={monetateId}
        >
          {this.makeTextHeading(heading)}
          <MelodyVideoPlaceholder showPlaceholder={showPlaceholder} widthValue={widthValue} heightValue={heightValue}>
            <ReactPlayer
              url={source}
              playing={!!isAutoPlay}
              onPlay={this.onVideoPlay}
              onPause={this.onVideoPause}
              onEnded={this.onVideoEnded}
              onProgress={this.onVideoTimeUpdate}
              playsinline={true}
              controls={true}
              width={widthValue}
              height={heightValue}
              config={config}
              loop={loop}
              ref={el => this.youTubeVideoElement = el} />
          </MelodyVideoPlaceholder>
        </div>
      );
    } else if (!isEmbedded) { // normal melodyVideo component
      return (
        <div className={containerClass} data-slot-id={slotName}>
          {this.makeTextHeading(heading)}
          <video
            onClick={this.handlePlayerClick}
            ref={el => this.melodyVideoElement = el}
            src={source}
            poster={posterImage}
            autoPlay={!!isAutoPlay}
            preload={isAutoPlay ? 'auto' : 'metadata'}
            muted={isAutoPlay && !isDesktopPdp} // do not mute pdp autoplay videos
            height={heightValue}
            controls={false}
            playsInline={true}
            onPlay={this.onVideoPlay}
            onPause={this.onVideoPause}
            onEnded={this.onVideoEnded}
            loop={loop}
            crossOrigin="anonymous"
            onTimeUpdate={this.onVideoTimeUpdate}>
            {tracks.map(({ src, label, kind, srclang = 'en', default: defaultVal }) => (
              <track
                key={src}
                src={src}
                kind={kind}
                label={label}
                srcLang={srclang}
                default={defaultVal}
              />
            ))}
          </video>
          <button type="button" onClick={this.handlePlayerClick} className={cn(css.play, { [css.playHidden]: isPlaying })}>
            Play Video
          </button>
        </div>
      );
    } else { // otherwise, try and render as an iframe
      const style = {};

      if (embeddedRatio) {
        // TODO: curently `embeddedRatio` is a percentage (e.g. 56.25%); moving forward should be a decimal (e.g. .5625), so we can (hopefully) eventually remove the ternary
        style.paddingBottom = embeddedRatio.endsWith('%') ? embeddedRatio : `calc(${embeddedRatio} * 100%)`;
      }

      return (
        <div
          className={cn(css.iframeVideo, className)}
          data-slot-id={slotName}
          style={style}
        >
          {this.makeTextHeading(heading)}
          <iframe
            src={source}
            title={heading ? `${heading} video` : (alt ? alt : 'Video Content')}
            allowFullScreen></iframe>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  product: state.product
});

MelodyVideoPlayer.defaultProps = {
  isYouTubeVideo: false,
  heightValue: 'auto',
  showPlaceholder: false
};

MelodyVideoPlayer.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      default: PropTypes.bool,
      kind: PropTypes.string,
      label: PropTypes.string,
      src: PropTypes.string,
      srclang: PropTypes.string
    }))
};

const ConnectedMelodyVideoPlayer = connect(mapStateToProps, {
})(MelodyVideoPlayer);

export default withErrorBoundary('ConnectedMelodyVideoPlayer', ConnectedMelodyVideoPlayer);
