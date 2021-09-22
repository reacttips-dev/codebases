import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import videojs from 'video.js';
import Q from 'q';

import { compose } from 'recompose';
import { groupBy, orderBy } from 'lodash';

import Retracked from 'js/lib/retracked';
import user from 'js/lib/user';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import userAgent from 'js/constants/userAgent';

// eslint-disable-next-line import/extensions
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import LucidJS from 'js/vendor/lucid.v2-7-0';

import { progressCompleted } from 'pages/open-course/common/constants';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import supportsNativeTextTracks from 'pages/open-course/video/util/supportsNativeTextTracks';

import userPreferences from 'bundles/video-player/utils/userPreferences';

import { saveProgressToLocalStorage, updateProgress } from 'bundles/ondemand/actions/ProgressActions';

import constants from 'bundles/video-player/constants';

import VideoQuiz from 'bundles/video-quiz/components/VideoQuiz';
import type { OnDemandVideoProgressV1Data } from 'bundles/video-player/utils/OnDemandVideoProgressesAPIUtils';
import OnDemandVideoProgressesAPIUtils from 'bundles/video-player/utils/OnDemandVideoProgressesAPIUtils';
import { createVideoEventTracker } from 'bundles/video-player/utils/AnalyticsMetadataFetcher';
import VideoAnalytics from 'bundles/video-player/components/VideoAnalytics';
import VideoControlsContainer from 'bundles/video-player/components/VideoControlsContainer';

import { sendEvent } from 'bundles/video-player/utils/VideoProgressEventAPIUtils';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { getDefaultVideoResolution, formatSourcesByResolution } from 'bundles/video-player/utils/videoUtils';

import 'bundles/videojs/plugins/eventEmitter';
import 'bundles/videojs/plugins/cuepoints';
import 'bundles/videojs/plugins/heartbeat';
import 'bundles/videojs/plugins/hotkeys';
import 'bundles/videojs/plugins/joinEvents';
import 'bundles/videojs/plugins/resolutions';
import 'bundles/videojs/plugins/waitEvents';

import 'css!video.js/dist/video-js.css'; // eslint-disable-line
import 'css!bundles/videojs/css/coursera'; // eslint-disable-line no-restricted-syntax
import 'css!./__styles__/VideoPlayer';

import _t from 'i18n!nls/video-player';

