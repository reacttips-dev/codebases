import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Timer from "tiny-timer";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { TldrAnimationPlaybackAction } from "../../../common/statelessView";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
} from "../../../styled/details/stylesDetails";
import TldrSlider from "../../../common/TldrSlider";
import {
  DEFAULT_STORY_MUSIC_ELEMENT_ID,
  DOMAIN_0_TO_30,
} from "../../constants";
import {
  wsUpdateAnimation,
  wsUpdateLayer,
} from "../../../../_actions/webSocketAction";
import { isEmpty } from "lodash";
import "react-circular-progressbar/dist/styles.css";

export class StudioAnimationPlayer extends Component {
  constructor(props) {
    super(props);
    this.countdownTimer = new Timer({ interval: 100 });
    this.adds = [];
    this.audioOffset = 0;
  }
  state = {
    timeout: 0,
    seekTime: 0,
    offset: 0,
  };

  componentDidMount() {
    const { storyMusic, canvasRef } = this.props;
    this.initializeStoryAudio(storyMusic);

    this.countdownTimer.on("tick", this.onTimerTick);
    this.countdownTimer.on("statusChanged", this.onTimerStatusChanged);
  }

  onTimerTick = (ms) => {
    this.adds.push(ms);
    this.setState({ timeout: ms });
  };

  onTimerStatusChanged = (status) => {
    const { canvasRef } = this.props;
    if (status === "stopped") {
      const diffs = [];
      for (let i = 0; i < this.adds.length - 1; i++) {
        diffs.push(this.adds[i] - this.adds[i + 1]);
      }

      this.setState({ timeout: 0 });
      canvasRef.handler.audioHandler.stopAll();
      canvasRef.handler.animationHandler.stopAll();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.storyMusic !== this.props.storyMusic) {
      if (!this.props.storyMusic) {
        this.initializeStoryAudio(null);
      } else if (prevProps.storyMusic?.src !== this.props?.storyMusic?.src) {
        this.initializeStoryAudio(this.props.storyMusic);
      }
    }

    if (
      prevProps.editor?.activePage?.id !== this.props.editor?.activePage?.id
    ) {
      this.audioOffset = this.getCurrentArtboardAudioOffset();
      this.props.canvasRef.handler.audioHandler.stopAll();
      this.props.canvasRef.handler.audioHandler.seek(
        DEFAULT_STORY_MUSIC_ELEMENT_ID,
        this.audioOffset
      );
    }
  }

  componentWillUnmount() {
    const { canvasRef } = this.props;
    canvasRef.handler?.audioHandler.clearAllMusic();
    canvasRef.handler?.animationHandler.stopAll();
    this.countdownTimer.off("tick", this.onTimerTick);
    this.countdownTimer.off("statusChanged", this.onTimerStatusChanged);
  }

  initializeStoryAudio = (audioSource = null) => {
    const { canvasRef } = this.props;
    if (!audioSource) {
      canvasRef.handler.audioHandler.initialize([]); // Clear and stop existing music
    } else {
      this.audioOffset = this.getCurrentArtboardAudioOffset();
      canvasRef.handler.audioHandler.initialize([
        {
          id: DEFAULT_STORY_MUSIC_ELEMENT_ID,
          src: audioSource.src,
          offset: this.audioOffset,
          volume: audioSource.volume,
        },
      ]);
    }
  };

  getCurrentArtboardAudioOffset = () => {
    const {
      editor: { activePage: { id: activePageId } = {} },
      pages,
      storyMusic,
    } = this.props;

    let startOffset = 0;

    if (storyMusic && storyMusic.start) {
      startOffset = storyMusic.start;
    }

    const sortedPages = Object.keys(pages)
      .map((pIdx) => pages[pIdx])
      .sort((a, b) => (a.order > b.order ? 1 : -1));
    const activePageIndex = sortedPages.findIndex((o) => o.id === activePageId);
    if (activePageIndex === 0) {
      return startOffset;
    } else {
      const previousPages = sortedPages.slice(0, activePageIndex);
      return (
        previousPages.reduce((sum, obj) => {
          const animationDuration = obj?.payload?.animation?.duration ?? 6;
          return sum + animationDuration;
        }, 0) + startOffset
      );
    }
  };

