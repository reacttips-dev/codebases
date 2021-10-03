import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import {
  StyledVideoContainer,
  StyledRndContainer,
  StyledVideoTrimmingModalBody,
  StyledVideoSeekBar,
  StyledDurationContainer,
} from "../styled/styles";
import TldrGrabber from "./TldrGrabber";
import ReactPlayer from "react-player";
import { Duration, TldrAnimationPlaybackAction } from "./statelessView";
import { StyledVideoProgressRow } from "../styled/details/stylesDetails";

class TldrMediaTrimmingModal extends Component {
  constructor(props) {
    super(props);

    const defaultPercentage = props.defaultTrimPercentage ?? 35;

    this.state = {
      seeking: false,
      played: 0,
      playing: false,
      duration: 0,
      muted: true,
      width: `${defaultPercentage}%`,
      numWidth: defaultPercentage,
      x: 0,
    };
  }

  render() {
    const {
      show,
      onHide,
      data,
      mediaType,
      layerstore,
      editor,
      maxTrimPercentage,
    } = this.props;
    const { played, playing, duration, muted, x, width } = this.state;
    const target = layerstore.layers[editor.activeElement.id];
    const mediaSrc = data ? data?.payload?.src : target?.payload?.src || "";
    const meta = data ? data?.content?.meta : target?.content?.meta;

    return (
      <Modal
        show={show}
        onHide={onHide}
        centered
        backdrop="static"
        contentClassName={"video-trim-modal-content"}
        backdropClassName={"video-trim-modal-backdrop"}
      >
        <Modal.Header>
          <Modal.Title>Trim {mediaType}</Modal.Title>
        </Modal.Header>

        <hr className="modal-hr" />

        <StyledVideoTrimmingModalBody>
          <StyledVideoContainer>
            <ReactPlayer
              url={mediaSrc}
              ref={(player) => {
                this.player = player;
              }}
              playing={playing}
              loop={false}
              muted={muted}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
            />
            <StyledDurationContainer className="mt-1">
              <Duration
                type="video_duration"
                seconds={duration * (played / 100)}
              />
              <Duration type="video_duration" seconds={meta?.duration || 0} />
            </StyledDurationContainer>
          </StyledVideoContainer>

          <StyledVideoProgressRow>
            <div className="actions">
              <TldrAnimationPlaybackAction
                action={playing ? "pause" : "play"}
                icon={playing ? "pause" : "play"}
                title={playing ? "Pause" : "Play"}
                callback={this.handlePlayPause}
              />
            </div>

            <StyledVideoSeekBar
              type="range"
              min={0}
              max={100}
              step="any"
              value={played}
            />

            <StyledRndContainer id="rnd-container">
              <TldrGrabber
                parentId={"#rnd-container"}
                size={{ height: 45, width: width }}
                position={{ x: x, y: 0 }}
                defaults={{ x: x, y: 0, height: 45, width: width }}
                onDragStop={(e, d) => this.onDragStop(e, d)}
                onResizeStop={(e, direction, ref, delta, position) =>
                  this.onResizeStop(e, direction, ref, delta, position)
                }
                leftTooltipText={duration * (this.calculateGrabberX() / 100)}
                rightTooltipText={
                  (meta?.duration || 0) *
                  ((this.calculateGrabberX() + this.state.numWidth) / 100)
                }
                maxWidth={maxTrimPercentage ? `${maxTrimPercentage}%` : "100%"}
                rndProps={{ size: { height: 45, width: width } }}
              />
            </StyledRndContainer>

            <div className="actions">
              <TldrAnimationPlaybackAction
                action={muted ? "volume-mute" : "volume-up"}
                icon={muted ? "volume-mute" : "volume-up"}
                title={muted ? "Unmute" : "Mute"}
                callback={this.handleToggleMuted}
              />
            </div>
          </StyledVideoProgressRow>

          <div>
            <Duration
              type="user_selected"
              seconds={duration * (this.state.numWidth / 100)}
            />{" "}
            selected
          </div>
        </StyledVideoTrimmingModalBody>

        <hr className="modal-hr" />

        <Modal.Footer>
          <Button
            variant="outline-warning"
            onClick={(e) => {
              e.stopPropagation();
              onHide();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={(e) => {
              e.stopPropagation();
              this.setStartAndEndTime();
            }}
          >
            Trim
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  setStartAndEndTime = () => {
    const { layerstore, editor, data, onSubmit } = this.props;
    const { duration, numWidth } = this.state;
    const target = layerstore.layers[editor.activeElement.id];
    const meta = data ? data.content.meta : target.content.meta;

    var startTime = this.formatTime(
      duration * (this.calculateGrabberX() / 100)
    );
    var endTime = this.formatTime(
      (meta?.duration || 0) * ((this.calculateGrabberX() + numWidth) / 100)
    );

    onSubmit(startTime, endTime);
  };

  formatTime = (time) => {
    const date = new Date(time * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds();

    if (hh) {
      return hh * 60 + mm * 60 + ss;
    } else if (mm) {
      return mm * 60 + ss;
    }
    return ss;
  };

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleDuration = (duration) => {
    this.setState({ duration });
  };

  handleProgress = (state) => {
    if (!this.state.seeking) {
      this.setState({
        ...state,
        played: (state.played * 100).toFixed(2),
      });
    }

    const calculatedX = this.calculateGrabberX();
    if (this.state.played >= calculatedX + this.state.numWidth) {
      this.handlePause();
    }
  };

  handlePause = () => {
    this.setState({ playing: false });

    const calculatedX = this.calculateGrabberX();
    this.player.seekTo((calculatedX + this.state.numWidth) / 100);
  };

  onDragStop = (e, d) => {
    this.setState({ x: d.x });

    this.seekToPositionX();
  };

  onResizeStop = (e, direction, ref, delta, position) => {
    var formattedWidth;
    this.setState(
      {
        width: ref.style.width,
        x: position.x,
      },
      () => {
        formattedWidth = this.state.width.replace("%", "");
      }
    );

    this.setState({
      numWidth: parseInt(formattedWidth),
    });

    this.seekToPositionX();
  };

  seekToPositionX = () => {
    const calculatedX = this.calculateGrabberX();
    this.player.seekTo(calculatedX / 100);
  };

  calculateGrabberX = () => {
    const totalX = 524;
    var calculatedX = ((this.state.x / totalX) * 100).toFixed(2);

    return parseFloat(calculatedX);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.defaultTrimPercentage &&
      this.props.defaultTrimPercentage !== prevProps.defaultTrimPercentage
    ) {
      this.setState({
        width: `${this.props.defaultTrimPercentage}%`,
        numWidth: this.props.defaultTrimPercentage,
      });
    }
  }
}

TldrMediaTrimmingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
  maxTrimPercentage: PropTypes.number,
  defaultTrimPercentage: PropTypes.number,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrMediaTrimmingModal);