import type { VideoProgress } from 'bundles/video-player/types/VideoProgress';
import type { ViewOptions } from 'bundles/video-player/types/ViewOptions';
import type { VideoPlayer as VideoPlayerType, VideoRegion } from 'bundles/item-lecture/types';
import type { InVideoQuestion } from 'bundles/video-quiz/types';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import type { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';
/* eslint-enable no-restricted-imports */

const defaultOptions = {
  volumeStep: 0.1,
  seekStep: 5,
  enableMute: true,
  enableFullscreen: true,
  playbackStep: 0.25,
  playbackLowerLimit: 0.75,
  playbackUpperLimit: 2,
};

type Props = {
  viewOptions: ViewOptions;
  setVideoRegion: (region: VideoRegion) => void;
  ariaLabel?: string;
  itemMetadata: ItemMetadata;
};

type State<InVideoQuestionType extends QuizQuestionPrompt> = {
  videoProgress: VideoProgress | null;
  videoQuizQueue: InVideoQuestion<InVideoQuestionType>[];
  activeQuestion: InVideoQuestion<InVideoQuestionType> | null;
};

export class VideoPlayer<InVideoQuestionType extends QuizQuestionPrompt> extends React.Component<
  Props,
  State<InVideoQuestionType>
> {
  player: VideoPlayerType;

  track!: (name: string, data?: {}) => void;

  videoNode: HTMLVideoElement | null | undefined;

  static contextTypes = {
    executeAction: PropTypes.func,
    _eventData: PropTypes.object,
  };

  state: State<InVideoQuestionType> = {
    videoProgress: null,
    videoQuizQueue: [],
    activeQuestion: null,
  };

  componentDidMount() {
    const {
      viewOptions: { setVideoPlayer },
      setVideoRegion,
    } = this.props;

    this.player = this.createVideoJSPlayer();

    this.setupVideoPlayerEvents(this.player);
    setVideoPlayer(this.player);
    setVideoRegion(this.videoNode);
  }

  // destroy player on unmount
  componentWillUnmount() {
    const {
      viewOptions: { setInteractiveTranscript },
    } = this.props;

    // save video progress
    this.updateProgress();

    document.removeEventListener('keydown', this.handleDocumentKeyDown);

    if (this.player) {
      if (this.player.isFullscreen()) {
        // When we're in fullscreen, the fullscreenchange event is asynchronous and can lead to the videoPlayer getting
        // disposed before all of its events are disposed properly (in particular,
        // https://github.com/webedx-spark/web/blob/0b1c263/static/bundles/videojs/lib/video.v5-8.js#L11012-L11021)
        // leading to a ton of innocuous but noisy errors.
        this.player.one('fullscreenchange', () => {
          this.player.dispose();
        });
        this.player.exitFullscreen();
      } else {
        this.player.dispose();
      }
    }

    setInteractiveTranscript(null);
  }

  togglePlayingState = () => {
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  };

  handlePlayerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const options = this.player.options();

    const { volumeStep: defaultVolumeStep, seekStep: defaultSeekStep } = defaultOptions;
    const { volumeStep = defaultVolumeStep, seekStep = defaultSeekStep } = {
      ...options,
      ...defaultOptions,
    };

    const activeEl = document.activeElement;
    if (activeEl === this.player.el()) {
      // These events must be handled on player keydown to preserve a11y behavior for the rest of the document.
      switch (event.which) {
        // Spacebar toggles play/pause
        case 32:
          event.preventDefault();
          this.togglePlayingState();
          break;

        // Enter key toggles play/pause
        case 13:
          event.preventDefault();
          this.togglePlayingState();
          break;

        // Seek with the left arrow key
        case 37: {
          event.preventDefault();
          let curTime = this.player.currentTime() - seekStep;

          // The flash this.player tech will allow you to seek into negative
          // numbers and break the seekbar, so try to prevent that.
          if (this.player.currentTime() <= seekStep) {
            curTime = 0;
          }
          this.player.currentTime(curTime);
          break;
        }

        // Seek with the right arrow key
        case 39:
          event.preventDefault();
          this.player.currentTime(this.player.currentTime() + seekStep);
          break;

        // Volume up with up arrow
        case 38:
          event.preventDefault();
          this.player.volume(this.player.volume() + volumeStep);
          break;

        // Volume down with down arrow
        case 40:
          event.preventDefault();
          this.player.volume(this.player.volume() - volumeStep);
          break;

        default:
          break;
      }
    }
  };

  // toggle fullscreen mode on mouse double-click
  handlePlayerDblClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();

    const options = this.player.options();
    const { enableFullscreen: defaultEnableFullscreen } = defaultOptions;
    const { enableFullscreen = defaultEnableFullscreen } = {
      ...options,
      ...defaultOptions,
    };

    if (enableFullscreen) {
      if (this.player.isFullscreen()) {
        this.player.exitFullscreen();
      } else {
        this.player.requestFullscreen();
      }
    }
  };

  handleDocumentKeyDown = (event: KeyboardEvent) => {
    const options = this.player.options();
    const usesModifiers = event.ctrlKey || event.altKey || event.metaKey || event.shiftKey;

    // trap Tab-Key within the IVQ video in order to contain focus inside the overlay
    this.trapFocusInIvq(event);

    // Seeing none of our shortcuts use modifiers,
    // we should just return if any are being used.
    // This prevents conflicts with browser defaults like Ctrl+F.
    if (usesModifiers) {
      return;
    }

    const {
      enableMute: defaultEnableMute,
      enableFullscreen: defaultEnableFullscreen,
      playbackStep: defaultPlaybackStep,
      playbackLowerLimit: defaultPlaybackLowerLimit,
      playbackUpperLimit: defaultPlaybackUpperLimit,
    } = defaultOptions;

    const {
      enableMute = defaultEnableMute,
      enableFullscreen = defaultEnableFullscreen,
      playbackStep = defaultPlaybackStep,
      playbackLowerLimit = defaultPlaybackLowerLimit,
      playbackUpperLimit = defaultPlaybackUpperLimit,
    } = {
      ...options,
      ...defaultOptions,
    };

    const target = (event.target as HTMLElement) || (event.srcElement as HTMLElement);
    const { tagName } = target;

    const isContentEditable =
      tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA' || target.isContentEditable;
    if (isContentEditable) {
      return;
    }

    switch (event.which) {
      // Toggle play/pause with the k key
      case 75:
        event.preventDefault();
        if (this.player.paused()) {
          this.player.play();
        } else {
          this.player.pause();
        }
        break;

      // Toggle mute with the m key
      case 77:
        event.preventDefault();
        if (enableMute) {
          this.player.muted(!this.player.muted());
        }
        break;

      // Toggle fullscreen with the f key
      case 70:
        event.preventDefault();
        if (enableFullscreen) {
          if (this.player.isFullscreen()) {
            this.player.exitFullscreen();
          } else {
            this.player.requestFullscreen();
          }
        }
        break;

      // Increase playback rate with Shift + >
      case 190:
        event.preventDefault();
        if (event.shiftKey && this.player.playbackRate() < playbackUpperLimit) {
          this.player.playbackRate(this.player.playbackRate() + playbackStep);
        }
        break;

      // Decrease playback rate with Shift + <
      case 188:
        event.preventDefault();
        if (event.shiftKey && this.player.playbackRate() > playbackLowerLimit) {
          this.player.playbackRate(this.player.playbackRate() - playbackStep);
        }
        break;

      default:
        break;
    }
  };

  onLoadedMetadata = () => {
    this.setUserPreferences();
    this.attachVideoEndedListener();
    this.initializeVideoQuizListeners();
  };

  trapFocusInIvq(event: $TSFixMe) {
    const ivqOverlay = document.querySelector('.vjs-overlay');

    if (ivqOverlay) {
      // find all focusable children
      const focusableElementsString =
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
      // convert NodeList to Array
      const focusableElements = Array.from(ivqOverlay.querySelectorAll(focusableElementsString)) as Array<HTMLElement>;

      const visibleFocusableElements = focusableElements.filter((element) => element.style.display !== 'none');

      const firstTabStop = visibleFocusableElements[0];
      const lastTabStop = visibleFocusableElements[visibleFocusableElements.length - 1];

      if (event.keyCode === 9) {
        // SHIFT + TAB
        if (event.shiftKey) {
          if (document.activeElement === firstTabStop) {
            event.preventDefault();
            lastTabStop.focus();
          }
        } else {
          // TAB
          /* eslint-disable no-lonely-if */
          if (document.activeElement === lastTabStop) {
            event.preventDefault();
            firstTabStop.focus();
          }
        }
      }
    }
  }

  applySubtitlePosition = ({ textTracks, line = 100, position = 50, align = 'bottom' }: $TSFixMe) => {
    textTracks.forEach(
      (track: $TSFixMe) =>
        track.cues &&
        Object.keys(track.cues).forEach((i) => {
          if (track.cues) {
            track.cues[i].position = position;
            track.cues[i].line = line;
            track.cues[i].align = align;
          }
        })
    );
  };

  /**
   * Creates the initial VideoJS player object
   */
  createVideoJSPlayer = () => {
    const {
      viewOptions: { videoContent, nextItemMetadataOrItemGroup, course },
    } = this.props;

    const { name, itemMetadata } = videoContent;

    const resolution = userPreferences.get('resolution') || getDefaultVideoResolution();
    const sources = videoContent.getSourcesForResolution(resolution);

    const videoJsOptions = {
      nextItemMetadataOrItemGroup,
      title: name,
      subtitle: course.get('name'),
      courseId: course.get('id'),
      itemId: itemMetadata.get('id'),
      moduleName: itemMetadata.get('module.name'),
      moduleId: itemMetadata.get('module.id'),
      lessonId: itemMetadata.get('lesson.id'),
      lessonName: itemMetadata.get('lesson.name'),
      defaultSubtitleLanguage: userPreferences.get('subtitleLanguage'),
      fluid: true,
      controls: false,
      html5: {
        nativeTextTracks: supportsNativeTextTracks(),
      },
      poster: videoContent.getPosterForResolution('720p'),
      sources: this.formatVideoSource(sources),
      plugins: {
        hotkeys: {},
        resolutions: {
          sourcesByResolution: formatSourcesByResolution(videoContent.sources),
          resolution,
        },
        joinEvents: {},
        waitEvents: userAgent.browser.name !== 'IE' ? {} : undefined,
      },
    };

    const player = videojs(this.videoNode, videoJsOptions);

    if (!player.emitter) {
      // All custom events should be sent on the Lucid emitter
      player.emitter = LucidJS.emitter();
    }

    player.setupHeartbeatListener();
    player.currentTrack = function () {
      return player.textTracks().tracks_.find((track: $TSFixMe) => track.mode === 'showing');
    };

    return player;
  };

  /**
   * Sets up various listeners for a given VideoJS player
   *
   * @param {any} player The VideoJS player whose listeners to setup
   */
  setupVideoPlayerEvents = (player: VideoPlayerType) => {
    const {
      viewOptions: {
        videoContent: { subtitlesVtt },
        setInteractiveTranscript,
        course,
      },
    } = this.props;

    player.ready(() => {
      const primaryLanguageCodes = course.get('primaryLanguageCodes');

      setInteractiveTranscript({
        player,
        languageMap: subtitlesVtt,
        defaultLanguage: primaryLanguageCodes && primaryLanguageCodes[0],
      });
    });

    player.on('loadedmetadata', this.onLoadedMetadata);
    player.on('durationchange', this.setInitialPlaybackTime);

    player.one('play', () => {
      const track = _(player.textTracks()).find((t) => t.language === userPreferences.get('subtitleLanguage'));

      if (track) {
        track.mode = 'showing';
      }

      player.trigger('trackloaded');
    });

    player.one('play', () => {
      if (player.autoplay() && this.videoNode) {
        this.videoNode.focus();
      }
    });

    player.on('play', (e: $TSFixMe) => {
      const textTracks = Array.from(this.player.textTracks());
      this.applySubtitlePosition({ textTracks });
    });

    // TODO: Uncomment these lines once we figure out how to process high
    // traffic.
    // We have turned this off during the coronavirus outbreak due to increased
    // strain on courral from the OnDemandVideoProgresses API.
    // player.emitter.on('heartbeat:30000', this.updateProgress);
    // player.on('scrubbed', this.updateProgress);

    player.on('keydown', this.handlePlayerKeyDown);

    document.addEventListener('keydown', this.handleDocumentKeyDown);
  };

  /**
   * Start the video playback at a specific time when it's loaded by calling currentTime
   * calling currentTime is only allowed when the video's duration becomes known.
   * the event that this triggers is 'durationchange'
   */
  setInitialPlaybackTime = () => {
    const {
      viewOptions: { course, videoContent, startPlaybackSeconds },
    } = this.props;

    // Only run this once so we don't overwrite the learner's position if they scrub.
    this.player.off('durationchange', this.setInitialPlaybackTime);

    if (startPlaybackSeconds !== undefined) {
      // Start playback from the specified timestamp.
      this.setPlaybackTime(startPlaybackSeconds);
    } else {
      // Start playback from where the learner last left off
      const { videoId } = videoContent;
      const courseId = course.get('id');

      OnDemandVideoProgressesAPIUtils.get(courseId, videoId)
        .then((progressData: OnDemandVideoProgressV1Data) => {
          return progressData.elements[0];
        })
        .fail(() => {
          if (user.isAuthenticatedUser()) {
            return {
              courseId,
              videoId,
              userId: user.get().id,
              viewedUpTo: 0,
            };
          }
          return {};
        })
        .done((progress) => {
          this.setState({
            videoProgress: progress,
          });

          const { viewedUpTo = 0 } = progress;

          const viewedUpToSeconds = viewedUpTo / 1000; // convert from ms to s
          this.setPlaybackTime(viewedUpToSeconds);
        });
    }
  };

  /**
   * Updates player preferences based on stored
   * user preferences
   */
  setUserPreferences = () => {
    const playbackRate = userPreferences.get('playbackRate');
    const volume = userPreferences.get('volume');

    this.player.playbackRate(playbackRate);
    this.player.volume(volume);
  };

  /**
   * Sets the player's playback time
   *
   * @param {number} newTime The new time to set
   */
  setPlaybackTime(newTime: number) {
    // Add some delay, but have the delayed time be at least 0
    const delayedNewTime = Math.max(0, newTime - constants.videoStartPlaybackDelay);
    this.player.currentTime(delayedNewTime);
  }

  /**
   * Updates the stored video progress based on
   * how much of the video a learner has watched
   */
  updateProgress = () => {
    const {
      viewOptions: { course, videoContent },
    } = this.props;

    const videoLength = this.player.duration();
    const currentTime = this.player.currentTime();

    const endzoneStart = videoLength * constants.videoEndPercentage;

    let viewedUpTo = parseInt((this.player.currentTime() * 1000).toString(), 10); // need to pass time in ms
    if (currentTime > endzoneStart) {
      viewedUpTo = 0;
    }

    const { videoId } = videoContent;
    const courseId = course.get('id');
    OnDemandVideoProgressesAPIUtils.update(courseId, videoId, viewedUpTo);
  };

  /**
   * Initializes cuepoints for in-video quizzes (IVQs)
   */
  initializeVideoQuizListeners = () => {
    const {
      viewOptions: { videoQuizModel },
    } = this.props;

    if (videoQuizModel) {
      const { questions = [] } = videoQuizModel;

      const cuepointMap = groupBy(orderBy(questions, 'video.order', 'desc'), 'video.cuePointMs');

      Object.keys(cuepointMap).forEach((cuePointMs) => {
        const questionsAtCuepoint = cuepointMap[cuePointMs];
        const cuePoint = parseInt(cuePointMs, 10) / 1000;

        this.player.addCuepoint({ at: cuePoint, visible: true }, () => {
          const videoQuestions = [...questionsAtCuepoint];
          const scrollContainer = this.getScrollContainer();

          this.player.pause();

          this.player.emitter.trigger('videoQuizView.visible');

          if (scrollContainer) {
            scrollContainer.scrollTop = 0;
          }

          const activeQuestion = videoQuestions.pop();

          this.setState({
            activeQuestion,
            videoQuizQueue: videoQuestions,
          });
        });
      });
    }
  };

  getScrollContainer() {
    return document.querySelector('[data-id="item-scroll-container"]');
  }

  /**
   * Attaches an event listeners that waits for
   * the video to finish
   */
  attachVideoEndedListener = () => {
    const videoLength = this.player.duration();
    const endzoneStart = videoLength * constants.videoEndPercentage;

    this.player.addCuepoint(
      {
        at: endzoneStart,
        to: videoLength,
      },
      (() => {
        let executed = false;
        return () => {
          if (!executed) {
            executed = true;
            const {
              viewOptions: { videoContent, courseProgress },
            } = this.props;

            const itemId = videoContent.itemMetadata.getId();
            const itemProgress = courseProgress.getItemProgress(itemId);

            // The video progress API is asynchronous and can result in inconsistency,
            // Need to optimistically set progress in-memory, and update
            // through the API in the background.
            //
            // If the learner moves to another page, the item progress has been updated
            // in-memory. If the learner refreshes, hopefully the progress API will
            // have finished updating and their new progress will be loaded.
            Q(sendEvent(videoContent, 'ended'))
              .then((response) => {
                if (itemProgress && response && response.itemProgress) {
                  const { executeAction } = this.context;

                  // optimistically set video progress to completed in-memory
                  const videoItemProgress = { ...response.itemProgress, progressState: progressCompleted };
                  itemProgress.set(videoItemProgress);

                  executeAction(updateProgress, {
                    courseProgress,
                  });

                  saveProgressToLocalStorage(courseProgress.get('id'), courseProgress);
                }
              })
              .done();

            const {
              _eventData: {
                namespace: { app },
              },
            } = this.context;
            const tracker = createVideoEventTracker(app, this.player);

            tracker('end');
          }
        };
      })()
    );
  };

  formatVideoSource = (sources: $TSFixMe) => {
    const videoSources = [{ type: 'video/webm', src: sources['video/webm'] }];
    Object.keys(sources)
      .filter((format) => format !== 'video/webm')
      .forEach((type) => {
        videoSources.push({
          type,
          src: sources[type],
        });
      });
    return videoSources;
  };

  resumePlayback = () => {
    const videoLength = this.player.duration();

    this.player.emitter.trigger('videoQuizView.hidden');

    this.setState({
      activeQuestion: null,
    });

    if (videoLength > this.player.currentTime()) {
      this.player.play();
    }
  };

  goToNextIVQorResumePlayback = () => {
    const { videoQuizQueue } = this.state;

    if (videoQuizQueue.length > 0) {
      const activeQuestion = videoQuizQueue.pop();

      if (activeQuestion) {
        this.setState({ activeQuestion, videoQuizQueue });
      }
    } else {
      this.resumePlayback();
    }
  };

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    const {
      viewOptions,
      viewOptions: { course, nextItemMetadataOrItemGroup, verificationDisplay },
      ariaLabel,
      itemMetadata,
    } = this.props;
    const optionsWithPlayer = { ...viewOptions, videoPlayer: this.player };
    const { videoContent, videoQuizModel, autoplay } = optionsWithPlayer;
    const { questions = [] } = videoQuizModel || {};
    const { videoProgress, activeQuestion } = this.state;

    const sources = videoContent.getSources();
    const { subtitlesVtt } = videoContent;

    // currently, new asset service subtitle proxy has full URLs
    // let's strip the domain, until we can figure out complicated CORS issues
    // we have with our video player/subtitles/posters/videos
    // TODO: (billy) move this into the new model after rebase.
    for (const language in subtitlesVtt) {
      if (subtitlesVtt[language] && subtitlesVtt[language].url) {
        // eslint-disable-next-line no-useless-escape
        subtitlesVtt[language].url = subtitlesVtt[language].url.replace(/^https?:\/\/[^\/]+\//, '/');
      }
    }

    const poster = autoplay ? undefined : videoContent.getPosterForResolution('720p');
    const webmSource = sources['video/webm'];

    return (
      <div style={{ position: 'relative' }} onDoubleClick={this.handlePlayerDblClick}>
        <div data-vjs-player>
          {videoQuizModel && (
            <VideoQuiz
              key={activeQuestion?.id}
              onContinue={this.goToNextIVQorResumePlayback}
              itemMetadata={itemMetadata}
              sessionId={videoQuizModel?.sessionId}
              question={activeQuestion}
            />
          )}

          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="vjs-react c-video vjs-fluid vjs-circle-play-centered vjs-coursera-skin vjs-coursera-phoenix-skin video-js"
            crossOrigin="anonymous"
            preload="auto"
            ref={(node) => {
              this.videoNode = node;
            }}
            poster={poster}
            autoPlay={autoplay}
            tabIndex={0}
            aria-label={ariaLabel}
          >
            {webmSource && <source key={sources[webmSource]} type="video/webm" src={webmSource} />}
            {Object.keys(sources)
              .filter((format) => format !== 'video/webm')
              .map((type) => {
                const src = sources[type];
                return <source key={src} type={type} src={src} />;
              })}
            {Object.keys(subtitlesVtt).map((languageCode) => {
              const sub = subtitlesVtt[languageCode];
              return (
                <track key={languageCode} kind="captions" label={_t(sub.label)} src={sub.url} srcLang={languageCode} />
              );
            })}
          </video>

          {this.player && (
            <VideoControlsContainer
              defaultSubtitleLanguage={userPreferences.get('subtitleLanguage')}
              nextItem={nextItemMetadataOrItemGroup}
              courseId={course.get('id')}
              player={this.player}
              videoQuizQuestions={questions}
              verificationDisplay={verificationDisplay}
              itemMetadata={itemMetadata}
            />
          )}

          {this.player && <VideoAnalytics player={this.player} videoProgress={videoProgress} />}
        </div>
      </div>
    );
  }
}

export default compose<Props, Props>(
  Retracked.createTrackedContainer(() => ({
    namespace: {
      app: 'open_course.video',
      page: 'item_layout',
    },
  }))
)(VideoPlayer);