  playerAction = (action) => {
    const { editor, layers, pages, canvasRef, storyMusic } = this.props;
    if (action === "stop") {
      canvasRef.handler.animationHandler.stopAll();
      this.countdownTimer.stop();
      canvasRef.handler.audioHandler.stop(DEFAULT_STORY_MUSIC_ELEMENT_ID);
      this.props.canvasRef.handler.audioHandler.seek(
        DEFAULT_STORY_MUSIC_ELEMENT_ID,
        this.audioOffset
      );
      return;
    } else if (action === "pause") {
      canvasRef.handler.animationHandler.pauseAll();
      this.countdownTimer.pause();
      canvasRef.handler.audioHandler.pause(DEFAULT_STORY_MUSIC_ELEMENT_ID);
      return;
    }
    if (editor.activeElement && editor.activeElement.id) {
      const currentAnimations =
        layers[editor.activeElement.id].payload.animation;
      if (action === "play" && currentAnimations) {
        canvasRef.handler.animationHandler.playAll(
          editor.activeElement,
          currentAnimations
        );
      }
    } else {
      const currentAnimation = pages[editor.activePage.id].payload.animation;
      let offsetMusic = 0;
      // const layersInCanvas = canvasRef.handler.getObjects();
      // layersInCanvas.forEach((layer) => {
      //   if (
      //     !layer.animation &&
      //     currentAnimation.preset &&
      //     currentAnimation.preset.sequence
      //   ) {
      //     layer.set("animation", currentAnimation.preset.sequence);
      //   }
      // });
      if (this.countdownTimer.time) {
        this.countdownTimer.resume();
      } else {
        this.countdownTimer.start(currentAnimation.duration * 1000);
      }
      canvasRef.handler.animationHandler.previewCurrentArtboard(
        currentAnimation.duration
      );
      canvasRef.handler.audioHandler.play(DEFAULT_STORY_MUSIC_ELEMENT_ID);
    }
  };

  updateClipDuration = (newDuration, editor, pages) => {
    let duration = Number(newDuration[0].toFixed(1));
    const currentPage = pages[editor.activePage.id];
    const objectPayload = currentPage.payload;
    if (objectPayload["animation"]) {
      if (objectPayload["animation"]["duration"] === duration) {
        return;
      }
      objectPayload["animation"]["duration"] = duration;
    } else {
      objectPayload["animation"] = { duration: duration };
    }
    let message = {
      page: currentPage.id,
      payload: objectPayload,
    };
    this.props.wsUpdateAnimation(message);
  };

  updateLayerDuration = (newDuration, editor, layers) => {
    let startTime = Number(newDuration[0].toFixed(1)) * 1000;
    let endTime = Number(newDuration[1].toFixed(1)) * 1000;

    let totalDuration = endTime - startTime;
    const currentPayload = layers[editor.activeElement.id].payload;
    const currentAnimations = currentPayload ? currentPayload.animation : [];
    let enterAnimation, still, exitAnimation;

    if (isEmpty(currentAnimations)) {
      return;
    }

    switch (currentAnimations.length) {
      case 2:
        // Enter animation + still
        enterAnimation = currentAnimations[0];
        still = currentAnimations[1];
        if (
          enterAnimation["start_time"] !== startTime ||
          still["end_time"] !== endTime
        ) {
          enterAnimation["start_time"] = startTime;
          enterAnimation["end_time"] =
            startTime + enterAnimation["trans_duration"];

          still["start_time"] = enterAnimation["end_time"];
          still["trans_duration"] =
            totalDuration - enterAnimation["trans_duration"];
          still["end_time"] = still["start_time"] + still["trans_duration"];
          this.props.canvasRef.handler.set("animation", [
            enterAnimation,
            still,
          ]);
        }
        break;
      case 3:
        enterAnimation = currentAnimations[0];
        exitAnimation = currentAnimations[2];

        if (
          enterAnimation["start_time"] !== startTime ||
          exitAnimation["end_time"] !== endTime
        ) {
          enterAnimation["start_time"] = startTime;
          enterAnimation["end_time"] =
            startTime + enterAnimation["trans_duration"];

          still = currentAnimations[1];
          still["start_time"] = enterAnimation["end_time"];
          still["trans_duration"] =
            totalDuration -
            exitAnimation["trans_duration"] -
            exitAnimation["trans_duration"];
          still["end_time"] = still["start_time"] + still["trans_duration"];

          exitAnimation["start_time"] = still["end_time"];
          exitAnimation["end_time"] =
            exitAnimation["start_time"] + exitAnimation["trans_duration"];

          this.props.canvasRef.handler.set("animation", [
            enterAnimation,
            still,
            exitAnimation,
          ]);
        }
        break;
      default:
    }
  };

  onChangeDuration = (newDuration) => {
    const { editor, layers, pages } = this.props;
    if (editor.activeElement && editor.activeElement.id) {
      this.updateLayerDuration(newDuration, editor, layers);
    } else {
      this.updateClipDuration(newDuration, editor, pages);
    }
  };

