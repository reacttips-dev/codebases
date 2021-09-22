import SSView from 'core/src/views/base/ss-view';
import Utils from 'core/src/base/utils';
import PlaybackState from 'core/src/models/video/playback-state';
import DialogManager from 'core/src/utils/dialog-manager';
import PlaybackSpeed from 'core/src/models/video/playback-speed';
import PictureInPictureState from 'core/src/models/video/picture-in-picture-state';
import VideoPlaybackSpeedPopoverView from 'core/src/views/popovers/video-playback-speed-popover';
import { shouldRenderPictureInPicture, deferredVideoPlayerTestIsActive, shouldRenderLocdAboveTheFold } from 'core/src/views/modules/flags';
import SubtitleLanguageSelectionView from 'core/src/views/modules/video/subtitle-language-selection-view';
import SubtitleButtonView from 'core/src/views/modules/video/subtitle-button-view';
import SubtitlesState from 'core/src/models/video/subtitles-state';
import SubtitleTextOverlayView from './subtitle-text-overlay-view';
import Volume from './volume';
import 'jquery-cookie';


const TOOLTIP_DELAY = 150;


const VideoPlayer = SSView.extend({

  className: 'video-player-module',

  video: null,
  playbackState: null,
  playbackSpeed: null,
  volume: null,
  pictureInPictureState: null,


  controlBarTransitioning: false,
  // @TODO(optimization) - if we're ever looking for micro-optimizations
  //  to make to the site, we can remove all of the un-used properties here
  videojs: null,
  posterImage: null,
  controlBar: null,
  currentTimeDisplay: null,
  durationDisplay: null,
  progressControl: null,
  seekBar: null,
  loadProgressBar: null,
  playProgressBar: null,
  dummyDivider: null,
  playbackSpeedButton: null,
  fifteenSecondRewindButton: null,
  skillshareButton: null,
  playToggle: null,
  fullscreenToggle: null,
  learnModeToggle: null,
  volumeButton: null,
  subtitlesState: null,
  preventControlBarHide: {},

  // @TODO(optimization) - if we're ever looking for micro-optimizations
  //  to make to the site, we can remove all of the un-used $properties here
  //  (just make sure they're not used elsewhere in the codebase!)
  $videojs: null,
  $posterImage: null,
  $controlBar: null,
  $currentTimeDisplay: null,
  $durationDisplay: null,
  $progressControl: null,
  $seekBar: null,
  $loadProgressBar: null,
  $playProgressBar: null,
  $dummyDivider: null,
  $playbackSpeedButton: null,
  $fifteenSecondRewindButton: null,
  $skillshareButton: null,
  $playToggle: null,
  $fullscreenToggle: null,
  $learnModeToggle: null,
  $volumeButton: null,
  $embedButton: null,
  $playlistCloseButton: null,
  $pipCloseButton: null,
  $bigPlayButton: null,
  $pauseArea: null,

  initialize: function(opts) {
    const options = opts || {};

    _.extend(this, _.pick(options, [
      'video',
      'playbackState',
    ]));

    _.bindAll(this, 'onUnloadHandler', 'syncCurrentPlaybackSpeed', 'syncPlaybackSpeedOnVideoLoad');

    this.initializePlaybackState();
    this.initializePlaybackSpeed();
    this.initializePictureInPictureState();
    window.addEventListener('beforeunload', this.onUnloadHandler);

    this.eventType = Utils.isTouchDevice() ? 'touchend' : 'click';

    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    const _this = this;
    const video = this.$el.children('.vjs-video:first')[0];

    this.ensureVideoJsLoaded(function() {
      // This gets set onto `window` by the `bc` module
      window.bc(video);
      window.videojs(video).ready(function() {
        _this.videojs = this;

        _this.initializeVideoPlayer();

        if (SS.serverBootstrap.showDebugger) {
          _this.initializeVideoPlayerDebugger();
        }

        if (SS.serverBootstrap.forceProgressBar) {
          _this.setPreventControlBarHide('progressBarDebugging', true);
        }

        if (shouldRenderPictureInPicture()) {
          _this.videojs.pip();
        }
      }, true);
    });

    SSView.prototype.afterRender.apply(this, arguments);
  },

  ensureVideoJsLoaded: function(callback) {
    if (window.videojs) {
      callback();
      return;
    }

    this.trigger('video:player:error', 'videojs object not found! Video Player could not be initialized!');
  },

  initializePlaybackState: function() {
    if (_.isNull(this.playbackState)) {
      this.playbackState = new PlaybackState();
    }

    this.listenTo(this.playbackState, 'change:state', this.onPlaybackStateChange);
  },

  initializePlaybackSpeed: function() {
    if (_.isNull(this.playbackSpeed)) {
      this.playbackSpeed = new PlaybackSpeed();
      this.playbackSpeed.fetch();
    }

    this.listenTo(this.playbackSpeed, 'change:playback_speed', this.syncCurrentPlaybackSpeed);
  },

  initializePictureInPictureState: function() {
    if (_.isNull(this.pictureInPictureState)) {
      this.pictureInPictureState = new PictureInPictureState();
    }
  },

  initializeVolume: function() {
    if (_.isNull(this.volume)) {
      this.volume = new Volume();
    }
  },

  initializeVideoPlayerDebugger: function() {
    this.videojs.playerDebugger({
      'logClasses': true,
      'debugAds': false,
    });
  },

  initializeVideoPlayer: function() {
    this.initializeVideojs();
    this.initializePosterImage();
    this.initializeControlBar();
    this.initializeCurrentTimeDisplay();
    this.initializeDurationDisplay();
    this.initializeProgressControl();
    this.initializeSeekBar();
    this.initializeLoadProgressBar();
    this.initializePlayProgressBar();
    this.initializePlaybackSpeedButton();
    this.initializeFifteenSecondRewindButton();
    this.initializeVolumeButton();
    this.initializePlayToggle();
    this.initializeFullscreenToggle();
    this.initializeVolume();
    this.initializeBigPlayButton();

    this.listenTo(this, 'video:player:ready', this.onReady);
    this.listenTo(this, 'video:player:videoLoaded', this.onVideoLoaded);
    this.listenTo(this, 'video:player:metadataLoaded', this.onMetadataLoaded);
    this.listenTo(this, 'video:player:play', this.onPlay);
    this.listenTo(this, 'video:player:pause', this.onPause);
    this.listenTo(this, 'video:player:ended', this.onEnded);
    this.listenTo(this, 'video:player:windowClosed', this.onWindowClosed);
    this.listenTo(this, 'video:player:playbackSpeedButtonClick', this.onPlaybackSpeedButtonClick);
    this.listenTo(this, 'video:player:fifteenSecondRewindButtonClick', this.onFifteenSecondRewindButtonClick);
    this.listenTo(this, 'video:player:controlBarItemClick', this.onControlBarItemClick);
    this.listenTo(this, 'video:player:fullscreenChange', this.onFullscreenChange);
    this.listenTo(this, 'video:player:mouseEnter', this.onMouseEnterEvent);
    this.listenTo(this, 'video:player:mouseLeave', this.onMouseLeaveEvent);
    this.listenTo(this, 'video:player:keyDown', this.onKeyDownEvent);
    this.listenTo(this, 'video:player:contextMenu', this.onContextMenuEvent);
    this.listenTo(this, 'video:player:volumeChange', this.onVolumeChange);
    this.listenTo(this, 'video:player:pipactive', this.onPictureInPictureActive);
    this.listenTo(this, 'video:player:pipinactive', this.onPictureInPictureInactive);

    this.trigger('video:player:ready');
  },

  initializeVideojs: function() {
    this.videojs.on('play', () => {
      this.trigger('video:player:play');
    });

    this.videojs.on('volumechange', (event) => {
      this.trigger('video:player:volumeChange', event);
    });

    this.videojs.on('pause', () => {
      this.trigger('video:player:pause');
    });

    this.videojs.on('windowClosed', () => {
      this.trigger('video:player:windowClosed');
    });

    this.videojs.on('ended', () => {
      this.trigger('video:player:ended');
    });

    this.videojs.on('fullscreenchange', () => {
      this.trigger('video:player:fullscreenChange');
    });

    this.videojs.on('timeupdate', () => {
      this.trigger('video:player:timeUpdate', this.getCurrentTime());
    });

    this.videojs.on('loadedmetadata', () => {
      this.trigger('video:player:metadataLoaded');
    });

    this.videojs.on('pipactive', () => {
      this.trigger('video:player:pipactive');
    });

    this.videojs.on('pipinactive', () => {
      this.trigger('video:player:pipinactive');
    });

    this.$videojs = $(this.videojs.el());

    this.$videojs.on('mouseenter', (event) => {
      this.trigger('video:player:mouseEnter', event);
    });

    this.$videojs.on('mouseleave', (event) => {
      this.trigger('video:player:mouseLeave', event);
    });

    this.$videojs.on('keydown', (event) => {
      this.trigger('video:player:keyDown', event);
    });

    this.$videojs.on('contextmenu', (event) => {
      this.trigger('video:player:contextMenu', event);
    });
  },

  initializePosterImage: function() {
    this.posterImage = this.videojs.posterImage;
    this.$posterImage = $(this.posterImage.el());
  },

  initializeControlBar: function() {
    const _this = this;

    this.controlBar = this.videojs.controlBar;
    this.$controlBar = $(this.controlBar.el());
    this.controlBar.getChild('LiveDisplay').hide();
    this.controlBar.getChild('SeekToLive').hide();

    this.$controlBar.on(Utils.getTransitionEndEvent(), function() {
      _this.controlBarTransitioning = false;
      _this.hideControlBarTooltips();
    });
  },

  initializeEmbedButton: function() {
    const _this = this;

    this.$videojs.append('<div class="video-share-button hover-button btn extra-small black transparent ss-icon-share with-icon">Embed</div>');

    this.$embedButton = this.$videojs.find('.video-share-button:first');

    this.$embedButton.on('click', function() {
      _this.trigger('video:player:embedButtonClick');
    });
  },

  initializePlaylistCloseButton: function() {
    if (shouldRenderLocdAboveTheFold()) {
      return
    }

    this.$videojs.append('<div class="playlist-close-button video-helper-button hover-button"><svg class="ss-svg-icon playlist-icon"><use xlink:href="#playlist" /></svg><svg class="ss-svg-icon fullscreen-icon"><use xlink:href="#fullscreen" /></svg></div>');

    this.$playlistCloseButton = this.$videojs.find('.playlist-close-button');

    this.$playlistCloseButton.on('click', () => {
      this.trigger('video:player:playlistCloseButtonClick');
      this.dismissSelectionMenus();
    });
  },

  initializePIPCloseButton: function() {
    this.$videojs.append('<div class="pip-close-button video-helper-button hover-button"><svg class="ss-svg-icon"><use xlink:href="#close" /></svg></div>');

    this.$pipCloseButton = this.$videojs.find('.pip-close-button');

    this.$pipCloseButton.on('click', () => {
      this.videojs.pip().deactivate();
      SS.EventTracker.track('Clicked-ClosePictureInPicture', '', this.getTrackingParams());
    });
  },

  initializeCurrentTimeDisplay: function() {
    this.currentTimeDisplay = this.controlBar.getChild('currentTimeDisplay');
    this.$currentTimeDisplay = $(this.currentTimeDisplay.el());
  },

  initializeDurationDisplay: function() {
    this.durationDisplay = this.controlBar.getChild('durationDisplay');
    this.$durationDisplay = $(this.durationDisplay.el());
  },

  initializeProgressControl: function() {
    this.progressControl = this.controlBar.getChild('progressControl');
    this.$progressControl = $(this.progressControl.el());
  },

  initializeSeekBar: function() {
    this.seekBar = this.progressControl.getChild('seekBar');
    this.$seekBar = $(this.seekBar.el());
  },

  initializeLoadProgressBar: function() {
    this.loadProgressBar = this.seekBar.getChild('loadProgressBar');
    this.$loadProgressBar = $(this.loadProgressBar.el());
  },

  initializePlayProgressBar: function() {
    this.playProgressBar = this.seekBar.getChild('playProgressBar');
    this.$playProgressBar = $(this.playProgressBar.el());
  },

  initializeVolumeButton: function() {
    this.volumeButton = this.controlBar.getChild('volumePanel');
    this.$volumeButton = $(this.volumeButton.el());

    this.$volumeButton.attr({
      rel: 'tooltip',
      'data-title': 'Volume',
    }).data('ss-tooltip-delay', TOOLTIP_DELAY);
  },

  initializePlaybackSpeedButton: function() {
    const _this = this;

    this.playbackSpeedButton = this.controlBar.addChild('Button');
    this.$playbackSpeedButton = $(this.playbackSpeedButton.el());

    this.playbackSpeedButton.addClass('vjs-play-speed');

    this.playbackSpeedButton.on(this.eventType, function() {
      _this.trigger('video:player:playbackSpeedButtonClick');
      _this.trigger('video:player:controlBarItemClick');
    });

    this.$playbackSpeedButton.text(this.playbackSpeed.defaultPlaybackSpeedLabel);

    new VideoPlaybackSpeedPopoverView({
      anchor: this.$playbackSpeedButton,
      el: $('.playback-speed-popover'),
      model: this.playbackSpeed,
      videoPlayer: this,
      HOVER_OPEN_DELAY: 0,
    });
  },

  initializePlaybackSpeedTooltip: function() {
    const playbackSpeed = this.playbackSpeed.getCurrentPlaybackSpeed();

    if (playbackSpeed.value === 1) {
      return;
    }

    const tooltipTitle = 'Playing at ' + playbackSpeed.label;
    this.$playbackSpeedButton.attr({
      rel: 'tooltip',
      'data-original-title': tooltipTitle,
      'data-trigger': 'manual',
    });

    this.onMouseEnterEvent();
    this.setPreventControlBarHide('playbackSpeedTooltip', true);

    const _this = this;
    setTimeout(function() {
      _this.$playbackSpeedButton.tooltip('show');

      setTimeout(function() {
        _this.$playbackSpeedButton.tooltip('destroy');
        _this.setPreventControlBarHide('playbackSpeedTooltip', false);
        _this.onMouseLeaveEvent();
      }, 4000);
    }, 1000);
  },

  initializeBigPlayButton: function() {
    if (shouldRenderPictureInPicture()) {
      const pauseAreaClass = 'pip-pause-area';
      this.$bigPlayButton = this.$videojs.find('.vjs-big-play-button');
      this.$bigPlayButton.append(`<div class="${pauseAreaClass}"></div>`);
      this.$pauseArea = this.$videojs.find(`.${pauseAreaClass}`);
      this.$pauseArea.on(this.eventType, (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.pause();
      });
    }
  },

  onPlaybackSpeedDialogClose: function() {
    this.setPreventControlBarHide('playbackSpeedDialog', false);
    this.trigger('video:player:playbackSpeedDialogClosed');
  },

  onVolumeChange: function() {
    if(this.videojs && !this.videoIsLoading) {
      this.setVideoVolume(this.videojs.volume());
      this.setVideoVolumeMuted(this.videojs.muted());
    }

    this.dismissSelectionMenus();
  },

  hideDialogs: function() {
    DialogManager.removeCurrentDialogView();
    this.setPreventControlBarHide('playbackSpeedDialog', false);
  },

  setPreventControlBarHide: function(element, hide) {
    this.preventControlBarHide[element] = hide;
  },

  getPreventControlBarHide: function() {
    if (_.indexOf(_.values(this.preventControlBarHide), true) !== -1) {
      return true;
    } else {
      return false;
    }
  },

  initializeFifteenSecondRewindButton: function() {
    const _this = this;

    this.fifteenSecondRewindButton = this.controlBar.addChild('Button');
    this.$fifteenSecondRewindButton = $(this.fifteenSecondRewindButton.el());

    this.fifteenSecondRewindButton.addClass('vjs-fifteen-second-rewind');

    this.fifteenSecondRewindButton.on(this.eventType, function() {
      _this.trigger('video:player:fifteenSecondRewindButtonClick');
      _this.trigger('video:player:controlBarItemClick');
    });

    this.$fifteenSecondRewindButton.attr({
      rel: 'tooltip',
      'aria-label': '15-Second Rewind',
      'data-title': '15-Second Rewind',
    }).data('ss-tooltip-delay', TOOLTIP_DELAY);
  },

  initializeSkillshareButton: function() {
    const _this = this;

    this.skillshareButton = this.controlBar.addChild('Button');
    this.$skillshareButton = $(this.skillshareButton.el());

    this.skillshareButton.addClass('vjs-skillshare-button');

    this.skillshareButton.on('click', function() {
      _this.trigger('video:player:skillshareButtonClick');
      _this.trigger('video:player:controlBarItemClick');
    });
  },

  initializePlayToggle: function() {
    const _this = this;

    this.playToggle = this.controlBar.getChild('playToggle');
    this.$playToggle = $(this.playToggle.el());

    this.playToggle.on('click', function() {
      _this.trigger('video:player:playToggleClick');
      _this.trigger('video:player:controlBarItemClick');
    });

    this.$playToggle.attr({
      rel: 'tooltip',
      'data-title': 'Play',
    }).data('ss-tooltip-delay', TOOLTIP_DELAY);
  },

  initializeFullscreenToggle: function() {
    const _this = this;

    this.fullscreenToggle = this.controlBar.getChild('fullscreenToggle');
    this.$fullscreenToggle = $(this.fullscreenToggle.el());

    this.fullscreenToggle.on('click', function() {
      _this.trigger('video:player:fullscreenToggleClick');
      _this.trigger('video:player:controlBarItemClick');
    });

    this.$fullscreenToggle.attr({
      rel: 'tooltip',
      'data-title': 'Full Screen',
    }).data('ss-tooltip-delay', TOOLTIP_DELAY);
  },

  initializeLearnModeToggle: function() {
    const _this = this;

    let isNotesEnabled = SS.serverBootstrap.pageData.videoPlayerData.isNotesEnabled;
    if (!isNotesEnabled) {
      return;
    }

    this.learnModeToggle = this.controlBar.addChild('Button');
    this.$learnModeToggle = $(this.learnModeToggle.el());

    this.$learnModeToggle.addClass('vjs-learn-mode');

    this.$learnModeToggle.on('click', function() {
      _this.trigger('video:player:learnModeToggleClick');
      _this.trigger('video:player:controlBarItemClick');
    });

    this.$learnModeToggle.attr({
      rel: 'tooltip',
      'aria-label': 'View All Notes',
      'data-title': 'View All Notes',
    }).data('ss-tooltip-delay', TOOLTIP_DELAY);
  },

  initializeSubtitlesView: function() {
    const button = this.controlBar.addChild('Button');
    button.addClass('vjs-transcript-mode');

    this.subtitlesState = new SubtitlesState();

    this.listenTo(this.subtitlesState, 'change', this.displaySelectedSubtitle);
    this.listenTo(this.subtitlesState, 'trackSelectedLanguageChange', this.trackSelectedLanguageChange);

    new SubtitleButtonView({model: this.subtitlesState, el: button.el()});

    let textTrackView = this.$videojs.find('.vjs-text-track-display');
    new SubtitleTextOverlayView({model: this.subtitlesState, el: textTrackView})

    new SubtitleLanguageSelectionView({
      container: this.$controlBar,
      anchor: $(button.el()),
      model: this.subtitlesState,
    });
  },

  initializePlayerSeparator: function() {
    // TODO: follow pattern of initializing/cacheing other buttons/dividers
    this.$controlBar.append('<div class="vjs-player-separator"></div>');
  },

  blockForWindowClose: function(delay) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay){;}
  },

  onUnloadHandler: function() {
    this.trigger('video:player:windowClosed');
    this.blockForWindowClose(60);
  },

  resetVideoPlayer: function() {
    // Temporary fix for SourceBuffer error when switching lessons.
    this.videojs.reset();
  },

  updateVideoPoster: function(mediaobject, poster) {
    return {
      ...mediaobject,
      thumbnail: poster,
      poster_sources: [poster],
      poster,
    };
  },

  loadVideo: function() {
    // If we sync the volume while the video is loading,
    // the volume returns to the default level.
    // By setting videoIsLoading we can track the state of the videojs player,
    // and update the player's volume after it finishes loading.
    this.videoIsLoading = true;
    this.resetVideoPlayer();
    this.videojs.catalog.getVideo(this.video.get('platform_video_id'), (error, vid) => {
      if (error) {
        // TODO: handle this?
        return;
      }

      const videoData = this.updateVideoPoster(vid, this.video.getThumbnailForVideoPlayer());

      this.videojs.catalog.load(videoData);
      this.trigger('video:player:videoLoaded');
      this.videoIsLoading = false;
    });
  },

  hideControlBarTooltips: function() {
    this.$fifteenSecondRewindButton.tooltip('hide');
    this.$playToggle.tooltip('hide');
    this.$fullscreenToggle.tooltip('hide');
    this.$volumeButton.tooltip('hide');

    if (this.$learnModeToggle) {
      this.$learnModeToggle.tooltip('hide');
    }
  },

  dismissSelectionMenus: function() {
    if(!this.subtitlesState) {
      return;
    }

    this.subtitlesState.set('isSelectingLanguage', false);
  },

  setPosterImage: function(url) {
    let backgroundImage = 'none';

    if (url) {
      backgroundImage = 'url("' + url + '")';
    }

    this.$posterImage.css(
      'cssText',
      'background-image:' + backgroundImage + ' !important'
    );

    this.$posterImage.removeClass('vjs-hidden');
  },

  updatePlayerComponents: function() {
    this.currentTimeDisplay.updateContent();
    this.durationDisplay.updateContent();
  },

  load: function() {
    this.videoIsLoading = true;
    this.resetVideoPlayer();
    this.videojs.load();
  },

  play: function() {
    this.videojs.play()
      .catch(() => {
        this.trigger('video:player:initializeToStartView');
        SS.EventTracker.track('Received-VideoPlaybackBlocked', '', this.getTrackingParams());
      });
  },

  pause: function() {
    this.videojs.pause();
  },

  togglePlayPause: function() {
    if (this.videojs.paused() || this.videojs.ended()) {
      this.play();
    } else {
      this.pause();
    }
  },

  isPlaying: function() {
    return !this.videojs.paused() && !this.videojs.ended();
  },

  stop: function() {
    if (this.isPlaying()) {
      this.pause();
    }
    if (this.getCurrentTime() != 0) {
      this.setCurrentTime(0);
    }
  },

  isFullscreen: function() {
    return document.fullscreenElement !== null;
  },

  exitFullscreen: function() {
    if (this.isFullscreen()) {
      this.videojs.exitFullscreen();
    }
  },

  replay: function() {
    this.stop();
    this.play();
  },

  getDuration: function() {
    let duration = parseInt(this.videojs.duration(), 10);

    if (_.isNaN(duration) || duration < 0) {
      duration = 0;
    }

    return duration;
  },

  getCurrentTime: function() {
    let currentTime = parseInt(this.videojs.currentTime(), 10);

    if (_.isNaN(currentTime) || currentTime < 0) {
      currentTime = 0;
    }

    return currentTime;
  },

  setCurrentTime: function(currentTimeStr) {
    let currentTime = parseInt(currentTimeStr, 10);

    if (_.isNaN(currentTime) || currentTime < 0) {
      currentTime = 0;
    }

    this.videojs.currentTime(currentTime);
  },

  setCurrentPlaybackSpeed: function(playbackSpeed) {
    this.playbackSpeed.setCurrentPlaybackSpeed(playbackSpeed);
  },

  syncCurrentPlaybackSpeed: function() {
    const playbackSpeed = this.playbackSpeed.getCurrentPlaybackSpeed();
    if (this.videojs) {
      this.videojs.playbackRate(playbackSpeed.value);
      this.$playbackSpeedButton.text(playbackSpeed.label);
    }
  },

  setVideoVolume: function(volume) {
    this.volume.setCurrentVolume(volume);
  },

  setVideoVolumeMuted: function(muted) {
    this.volume.setMuted(muted);
  },

  getVideoVolume: function() {
    return this.volume.getCurrentVolume();
  },

  getVideoVolumeMuted: function() {
    const localMutedState = this.volume.getMuted();

    const isMuted = SS.currentUser.isGuest() ? !deferredVideoPlayerTestIsActive() : true;
    return (localMutedState === null) ? isMuted : localMutedState;
  },

  syncCurrentVolume: function() {
    const volume = this.getVideoVolume();
    const muted = this.getVideoVolumeMuted();
    if (this.videojs) {
      this.videojs.muted(muted);
      this.videojs.volume(volume);
    }
  },

  getVideoThumbnailImageURL: function() {
    return this.video.getThumbnailForVideoPlayer();
  },

  updateTooltip: function($el, title) {
    $el.attr('title', title).tooltip('fixTitle');
  },

  onPlaybackStateChange: function() {
    this.hideControlBarTooltips();
    this.dismissSelectionMenus();
  },

  onReady: function() {
    // Remove the `tabindex` attribute from elements within
    // the videojs element
    this.syncCurrentVolume();
    this.$videojs.find('[tabindex]').removeAttr('tabindex');

    // We need to add a `tabindex` attribute to the videojs element
    // so that the `keydown` event listener will fire
    this.$videojs.attr('tabindex', 0);

    this.loadVideo();
  },

  onVideoLoaded: function() {
    this.setPosterImage(this.video.getThumbnailForVideoPlayer());
    this.updatePlayerComponents();
    this.syncCurrentVolume();
    this.setSubtitleLanguageOptions(this.getSubtitleTextTracks());
  },

  onMetadataLoaded: function() {
    this.syncCurrentVolume();
    if (this.playbackSpeed.getCurrentPlaybackSpeed()) {
      this.syncPlaybackSpeedOnVideoLoad();
    } else {
      this.playbackSpeed.once('change:playback_speed', this.syncPlaybackSpeedOnVideoLoad);
    }

    this.updatePlayerComponents();
  },

  syncPlaybackSpeedOnVideoLoad: function() {
    this.syncCurrentPlaybackSpeed();
    this.initializePlaybackSpeedTooltip();
  },

  getTrackingParams: function() {
    const params = SS.EventTracker.classDetails();
    if (SS.serverBootstrap.classData && SS.serverBootstrap.classData.sku) {
      params.parentClassSku = SS.serverBootstrap.classData.sku;
    }
    if (shouldRenderPictureInPicture()) {
      return {
        ...params,
        is_picture_in_picture_active: this.pictureInPictureState.isActive(),
      };
    }
    return params;
  },


  togglePlaylistCloseButton: function() {
    this.$playlistCloseButton.toggle();
  },

  onPlay: function() {
    this.updateTooltip(this.$playToggle, 'Pause');
    this.playbackState.setPlaying();
    SS.EventTracker.track('Played-Video', '', this.getTrackingParams());

    /**
     * On Safari, makes sure subtitle options are properly loaded before playback
     * otherwise they won't render properly,
     */
    this.setSubtitleLanguageOptions(this.getSubtitleTextTracks());
  },

  onPause: function() {
    this.updateTooltip(this.$playToggle, 'Play');
    this.playbackState.setPaused();
    SS.EventTracker.track('Paused-Video', '', this.getTrackingParams());
  },

  onWindowClosed: function() {
    this.playbackState.setPaused();
  },

  onEnded: function() {
    this.playbackState.setEnded();
    this.hideDialogs();
  },

  onPlaybackSpeedButtonClick: function() {
    this.setCurrentPlaybackSpeed(this.playbackSpeed.getNextPlaybackSpeed());
    this.dismissSelectionMenus();
  },

  onFifteenSecondRewindButtonClick: function() {
    this.setCurrentTime(this.getCurrentTime() - 15);
    this.dismissSelectionMenus();
  },

  onControlBarItemClick: function() {
    this.hideControlBarTooltips();
  },

  onFullscreenChange: function() {
    if (this.isFullscreen()) {
      this.$el.addClass('fullscreen');

      this.$fullscreenToggle.addClass('vjs-minimize-video');
      this.updateTooltip(this.$fullscreenToggle, 'Minimize');
    } else {
      this.$el.removeClass('fullscreen');

      this.$fullscreenToggle.removeClass('vjs-minimize-video');
      this.updateTooltip(this.$fullscreenToggle, 'Full Screen');
    }

    this.hideControlBarTooltips();
    this.dismissSelectionMenus();
  },

  onMouseEnterEvent: function() {

    this.$videojs.removeClass('vjs-user-mouseout');
    this.$videojs.removeClass('vjs-user-inactive');
    this.$videojs.addClass('vjs-user-active');
    if (this.$videojs.hasClass('has-started')) {this.controlBarTransitioning = true;}

    this.hideControlBarTooltips();
  },

  onMouseLeaveEvent: function() {

    if (this.getPreventControlBarHide()) {
      return;
    }

    this.$videojs.addClass('vjs-user-mouseout');
    this.$videojs.addClass('vjs-user-inactive');
    this.$videojs.removeClass('vjs-user-active');
    if (this.$videojs.hasClass('has-started')) {this.controlBarTransitioning = true;}

    this.hideControlBarTooltips();
    this.dismissSelectionMenus();
  },

  onKeyDownEvent: function(event) {
    const keyCode = event.which;

    if (keyCode === 32) {
      event.preventDefault();
      this.togglePlayPause();

      return false;
    }

    return true;
  },

  onContextMenuEvent: function() {
    return true;
  },

  onPictureInPictureActive: function() {
    this.pictureInPictureState.setActive();
    SS.EventTracker.track('Activated-PictureInPicture', '', this.getTrackingParams());
  },

  onPictureInPictureInactive: function() {
    this.pictureInPictureState.setInactive();
    SS.EventTracker.track('Deactivated-PictureInPicture', '', this.getTrackingParams());
  },

  setSubtitleLanguageOptions: function(textTracks) {
    const languageOptions = textTracks.map(({language, label, "default": isDefault}) => ({
        id: language,
        isDefault,
        label
    }));

    this.subtitlesState.set('languageOptions', languageOptions);
    this.displaySelectedSubtitle();
  },

  displaySelectedSubtitle: function() {
    const textTracks = this.getSubtitleTextTracks();

    if (!textTracks.length) {
      return;
    }

    const selectedLanguageId = this.subtitlesState.get('selectedLanguage').id;

    textTracks.forEach(item => {
      const isMatch = this.subtitlesState.isLanguageMatch(item.language, selectedLanguageId);

      if (isMatch) {
        item.mode = 'showing';
      }
      else {
        item.mode = 'disabled';
      }
    });
  },

  trackSelectedLanguageChange: function(args) {
    if (args.isMultiLanguageSubtitlesEnabled) {
      this.trackSelectedSubtitlesEvent(args);
    } else {
      this.trackLegacySubtitlesEvent();
    }
  },

  trackSelectedSubtitlesEvent: function(args) {
    const sourceLanguage = args.oldValue ?? "Subtitles Off"
    const targetLanguage = args.newValue ?? "Subtitles Off"
    const classId = '' + SS.serverBootstrap.classData.id;
    const videoId = '' + this.video.get('platform_video_id');

    const params = {
      source_language: sourceLanguage,
      target_language: targetLanguage,
      class_id: classId,
      video_id: videoId,
      schema: "classes/selected-subtitles.v1.0.0.schema.json"
    };

    const user_uid = SS.serverBootstrap.userData.id;
    if (user_uid) {
      params.user_uid = '' + user_uid;
    }

    SS.EventTracker.track('Selected-Subtitles', '', params);
  },

  trackPlayLessonEvent: function(session) {
    const selectedLanguageId = this.subtitlesState.get('selectedLanguage').id;
    const selectedLanguageSource = this.subtitlesState.get('selectedLanguage').source;
    const textTracks = this.getSubtitleTextTracks();
    const languageOptions = textTracks.map(({language}) => (language));
    const numSessions = session?.unit?.sessions?.length || 0;
    const currentRank = session?.attributes?.rank || null;
    const playbackSpeed = this.playbackSpeed.getCurrentPlaybackSpeed()?.value;
    const isPremium = (SS.currentUser && SS.currentUser.isPremiumMember());
    const isLastLesson = session.unit ? currentRank === numSessions - 1 : null;
    const isFullscreen = this.isFullscreen();

    const params = {
      sku: this.parentClass ? this.parentClass.sku : null,
      video: session.get('id'),
      videoIndex: session.get('rank'),
      overall_index: session.get('overallRank'),
      lessonIndex: currentRank,
      lastLesson: isLastLesson,
      playback_speed: playbackSpeed,
      full_screen: isFullscreen,
      is_premium: isPremium,
      subtitle_selection_source: selectedLanguageSource,
      subtitle_language: selectedLanguageId ?? "off",
      subtitles_available: languageOptions
    };

    const fullParams = SS.EventTracker.classDetails(params);
    SS.EventTracker.track('Played Lesson Video', '', fullParams);
  },

  trackLegacySubtitlesEvent: function() {
    if (this.subtitlesState.languageIsSelected()) {
      SS.EventTracker.track('Enable Captions', '', this.getTrackingParams());
    } else {
      SS.EventTracker.track('Disable Captions', '', this.getTrackingParams());
    }
  },

  getSubtitleTextTracks: function() {
    const textTracks = this.videojs.textTracks().tracks_;

    return textTracks.filter(({ kind }) => {
      return kind === 'subtitles' || kind === 'captions';
    });
  },

  hasTextTracks: function() {
    return this.getSubtitleTextTracks().length > 0
  }
});

export default VideoPlayer;
