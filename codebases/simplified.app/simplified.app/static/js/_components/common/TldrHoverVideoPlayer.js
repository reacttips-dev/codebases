import React, { Component } from "react";
import HoverVideoPlayer from "react-hover-video-player";
import PropTypes from "prop-types";

class TldrHoverVideoPlayer extends Component {
  render() {
    const { videoSrc, pausedOverlay } = this.props;
    return (
      <div>
        <HoverVideoPlayer
          videoSrc={videoSrc}
          restartOnPaused
          pausedOverlay={pausedOverlay}
        />
      </div>
    );
  }
}

TldrHoverVideoPlayer.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  pausedOverlay: PropTypes.any | null,
  restartOnPaused: PropTypes.bool,
};

TldrHoverVideoPlayer.defaultProps = {
  pausedOverlay: null,
  restartOnPaused: true,
};

export default TldrHoverVideoPlayer;
