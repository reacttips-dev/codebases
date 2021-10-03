import React, { Component } from "react";
import { connect } from "react-redux";
import anime from "animejs";
import PropTypes from "prop-types";
import { setActivePage } from "../_actions/textToolbarActions";
import {
  DEFAULT_AUDIO_VOLUME,
  GLOBAL_TIMELINE_ALLOWED_DELTA,
  StoryTypes,
} from "../_utils/constants";

const TimelineContext = React.createContext();
TimelineContext.displayName = "TimelineContext";

class TimelineProviderBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      currentTime: 0,
      pagesData: [],
      audioData: null,
      duration: 0,
      timescale: 1,
    };
    this.timeline = null;
  }

  getSortedPagesWithMusicData = (
    pages = {},
    pageIds = [],
    musicData = null
  ) => {
    let pagesData = []; // Modify pages add `startTime` and `endTime` in payload

    let duration = 0; // Total duration of the story

    let audioData = null;

    // Process pages
    if (pages) {
      for (const pageId of pageIds) {
        const page = pages[pageId];
        pagesData.push({ ...page });
      }

      // Uncomment this for ordering
      // pagesData = pagesData.sort((a, b) => (a.order > b.order ? 1 : -1));

      pagesData.forEach((page, idx) => {
        const pageDuration = Number(page?.payload?.animation?.duration ?? 6);
        const startTime = duration;
        duration += pageDuration;
        const endTime = duration;
        pagesData[idx]["startTime"] = startTime;
        pagesData[idx]["endTime"] = endTime;
        pagesData[idx]["duration"] = pageDuration;
      });
    }

    if (musicData) {
      const musicDuration = musicData.duration;
      const audioOffset = musicData.offset ?? 0;
      let audioEnd = musicData.end ?? musicDuration;
      const audioStart = musicData.start ?? 0;
      const audioOverflow = audioOffset + (audioEnd - audioStart) - duration;

      // Check whether audio is overflowing from story duration or not
      if (audioOverflow > 0) {
        audioEnd -= audioOverflow;
      }
      audioData = {
        ...musicData,
        duration: musicDuration,
        offset: audioOffset,
        start: audioStart,
        end: audioEnd,
      };
    }

    return [pagesData, duration, audioData];
  };

  buildTimeline = () => {
    // Build the timeline
    const { duration, pagesData, audioData } = this.state;
    const { canvasRef, setActivePage } = this.props;
    // Create animejs timeline
    this.timeline = anime.timeline({
      targets: "#global-timeline-ref",
      duration: duration * 1000,
      autoplay: false,
      update: (tl) => {
        // Timeline updates
        this.setState({
          currentTime: tl.currentTime / 1000,
        });
      },
      changeBegin: (tl) => {},
      changeComplete: (tl) => {
        // Once timeline finishes
        canvasRef.handler.animationHandler.stopAll();
        this.seek(0);
        this.pause();
        setActivePage(pagesData[0].id, 0, false);
      },
      complete: (tl) => {
        // Once timeline finishes
        canvasRef.handler.animationHandler.stopAll();
        this.seek(0);
        this.pause();
      },
    });

    // Build sequences for Pages
    if (pagesData) {
      pagesData.forEach((page, idx) => {
        const offset = page.startTime;

        this.timeline.add(
          {
            duration: page.duration * 1000,
            easing: "linear",
            suspendWhenDocumentHidden: false,
            begin: () => {},
            change: (tl) => {
              // When page animation changes
              const { isPlaying } = this.state;
              const currentTime = (tl.progress / 100) * tl.duration;
              if (
                canvasRef &&
                canvasRef?.handler?.animationHandler?.timeline?.currentTime
              ) {
                if (
                  Math.abs(
                    canvasRef.handler.animationHandler.timeline.currentTime -
                      currentTime
                  ) > GLOBAL_TIMELINE_ALLOWED_DELTA
                ) {
                  canvasRef.handler.animationHandler.seekToPosition(
                    currentTime / 1000,
                    page.duration,
                    isPlaying
                  );
                }
              }
            },
            changeBegin: (tl) => {
              // When page animation starts
              const { isPlaying } = this.state;
              const currentTime = (tl.progress / 100) * tl.duration;
              setActivePage(page.id, idx, false);
              canvasRef.handler.animationHandler.seekToPosition(
                currentTime / 1000,
                page.duration,
                isPlaying
              );
            },
            changeComplete: () => {
              // When page animation completes
              canvasRef.handler.animationHandler.stopAll();
            },
          },
          offset * 1000
        );
      });
    }

    // Build sequence for audio
    if (audioData) {
      const storyAudioEl = this.getStoryMusicElement();
      if (storyAudioEl) {
        storyAudioEl.volume = audioData.volume ?? DEFAULT_AUDIO_VOLUME;
      }
      const audioStart = audioData.start ?? 0;
      const audioEnd = audioData.end ?? audioData.duration;
      const audioOffset = audioData.offset ?? 0;
      this.timeline.add(
        {
          duration: (audioEnd - audioStart) * 1000,
          easing: "linear",
          changeBegin: () => {
            const { isPlaying } = this.state;
            const audioEl = this.getStoryMusicElement();
            if (!audioEl) return;
            audioEl.currentTime = audioStart; // Set the audio start position
            if (isPlaying) {
              audioEl.play();
            }
          },
          change: (tl) => {
            const { isPlaying } = this.state;
            const currentTime = (tl.progress / 100) * tl.duration;
            const audioEl = this.getStoryMusicElement();
            if (!audioEl) return;
            if (isPlaying) {
              if (audioEl.paused) audioEl.play();
            }

            // Below code checks whether audio is in sync with global timeline or not
            if (
              Math.abs(
                (audioEl.currentTime - (currentTime / 1000 + audioStart)) * 1000
              ) > GLOBAL_TIMELINE_ALLOWED_DELTA
            ) {
              audioEl.currentTime = currentTime / 1000 + audioStart; // Set the current time position of audio
            }
          },
          changeComplete: () => {
            const audioEl = this.getStoryMusicElement();
            if (!audioEl) return;
            audioEl.pause();
            audioEl.currentTime = 0; // On complete set audio time position to zero
          },
        },
        audioOffset * 1000 // Audio offset
      );
    }
  };

  getRelativeTimesAndPlayState = (currentTime, startTime, endTime) => {
    if (currentTime && startTime && endTime) {
      if (currentTime <= endTime && currentTime >= startTime) {
        return [currentTime - startTime, true];
      }
    }
    return [null, false];
  };

  componentDidMount() {
    const { pages, story, pageIds } = this.props;
    const storyMusic = story?.payload?.payload?.music;
    const [pagesData, duration, audioData] = this.getSortedPagesWithMusicData(
      pages,
      pageIds,
      storyMusic
    );

    this.setState(
      {
        pagesData,
        duration,
        audioData,
      },
      () => {
        this.buildTimeline();
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { pages, pageIds } = this.props;

    const prevStory = prevProps.story;
    const story = this.props.story;
    // Check whether Story music is updated
    if (prevStory?.payload?.payload?.music !== story?.payload?.payload?.music) {
      const [pagesData, duration, audioData] = this.getSortedPagesWithMusicData(
        pages,
        pageIds,
        story?.payload?.payload?.music
      );
      this.setState(
        {
          pagesData,
          duration,
          audioData,
        },
        () => {
          this.buildTimeline();
        }
      );
    }

    // Check whether the pages are updated or not
    if (
      this.props.pages !== prevProps.pages ||
      this.props.pageIds !== prevProps.pageIds
    ) {
      const [pagesData, duration, audioData] = this.getSortedPagesWithMusicData(
        pages,
        pageIds,
        story?.payload?.payload?.music
      );

      this.setState(
        {
          pagesData,
          duration,
          audioData,
        },
        () => {
          this.buildTimeline();
        }
      );
    }
  }

  getStoryMusicElement = () => {
    return document.getElementById("story-music");
  };

  getActivePageData = () => {
    const { activePageId } = this.props;
    const { pagesData } = this.state;
    return pagesData.find((o) => o.id === activePageId);
  };

  updateStoryAudioState = (partialState = {}) => {
    this.setState((prevState) => ({
      audioData: { ...prevState.audioData, ...partialState },
    }));
  };

  play = () => {
    this.setState(
      {
        isPlaying: true,
      },
      () => {
        const { canvasRef } = this.props;
        if (canvasRef?.handler?.interactionHandler) {
          canvasRef?.handler?.interactionHandler.preview();
        }
        // Uncomment this if play action feels delayed too much
        // const { audioData, currentTime } = this.state;
        // const pageData = this.getActivePageData();

        // if (pageData && pageData.startTime && pageData.endTime) {
        //   const [seekTime, isPlayable] = this.getRelativeTimesAndPlayState(
        //     currentTime,
        //     pageData.startTime,
        //     pageData.endTime
        //   );
        //   if (isPlayable) {
        //     canvasRef.handler.animationHandler.seekToPosition(
        //       seekTime * 1000,
        //       pageData.duration,
        //       true
        //     );
        //   }
        // }
        // if (audioData) {
        //   const [seekTime, isPlayable] = this.getRelativeTimesAndPlayState(
        //     currentTime,
        //     0,
        //     audioData.duration
        //   );
        //   if (isPlayable) {
        //     const audioRef = this.getStoryMusicElement();
        //     audioRef.currentTime = seekTime;
        //     audioRef.play();
        //   }
        // }
        this.timeline.play();
      }
    );
  };

  pause = () => {
    this.setState(
      {
        isPlaying: false,
      },
      () => {
        const { canvasRef } = this.props;
        if (canvasRef?.handler?.interactionHandler) {
          canvasRef?.handler?.interactionHandler.selection();
        }
        const audioEl = this.getStoryMusicElement();
        if (audioEl) {
          audioEl.pause();
        }
        canvasRef.handler.animationHandler.pauseAll();
        this.timeline.pause();
      }
    );
  };

  stop = () => {};

  seek = (point) => {
    this.timeline.seek(point * 1000);
    this.setState({
      currentTime: point,
    });
  };

  seekRelative = (offset) => {
    const isPlaying = this.state.isPlaying;
    if (isPlaying) this.pause();
    setTimeout(() => {
      this.timeline.seek(this.timeline.currentTime + offset * 1000);
      if (isPlaying) this.play();
    }, GLOBAL_TIMELINE_ALLOWED_DELTA);
  };

  changeTimescale = (scale) => {
    this.setState({
      timescale: scale,
    });
  };

  render() {
    const {
      currentTime,
      isPlaying,
      duration,
      pagesData,
      audioData,
      timescale,
    } = this.state;
    const { story } = this.props;

    let shouldRenderTimeline = false;

    if (story && story?.payload?.story_type === StoryTypes.ANIMATED) {
      shouldRenderTimeline = shouldRenderTimeline || true;
    }
    if (audioData) {
      shouldRenderTimeline = shouldRenderTimeline || true;
    }

    // expose follwing state and components to children wherever required
    const provides = {
      shouldRenderTimeline, // It provides whether story is animated or not
      duration, // Total duration of the Story
      pagesData, // Modified pages data with startTime, endTime and duration  Note: Don't use it for persistance
      audioData, // Modified audioData with start, end, duration, offset
      isPlaying, // If the timeline is playing or not
      currentTime, // Current time position of the timeline (In seconds)
      timescale, // Time scale for ruler
      play: this.play, // Play the timeline
      pause: this.pause, // Pause the timeline
      stop: this.stop, // Stops the timeline
      seek: this.seek, // Seek the timeline
      seekRelative: this.seekRelative, // Seek to relative position from current time
      changeTimescale: this.changeTimescale, // Change the timescale
      updateStoryAudioState: this.updateStoryAudioState, // Updates story audio state when SoundBlock is changed
    };
    return (
      <TimelineContext.Provider value={provides}>
        <div id="global-timeline-ref"></div>
        {audioData && <audio id="story-music" src={audioData.src}></audio>}
        {this.props.children}
      </TimelineContext.Provider>
    );
  }
}

const mapStateToProps = (state) => ({
  layers: state.layerstore?.layers,
  story: state.story,
  pages: state.pagestore?.pages,
  pageIds: state.pagestore?.pageIds,
  activePageId: state.editor?.activePage?.id,
  activeElement: state.editor?.activeElement,
});

const mapDispatchToProps = (dispatch) => ({
  setActivePage: (pageId, pageIndex, isSelected) =>
    dispatch(setActivePage(pageId, pageIndex, isSelected)),
});

TimelineProviderBase.propTypes = {
  canvasRef: PropTypes.object,
};

export const TimelineProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineProviderBase);
export { TimelineContext };