  onChangeSeekTime = (newDuration) => {
    const { pages, canvasRef, editor } = this.props;
    const currentAnimation = pages[editor.activePage.id].payload.animation;
    let point = Number(newDuration[0].toFixed(1));
    this.setState({ seekTime: point });
    canvasRef.handler.animationHandler.seekToPosition(
      point,
      currentAnimation.duration
    );
  };

  render() {
    const { editor, layers, pages } = this.props;
    const { activeElement, activePage } = editor;
    const { id: activePageId } = activePage;
    const { id: activeElementId } = activeElement;
    if (!activePageId) {
      return <></>;
    }
    let showPreview = true,
      defaultMaxClipDuration = DOMAIN_0_TO_30,
      step = 0.1;

    const currentAnimation = pages[activePageId].payload.animation;
    let defaultDuration = currentAnimation["duration"];
    let clipDuration = [defaultDuration];
    let seekTime = [this.state.seekTime];

    if (editor.activeElement && activeElementId) {
      defaultMaxClipDuration = [0, defaultDuration];
      let totalTime = defaultDuration;
      let startTime = 0;

      showPreview = layers[activeElementId]?.payload.animation;
      const currentAnimations = layers[activeElementId]?.payload.animation;
      if (currentAnimations) {
        startTime = currentAnimations[0].start_time / 1000;
        if (currentAnimations.length === 2) {
          totalTime = currentAnimations[1].end_time / 1000;
        } else if (currentAnimations.length === 3) {
          totalTime = currentAnimations[2].end_time / 1000;
        } else {
          totalTime = currentAnimations[0].end_time / 1000;
        }
      }
      clipDuration = [startTime, totalTime];
    }
    const { timeout } = this.state;

    return (
      <>
        <StyledAdvEditorToolbarRow margin="0px">
          <StyledAdvEditorToolbarFormatGroup className="mr-2">
            <div className="title">Preview</div>
            <div className="actions">
              {activeElementId ? (
                <TldrAnimationPlaybackAction
                  action="play"
                  icon="play"
                  title="Play"
                  callback={this.playerAction}
                  disabled={showPreview ? false : true}
                  margin="0 0.2rem"
                />
              ) : (
                <div style={{ width: 40, height: 40, margin: "0 0.2rem" }}>
                  <CircularProgressbarWithChildren
                    value={
                      timeout
                        ? (100 *
                            (defaultDuration * 1000 - this.state.timeout)) /
                          (defaultDuration * 1000)
                        : 0
                    }
                    strokeWidth={6}
                    styles={buildStyles({
                      pathColor: "#ffac41",
                    })}
                  >
                    <TldrAnimationPlaybackAction
                      action="play"
                      icon="play"
                      title="Play"
                      callback={this.playerAction}
                      disabled={showPreview ? false : true}
                    />
                  </CircularProgressbarWithChildren>
                </div>
              )}

              <TldrAnimationPlaybackAction
                action="pause"
                icon="pause"
                title="Pause"
                callback={this.playerAction}
                disabled={showPreview ? false : true}
                margin="0 0.2rem"
              />

              <TldrAnimationPlaybackAction
                action="stop"
                icon="stop"
                title="Stop"
                callback={this.playerAction}
                disabled={showPreview ? false : true}
                margin="0 0.2rem"
              />
            </div>
          </StyledAdvEditorToolbarFormatGroup>
          <StyledAdvEditorToolbarFormatGroup>
            <TldrSlider
              // disabled={showPreview ? false : true}
              classNames={"w-83"}
              domain={defaultMaxClipDuration}
              values={clipDuration}
              step={step}
              onChange={this.onChangeDuration}
              showDecimals={true}
              title={
                activeElementId ? "Start & end time (sec)" : "Duration (sec)"
              }
              maxLength={5}
              handleFocusOut={this.onChangeDuration}
              showInputbox={false}
            ></TldrSlider>
            {/* {showPreview && (
              <TldrSlider
                domain={defaultMaxClipDuration}
                values={seekTime}
                step={step}
                onUpdate={this.onChangeSeekTime}
                onChange={this.onChangeSeekTime}
                showDecimals={true}
                title="Start time (sec)"
                maxLength={5}
                handleFocusOut={this.onChangeSeekTime}
                showInputbox={false}
              ></TldrSlider>
            )} */}
          </StyledAdvEditorToolbarFormatGroup>
        </StyledAdvEditorToolbarRow>
      </>
    );
  }
}

StudioAnimationPlayer.propTypes = {
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layers: state.layerstore.layers,
  pages: state.pagestore.pages,
  storyMusic: state.story?.payload?.payload?.music,
});

const mapDispatchToProps = (dispatch) => ({
  wsUpdateAnimation: (payload) => dispatch(wsUpdateAnimation(payload)),
  wsUpdateLayer: (payload) => dispatch(wsUpdateLayer(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioAnimationPlayer);
