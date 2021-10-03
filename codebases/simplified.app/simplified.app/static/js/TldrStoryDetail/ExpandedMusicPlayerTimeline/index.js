import React, { Component } from "react";
import { batch, connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Spinner } from "react-bootstrap";
import WaveSurfer from "wavesurfer.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import {
  faCaretDown,
  faPause,
  faPlay,
  faTimes,
  faTrash,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

import { wsUpdateStory } from "../../_actions/webSocketAction";
import {
  grey,
  lightInactive,
  primary,
  secondaryColor,
} from "../../_components/styled/variable";
import VolumeSlider from "./VolumeSlider";
import TimelineGrabber from "./TimelineGrabber";
import { PROXY_IMAGES } from "../../_actions/endpoints";
import TrimArea from "./TrimArea";
// import { Ruler } from "./Ruler";

// Extend dayjs duration plugin
dayjs.extend(duration);

const StyledExpandedMusicTimelineWrapper = styled.div`
  z-index: 50;
  background-color: ${secondaryColor};
  width: auto;
  color: white;
  margin-left: ${(props) => (props.isSliderOpen ? "360px" : "0")};

  .music-header {
    display: flex;
    padding: 10px;
    align-items: center;

    .title-info {
      flex-grow: 1;
      .title {
        color: ${lightInactive};
        flex-grow: 1;
        font-size: 16px;
        font-weight: 500;
        margin-left: 14px;
        margin-right: 8px;
      }

      .duration {
        color: ${grey};
        font-size: 14px;
        font-weight: 500;
      }
    }

    .close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      background: inherit;
      cursor: pointer;
      outline: none;
      color: ${lightInactive};
      margin-right: 20px;
      padding: 3px;
    }
  }

  .tools-container {
    display: flex;
    width: 100%;
    padding-bottom: 30px;
    margin-top: 10px;

    .play-button {
      width: 64px;
      display: flex;
      align-items: center;
      button {
        margin: auto;
        width: 100%;
      }
    }

    .seeker-container {
      flex-grow: 1;
      /* height: 60px; */
      display: flex;
      flex-direction: column;

      .seeker-box {
        flex-grow: 1;
        height: 40px;
        background-color: #454545;
        position: relative;
        border-radius: 8px;

        .loader {
          position: absolute;
          left: 50%;
          z-index: 58;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .seeker {
          z-index: 52;
          position: absolute;
          height: 100%;
          border-right: 2px solid white;

          .handler {
            position: absolute;
            transform: translate(calc(-50% + 1px), -50%);
          }
        }

        .grabber {
          z-index: 51;
        }

        .waveform {
          position: absolute;
          top: 0;
          /* background-color: white; */
          width: 100%;
          /* display: none; */
        }
      }
    }

    .right-actions {
      display: flex;
      margin-right: 20px;
    }
  }
`;

const StyledActionButton = styled.button`
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  margin: 3px 8px;
  padding: 5px;
  background: inherit;
  cursor: pointer;
  outline: none;
  color: ${(props) => (props.primary ? primary : lightInactive)};
  display: flex;
  flex-direction: column;

  :focus {
    outline: none;
  }
`;

const VolumeSliderContainer = styled.div`
  height: 140px;
  width: 40px;
  background-color: #424242;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 12px 18px 18px;
  border-radius: 8px;
`;

export class ExpandedMusicPlayerTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      currentDuration: 0,
      playbackState: "pause",
      seekDuration: 0,
      start: 0,
      end: 0,
      volume: 1,
      isWaveformLoaded: false,

      isDragging: false,
    };
    this.NUMBER_OF_MARKS = 11;
    this.audioRef = React.createRef(null);
    this.seekerBoxRef = React.createRef(null);
    this.waveform = null;
  }

  componentDidMount() {
    const {
      payload: {
        payload: { music: musicData },
      },
    } = this.props.story;
    const { pageStore: { pages, loaded } = {} } = this.props;

    this.waveform = WaveSurfer.create({
      container: "#waveform",
      height: 40,
      barWidth: 3,
      partialRender: true,
      waveColor: "#7e7e7e",
      interact: false,
    });

    this.waveform.on("ready", this.listenWaveFormFetched); // Listen to waveform ready changes

    if (this.audioRef.current) {
      const audioEl = this.audioRef.current;
      audioEl.addEventListener("loadedmetadata", this.listenToMetaData);
      audioEl.addEventListener("timeupdate", this.listenToTimeUpdate);
      audioEl.addEventListener("ended", this.listenToPlaybackEnd);
    }
    this.loadMusicInfo();
    this.loadWaveFormData();
  }

  loadMusicInfo = () => {
    const {
      payload: {
        payload: { music: musicData },
      },
    } = this.props.story;
    const { pageStore: { pages, loaded } = {} } = this.props;

    if (musicData) {
      const { start, end, volume, duration } = musicData;
      const percentVolume =
        volume !== undefined && volume !== null ? Number(volume.toFixed(1)) : 1;
      if (this.audioRef.current) {
        this.audioRef.current.volume = percentVolume;
        this.audioRef.current.currentTime = start ?? 0;
      }
      let startTime = 0;
      let endTime = 0;
      if (duration) {
        endTime = startTime + duration;
      }
      if (start) {
        startTime = start;
      }
      if (end) {
        endTime = end;
      }

      if (loaded) {
        const storyDuration = this.getDurationForPages(pages);
        if (endTime && endTime - startTime > storyDuration) {
          endTime = startTime ? startTime + storyDuration : storyDuration;
        }
      }
      this.setState({
        start: startTime,
        end: endTime,
        seekDuration: startTime,
        volume: percentVolume,
      });
    }
  };

  getDurationForPages = (pageData) => {
    let storyDuration = 0;
    Object.keys(pageData).forEach((pageId) => {
      const pageDuration = pageData[pageId]?.payload?.animation?.duration;
      storyDuration += Number(Number(pageDuration ?? 6).toFixed(1));
    });
    return storyDuration;
  };

  loadWaveFormData = () => {
    if (this.audioRef.current) {
      this.waveform.load(this.audioRef.current);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      payload: {
        payload: { music: prevMusic = null },
      },
    } = prevProps.story;
    const {
      payload: {
        payload: { music: currMusic = null },
      },
    } = this.props.story;
    const {
      pageStore: { pages: currPages },
    } = this.props;
    const {
      pageStore: { pages: previousPages },
    } = prevProps;
    if (prevMusic !== currMusic) {
      this.loadMusicInfo();
      if (prevMusic && currMusic && prevMusic.src !== currMusic.src) {
        this.loadWaveFormData();
      }
    }

    if (
      this.state.currentDuration !== prevState.currentDuration &&
      this.state.currentDuration >= this.state.end
    ) {
      const { start } = this.state;
      const audioEl = this.audioRef.current;
      if (audioEl) {
        this.setState(
          {
            currentDuration: start,
          },
          () => {
            audioEl.currentTime = start;
          }
        );
      }
    }

    if (currPages || previousPages) {
      const currDuration = this.getDurationForPages(currPages);
      const prevDuration = this.getDurationForPages(previousPages);
      if (currDuration !== prevDuration) {
        this.loadMusicInfo();
      }
    }
  }

  componentWillUnmount() {
    if (this.audioRef.current) {
      const audioEl = this.audioRef.current;
      audioEl.removeEventListener("loadedmetadata", this.listenToMetaData);
      audioEl.removeEventListener("timeupdate", this.listenToTimeUpdate);
      audioEl.removeEventListener("ended", this.listenToPlaybackEnd);
      audioEl.pause();
    }
    if (this.waveform) {
      this.waveform.unAll();
    }
  }

  listenToMetaData = () => {
    this.setState({
      totalDuration: Number(this.audioRef.current.duration.toFixed(1)),
      currentDuration: 0,
    });
  };

  listenToTimeUpdate = () => {
    const currentDuration = Number(
      this.audioRef.current.currentTime.toFixed(1)
    );
    this.setState({
      totalDuration: Number(this.audioRef.current.duration.toFixed(1)),
      currentDuration: currentDuration,
    });
  };

  listenToPlaybackEnd = () => {
    this.setState({
      totalDuration: Math.floor(this.audioRef.current.duration),
      currentDuration: 0,
      playbackState: "pause",
    });
  };

  listenWaveFormFetched = () => {
    this.setState({
      isWaveformLoaded: true,
    });
  };

  onDragStart = (e, d) => {
    this.setState({
      isDragging: true,
    });
  };

  onDrag = (e, d) => {
    const {
      payload: {
        payload: { music: musicData },
      },
    } = this.props.story;

    const startDuration = d.x
      ? Number(
          (
            (d.x / this.seekerBoxRef.current.offsetWidth) *
            musicData.duration
          ).toFixed(1)
        )
      : 0;
    this.setState({
      seekDuration: startDuration,
    });
  };

  onDragStop = (e, d) => {
    const {
      payload: {
        payload: { music: musicData },
      },
    } = this.props.story;
    const { start, end } = this.state;

    const trimDuration = end - start;

    const startDuration = d.x
      ? Number(
          (
            (d.x / this.seekerBoxRef.current.offsetWidth) *
            musicData.duration
          ).toFixed(1)
        )
      : 0;
    const endDuration = startDuration + trimDuration;
    this.setState(
      {
        start: startDuration,
        end: Number(endDuration.toFixed(1)),
        seekDuration: start,
        isDragging: false,
      },
      () => {
        this.onTrim();
        this.seekToPositionX();
      }
    );
  };

  onResizeStop = (e, direction, ref, delta, position) => {
    const {
      payload: {
        payload: { music: musicData },
      },
    } = this.props.story;
    const width = Number(ref.style.width.replace("%", ""));
    const parentWidth = this.seekerBoxRef.current.offsetWidth;

    const startDuration = position.x
      ? Number(((position.x / parentWidth) * musicData.duration).toFixed(1))
      : 0;
    const endDuration = Number(
      (startDuration + (musicData?.duration * width) / 100).toFixed(1)
    );

    this.setState(
      {
        start: startDuration,
        end: endDuration,
      },
      () => {
        this.onTrim();
        this.seekToPositionX();
      }
    );
  };

  seekToPositionX = () => {
    const { start } = this.state;
    const audioEl = this.audioRef.current;
    if (audioEl) {
      this.setState(
        {
          currentDuration: start,
        },
        () => {
          audioEl.currentTime = start;
        }
      );
    }
  };

  togglePlaybackState = () => {
    const audioEl = this.audioRef.current;
    if (!audioEl) return;
    this.setState(
      (prevState) => ({
        playbackState: prevState.playbackState === "play" ? "pause" : "play",
      }),
      () => {
        if (this.state.playbackState === "play") {
          audioEl.play();
        } else {
          audioEl.pause();
        }
      }
    );
  };

  deleteMusic = () => {
    const { wsUpdateStory, onClose } = this.props;
    batch(() => {
      wsUpdateStory({
        music: {
          action: "delete",
        },
      });
      onClose(); // Close the panel
    });
  };

  prepareMusicPayload = () => {
    const { start, end, volume } = this.state;
    const { story } = this.props;
    const {
      payload: {
        payload: { music: musicData },
      },
    } = story;
    return {
      ...musicData,
      start: start,
      end: end,
      volume,
    };
  };

  onTrim = () => {
    const { wsUpdateStory } = this.props;

    const payload = {
      ...this.prepareMusicPayload(),
      action: "trim",
    };
    wsUpdateStory({ music: payload });
  };

  getSeekerWidth = () => {
    const {
      payload: {
        payload: { music: musicData },
      },
    } = this.props.story;
    if (!musicData.duration) return 0;
    const { start, end } = this.state;
    const duration = Number(end - start).toFixed(2);
    return `${((duration / musicData.duration) * 100).toFixed(1)}%`;
  };

  getStartPosition = () => {
    const { start } = this.state;
    const {
      payload: {
        payload: { music: musicData },
      },
    } = this.props.story;

    if (!this.seekerBoxRef.current) return 0;
    const parentWidth = this.seekerBoxRef.current.offsetWidth;

    return Number(((start / musicData.duration) * parentWidth).toFixed(1));
  };

  onChangeVolume = ([percentageVolume]) => {
    const normalizedVolume = Number((percentageVolume * 0.01).toFixed(1));
    this.setState(
      {
        volume: normalizedVolume,
      },
      () => {
        const { wsUpdateStory } = this.props;
        const audioEl = this.audioRef.current;
        if (audioEl) {
          audioEl.volume = normalizedVolume;
        }

        const payload = {
          ...this.prepareMusicPayload(),
          action: "change_volume",
        };
        wsUpdateStory({ music: payload });
      }
    );
  };

  render() {
    const { story, isSliderOpen, onClose } = this.props;
    const {
      start,
      end,
      currentDuration,
      playbackState,
      volume,
      isDragging,
      isWaveformLoaded,
      seekDuration,
    } = this.state;

    if (!story) return null;
    if (!story.payload) return null;
    if (!story.payload.payload) return null;
    const {
      payload: {
        payload: { music: musicData },
      },
    } = story;

    if (!musicData) {
      return null;
    }

    const seekerWidth = this.getSeekerWidth();
    const seekerStartPosition = this.getStartPosition();

    const percentVolume =
      volume !== undefined && volume !== null
        ? Number((Number(volume) * 100).toFixed(1))
        : 100;

    let musicSrc = musicData?.src;

    if (musicSrc) {
      const urlObj = new URL(musicSrc);
      if (urlObj.hostname !== process.env.REACT_APP_ASSET_BUCKET) {
        musicSrc = `${PROXY_IMAGES}${musicSrc}`;
      }
    }

    return (
      <StyledExpandedMusicTimelineWrapper isSliderOpen={isSliderOpen}>
        <audio src={musicSrc} preload="auto" ref={this.audioRef} />
        <div className="music-header">
          <div className="title-info">
            <span className="title">{musicData.title}</span>
            <span className="duration">
              {musicData.duration
                ? `${dayjs
                    .duration(musicData.duration, "seconds")
                    .format("mm:ss")} min`
                : null}
            </span>
          </div>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </button>
        </div>
        <div className="tools-container">
          <div className="play-button">
            <StyledActionButton onClick={this.togglePlaybackState} primary>
              <FontAwesomeIcon
                icon={playbackState === "pause" ? faPlay : faPause}
              ></FontAwesomeIcon>
            </StyledActionButton>
          </div>
          <div className="seeker-container">
            <div id="seeker-box" className="seeker-box" ref={this.seekerBoxRef}>
              {!isWaveformLoaded && (
                <div className="loader">
                  <Spinner animation="border" size="sm" /> Loading data
                </div>
              )}
              <div
                className="seeker"
                style={{
                  left:
                    currentDuration && musicData.duration
                      ? `${(currentDuration / musicData.duration) * 100}%`
                      : 0,
                }}
              >
                <FontAwesomeIcon
                  className="handler"
                  icon={faCaretDown}
                ></FontAwesomeIcon>
              </div>
              <TimelineGrabber
                className="grabber"
                parentId={"#seeker-box"}
                position={{ x: seekerStartPosition, y: 0 }}
                size={{ height: "100%", width: seekerWidth }}
                defaults={{
                  x: seekerStartPosition,
                  y: 0,
                  height: "100%",
                  width: seekerWidth,
                }}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onDragStop={(e, d) => this.onDragStop(e, d)}
                onResizeStop={(e, direction, ref, delta, position) =>
                  this.onResizeStop(e, direction, ref, delta, position)
                }
                minWidth={`${100 / (this.NUMBER_OF_MARKS * 10)}%`}
                leftTooltipText={start}
                rightTooltipText={end}
              >
                <TrimArea
                  start={start}
                  end={end}
                  isDragging={isDragging}
                  seekDuration={seekDuration}
                ></TrimArea>
              </TimelineGrabber>
              <div id="waveform" className="waveform"></div>
            </div>
          </div>
          <div className="right-actions">
            <OverlayTrigger
              placement="top"
              trigger="click"
              rootClose
              overlay={
                <VolumeSliderContainer>
                  <VolumeSlider
                    value={percentVolume}
                    onChange={this.onChangeVolume}
                  ></VolumeSlider>
                </VolumeSliderContainer>
              }
            >
              <StyledActionButton>
                <FontAwesomeIcon icon={faVolumeUp}></FontAwesomeIcon>
              </StyledActionButton>
            </OverlayTrigger>
            <StyledActionButton onClick={this.deleteMusic}>
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </StyledActionButton>
          </div>
        </div>
      </StyledExpandedMusicTimelineWrapper>
    );
  }
}

ExpandedMusicPlayerTimeline.propTypes = {
  isSliderOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  story: state.story,
  pageStore: state.pagestore,
});

const mapDispatchToProps = (dispatch) => ({
  wsUpdateStory: (payload) => dispatch(wsUpdateStory(payload)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedMusicPlayerTimeline);
