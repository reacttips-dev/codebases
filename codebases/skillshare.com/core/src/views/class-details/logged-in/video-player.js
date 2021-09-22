import SSView from 'core/src/views/base/ss-view';
import Common from 'core/src/common';
import Utils from 'core/src/base/utils';
import VideoPlayer from 'core/src/views/modules/video/player';
import VideoPlayerNotesBar from 'core/src/views/modules/video/player-notes-bar';
import VideoPlayerFullscreenControls from 'core/src/views/modules/video/player-fullscreen-controls';
import VideoPlaylist from 'core/src/views/modules/video/playlist';
import ShareLinksView from 'core/src/views/modules/share-links';
import VideoRollOverlayUpgradeView from 'core/src/views/modules/video-roll-overlay-upgrade';
import VideoRollOverlayCountdownView from 'core/src/views/modules/video-roll-overlay-countdown';
import VideoEmbedPopupView from 'core/src/views/popups/video-embed-popup';
import NoteForm from 'core/src/views/forms/note-form';
import MyNotesPopupView from 'core/src/views/popups/my-notes-popup';
import VideoUnitsCollection from 'core/src/collections/video-units';
import VideoSessionsCollection from 'core/src/collections/video-sessions';
import FreemiumUsageTracker from 'core/src/models/freemium-usage-tracker';
import Note from 'core/src/models/note';
import modelAdapter from 'core/src/utils/model-adapter';
import lockedTemplate from 'text!core/src/templates/modules/video-player/_video-player-locked.mustache';
import lockedCTATemplate from 'text!core/src/templates/modules/video-player/_video-player-cta.mustache';
import Mustache from 'mustache';
import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultThemeProvider } from '@skillshare/ui-components/themes';
import { SkillshareOriginalBadge, SkillshareStaffPickBadge } from '@skillshare/ui-components/components/badges';
import { AudioBadge } from '@skillshare/ui-components/badges';
import { initializeGamificationToast, GAMIFICATION_ACTION_STEPS } from 'core/src/helpers/gamification-helper';
import { shouldRenderLocdAboveTheFold } from 'core/src/views/modules/flags';

const VideoPlayerView = SSView.extend({
  baseUrl: null,
  defaultPrivacyStatus: 1,
  inEditMode: false,
  myNotesPopupView: null,
  noteForm: null,
  parentClass: null,
  playerIsLocked: false,
  pausedByTakeover: false,
  session: null,
  sessionsStarted: null,
  shareLinks: null,
  shareLinksView: null,
  isNotesEnabled: false,
  timeTracker: null,
  units: null,

  videoPlayer: null,
  videoPlayerFullscreenControls: null,
  videoPlayerMetaDataLoaded: null,
  videoPlayerNotesBar: null,
  videoPlayerReady: null,
  videoPlaylist: null,
  videoRollOverlay: null,
  $startView: null,

  initialize: function(...args) {
    this.isNotesEnabled = SS.serverBootstrap.pageData.videoPlayerData.isNotesEnabled;

    this.initializeVideoPlayerReady();
    this.initializeParentClass();
    this.initializeUnits();
    this.initializeSession();
    this.initializeJoinModule();
    this.initializePremiumUpgradeData();
    this.initializeShareLinks();
    this.initializeTimeTracker();
    this.initializeSessionsStarted();
    this.initializePlayerIsLocked();
    this.initializeStartView();
    this.renderBadge();

    this.$viewport = this.$('.viewport:first');
    this.$lockedView = this.$('.locked-view:first');
    this.$shareLinks = this.$('.share-links-wrapper:first');
    this.$unitList = this.$('.unit-list-wrapper:first');
    this.$playlist = this.$('.playlist:first');
    this.$noteForm = this.$('.note-form-wrapper:first');

    if (this.playerIsLocked) {
      this.$el.addClass('locked');
    }

    SS.events.on('takeover:video:pause', () => {
      if(!this.videoPlayer.playbackState.isPaused()) {
        this.videoPlayer.pause();
        this.pausedByTakeover = true;
      }
    });
    SS.events.on('takeover:video:play', () => {
      if(this.pausedByTakeover) {
        this.videoPlayer.play();
        this.pausedByTakeover = false;
      }
    });

    SSView.prototype.initialize.call(this, ...args);
  },

  initializeParentClass: function() {
    this.parentClass = new Backbone.Model(SS.serverBootstrap.classData.parentClass);
  },

  renderBadge: function() {
    const {headerData} = SS.serverBootstrap.pageData;
    const badgeComponent = this.buildBadgeComponent(headerData);
    const badgeContainers = document.querySelectorAll('.class-details-header-badge');
    if (badgeContainers.length) {
      badgeContainers.forEach((el) => this.renderReactBadge(badgeComponent, el))
    }
  },

  buildBadgeComponent: function(headerData) {
    if (headerData.isStaffPick) {
      return <SkillshareStaffPickBadge />;
    }
    if (headerData.isSkillshareOriginal) {
      return <SkillshareOriginalBadge />;
    }
    if(headerData.is_audio_only) {
      return <AudioBadge />;
    }
    return '';
  },

  renderReactBadge: function(badgeComponent, container) {
    if (!container) {
      return;
    }

    ReactDOM.render(
      <DefaultThemeProvider>
        {badgeComponent}
      </DefaultThemeProvider>,
      container
    );
  },

  initializeUnits: function() {
    this.units = new VideoUnitsCollection(SS.serverBootstrap.pageData.unitsData.units, {
      parse: true,
    });
  },

  initializeSession: function() {
    if (!this.units) {
      // bail if there are no units (something went pretty wrong)
      return;
    }

    const sessionAttributes = SS.serverBootstrap.pageData.videoPlayerData.startingSession;

    // We only have one unit and it's at index 0.
    const unit = this.units.at(0);

    if (sessionAttributes && unit) {
      // if we have a bootstrapped session and a backing unit,
      //   use that as the initial session
      this.session = unit.sessions.get(sessionAttributes.id);
    }

    if (!this.session) {
      // if there isn't a specific video, use the first
      this.session = unit.sessions.at(0);
    }

    if (!this.session) {
      // this shouldn't occur (famous last words), but if it does,
      //   just bail instead of throwing errors all over the place
      return;
    }

    this.session.unit = unit;

    this.session.notes.once('set', function() {

      this.listenTo(this.session.notes, 'remove', this.onSessionNoteRemove);

      this.initializeVideoPlayer();

      this.videoPlayerReady.then(() => this.initializeVideoPlaylist());

    }, this);

    this.session.notes.fetchSet();
  },

  initializeJoinModule: function() {
    this.joinModule = SS.serverBootstrap.pageData.headerData.joinModule;
  },

  initializePremiumUpgradeData: function() {
    this.premiumUpgradeData = SS.serverBootstrap.premiumUpgradeData;
  },

  initializeShareLinks: function() {
    if (_.isNull(this.shareLinks)) {
      this.shareLinks = new Backbone.Model(_.extend({
        units: this.units,
        parentClass: this.parentClass,
      }, SS.serverBootstrap.pageData.videoPlayerData.shareLinks));
    }

    if (this.shareLinksView) {
      this.shareLinksView.remove();
    }

    this.shareLinksView = new ShareLinksView({
      el: this.$shareLinks,
      model: this.shareLinks,
      session: this.session,
    });
  },

  initializeTimeTracker: function() {
    this.timeTracker = new FreemiumUsageTracker();
    this.timeTracker.on('saved', ({ sessionId, shouldComplete }) => {
      if (shouldComplete) {
        const session = this.units.getFlattenedSessions().find(({ id }) => sessionId === id);
        session.trigger('shouldComplete');
        if (!this.completedAllUnits()) {
          setTimeout(() => {
            initializeGamificationToast(GAMIFICATION_ACTION_STEPS.WATCH_THREE_LESSONS, true);
          }, 1000);
        }
      }
    });
  },

  initializeSessionsStarted: function() {
    this.sessionsStarted = new Backbone.Model();
  },

  initializeVideoPlayer: function() {
    this.baseUrl = SS.serverBootstrap.pageData.videoPlayerData.baseUrl;

    /**
       * This next block is a massive hack.
       * The idea is that when a user is logged out or not enrolled in a class
       *   (this could be googlebot as well), and they go to a specific video in a class
       *   (...?videoId=12345678), the video player doesn't know how to handle
       *   being initialized with a video it can't immediately play.
       *
       * To get around this, we initialize the video-player with the first video
       *   in the class, which is always publicly viewable, because it's the intro.
       *
       * The actual `this.session` object is still the locked video. The is
       *   important because we want learn mode and transcripts to load for the
       *   correct session regardless of what the video player was initialized with.
       *
       * This isn't really an issue for normal users, so the fact that the video player
       *   isn't in a "locked" state isn't a high priority. Pretty much the only
       *   reason this case would happen is in the case of googlebot reaching the page
       *   from a transcripts sitemap link, which looks something like this:
       *   /classes/design/my-class-desc/2140216980?videoId=2431916&transcript=1
       *
       * We want the (bootstrapped) transcripts to load immediately for the correct
       *   video, and we don't want any JS errors on the page (not good for googlebot).
       *
       * This hack solves this specific use case. In the future we should refactor
       *   video-player such that it can be initialized with a locked video.
       *   And then everyone will be happy.
       *
       * @TODO(shrugs) - refactor video-player to support initialization using
       * potentially locked videos, but keep the external-facing API the same
       */

    let { session } = this;
    if (!this.isVideoUnlocked()) {
      session = this.units.getSessionAtIndex(0);
      // additionally, track this event in mixpanel
      //   to see if logged in users are hitting it
      SS.EventTracker.track('Directly Viewed Locked Video', {}, {
        isLoggedIn: !SS.currentUser.isGuest() === 'true' ? true : false,
      });
    }

    /**
       * End hack.
       */

    this.videoPlayer = new VideoPlayer({
      el: this.$viewport.find('.video-player-module:first'),
      video: modelAdapter.sessionToVideo(session),
    });

    this.videoPlayer.once('video:player:ready', function() {

      if (this.session.get('showEmbedButton')) {
        this.videoPlayer.initializeEmbedButton();
      }

      this.videoPlayer.initializePlaylistCloseButton();
      this.videoPlayer.initializePIPCloseButton();
      this.videoPlayer.initializeLearnModeToggle();
      this.videoPlayer.initializeSubtitlesView();
      this.videoPlayer.initializePlayerSeparator();

      this.initializeVideoPlayerFullscreenControls();
      this.initializeVideoPlayerNotesBar();

      this.videoPlayerReady.resolve();
    }, this);

    this.videoPlayer.once('video:player:error', function(error) {
      this.videoPlayerReady.reject(error);
    }, this);

    this.videoPlayer.once('video:player:metadataLoaded', function() {

      this.setPlayBarProgress(session);

      this.listenTo(this, 'video:player:autoplay:ready', function() {
        this.videoPlayer.play();
      });

      this.videoPlayerMetaDataLoaded.resolve();
    }, this);

    this.listenTo(this.videoPlayer, 'video:player:timeUpdate', this.onVideoPlayerTimeUpdate);
    this.listenTo(this.videoPlayer, 'video:player:fullscreenChange', this.onVideoPlayerFullscreenChange);
    this.listenTo(this.videoPlayer, 'video:player:play', this.onVideoPlayerPlay);
    this.listenTo(this.videoPlayer, 'video:player:pause', this.onVideoPlayerPause);
    this.listenTo(this.videoPlayer, 'video:player:windowClosed', this.onVideoPlayerWindowClosed);
    this.listenTo(this.videoPlayer, 'video:player:ended', this.onVideoPlayerEnded);
    this.listenTo(this.videoPlayer, 'video:player:learnModeToggleClick', this.onVideoPlayerLearnModeToggleClick);
    this.listenTo(this.videoPlayer, 'video:player:transcriptModeToggleClick', this.onVideoPlayerTranscriptModeToggleClick);
    this.listenTo(this.videoPlayer, 'video:player:embedButtonClick', this.onVideoPlayerEmbedButtonClick);
    this.listenTo(this.videoPlayer, 'video:player:playlistCloseButtonClick', this.onVideoPlayerPlaylistCloseButtonClick);
    this.listenTo(this.videoPlayer, 'video:player:initializeToStartView', this.onPlayerInitializedToStartScreen);
  },

  initializeStartView: function() {
    this.$startView = $('#video-start-view');
  },

  initializeVideoPlayerNotesBar: function() {
    if (!this.isNotesEnabled) {
      return;
    }

    if (this.videoPlayerNotesBar) {
      this.videoPlayerNotesBar.remove();
    }

    this.videoPlayerNotesBar = new VideoPlayerNotesBar({
      player: this.videoPlayer,
      session: this.session,
    });

    this.listenTo(this.videoPlayerNotesBar, 'video:player:notesBar:noteClick', this.onVideoPlayerNotesBarNoteClick);
    this.listenTo(this.videoPlayerNotesBar, 'video:player:notesBar:noteMoreClick', this.onVideoPlayerNotesBarNoteMoreClick);
    this.listenTo(this.videoPlayerNotesBar, 'video:player:notesBar:popoverEnter', this.onVideoPlayerNotesBarPopoverEnter);
    this.listenTo(this.videoPlayerNotesBar, 'video:player:notesBar:inEditModeChange', this.onVideoPlayerNotesBarInEditModeChange);
  },

  initializeVideoPlayerFullscreenControls: function() {
    if (this.videoPlayerFullscreenControls) {
      this.videoPlayerFullscreenControls.remove();
    }

    this.videoPlayerFullscreenControls = new VideoPlayerFullscreenControls({
      player: this.videoPlayer,
      units: this.units,
      session: this.session,
    });

    this.listenTo(this.videoPlayerFullscreenControls, 'video:player:fullscreenControls:nextClick', this.onVideoPlayerNextClick);
    this.listenTo(this.videoPlayerFullscreenControls, 'video:player:fullscreenControls:prevClick', this.onVideoPlayerPrevClick);
  },

  initializeVideoPlaylist: function() {
    this.videoPlaylist = new VideoPlaylist({
      el: $('.video-playlist-module'),
      units: this.units,
    });

    this.videoPlaylist.once('afterRender', function() {
      this.scrollToSession(this.session);
    }, this);

    this.listenTo(this.videoPlaylist, 'video:playlist:viewMyNotesClick', this.onVideoPlaylistViewMyNotesClick);
    this.listenTo(this.videoPlaylist, 'video:playlist:sessionClick', this.onVideoPlaylistSessionClick);
    this.listenTo(this.videoPlaylist, 'video:playlist:viewNotesClick', this.onVideoPlaylistViewNotesClick);
    this.listenTo(this.videoPlaylist, 'video:playlist:playbackStateChange', this.onVideoPlaylistPlaybackStateChange);
    this.listenTo(this.videoPlaylist, 'video:playlist:videoComplete', this.onVideoPlaylistVideoComplete);
  },

  initializePlayerIsLocked: function() {
    this.playerIsLocked = SS.serverBootstrap.pageData.unitsData.isLocked;
  },

  initializeVideoPlayerReady: function() {
    this.videoPlayerReady = $.Deferred();
    this.videoPlayerMetaDataLoaded = $.Deferred();

    this.videoPlayerReady.then(()=> {
      this.showVideoPlayer();
      this.handleMyNotesPopupOnLoad();
    });
  },

  isVideoUnlocked: function() {
    return !!(this.session.isFirstOverall() || this.session.get('videoId'));
  },

  loadSessionVideo: function(session, autoPlayArg) {
    const autoPlay = autoPlayArg || false;

    if (this.session && this.session.view) {
      this.session.setPaused();
      this.session.view.$el.removeClass('active');

      // Clear out any tracked time from the previous session
      this.endTrackingTime();

    }

    this.scrollToSession(session);

    // Make sure the post roll is hidden
    this.closeOverlays();
    this.hideVideoPlayer();

    // Stop listening until we've loaded the next video
    this.stopListening(this.videoPlayer, 'video:player:timeUpdate', this.onVideoPlayerTimeUpdate);

    this.videoPlayer.setPosterImage('');
    this.videoPlayer.load();

    this.setSession(session, () => {
      if (this.isVideoUnlocked()) {
        this.videoPlayer.video = modelAdapter.sessionToVideo(this.session);

        this.videoPlayer.once('video:player:metadataLoaded', () => {
          this.setPlayBarProgress(this.session);

          this.listenTo(this.videoPlayer, 'video:player:timeUpdate', this.onVideoPlayerTimeUpdate);
          if (autoPlay) {
            this.videoPlayer.play();
          }
        });

        this.videoPlayer.loadVideo();

        this.initializeVideoPlayerNotesBar();
        this.initializeVideoPlayerFullscreenControls();
        this.initializeShareLinks();

        this.showVideoPlayer();
      } else {
        this.displayLockedView();
      }

      this.trigger('change:session', this.session);
    });
  },

  loadNextSessionVideo: function(autoPlay) {
    const nextSession = this.nextSession();
    this.endTrackingTime();

    if (!nextSession) {
      return;
    }

    this.loadSessionVideo(nextSession, autoPlay);
  },

  loadPreviousSessionVideo: function(autoPlay) {
    const previousSession = this.previousSession();

    this.endTrackingTime();

    if (!previousSession) {
      return;
    }

    this.loadSessionVideo(previousSession, autoPlay);
  },

  setSession: function(session, callback) {
    this.session = session;
    this.session.unit = this.units.at(0);

    this.session.notes.once('set', function() {
      this.session.setVideoId(callback);
    }, this);

    this.session.notes.fetchSet();
  },

  nextSession: function() {
    return this.units.nextSession(this.session);
  },

  previousSession: function() {
    return this.units.previousSession(this.session);
  },

  // Determine if a user completed the entire unit
  completedUnit: function() {
    return this.units.at(0).isCompleted();
  },

  // Determine if we've completed all units (which means that we've
  // completed all sessions)
  completedAllUnits: function() {
    return this.completedUnit();
  },

  trackSessionCompletion: function(session) {
    // Check if we've completed all sessions for this class (which means
    // that we've completed all of the units too)
    if (this.completedAllUnits()) {
      const params = SS.EventTracker.classDetails({sku: this.parentClass.sku});

      SS.EventTracker.track('Completed All Class Videos', '', params);

      session.unit.completion.save({ 'completed': true });

      setTimeout(() => {
        initializeGamificationToast(GAMIFICATION_ACTION_STEPS.FINISH_A_CLASS, true);
      }, 1000);
    }
  },

  trackSessionStart: function(session) {
    if (this.sessionsStarted.get(session.get('id'))) {
      return;
    }

    this.sessionsStarted.set(session.get('id'), true);

    this.videoPlayer.trackPlayLessonEvent(session);
  },

  endTrackingTime: function() {
    this.timeTracker.stop(this.videoPlayer.getCurrentTime());
  },

  getDataForOverlay: function() {
    return {
      container: this.$viewport.find('.overlay-container:first'),
      nextSession: this.nextSession(),
      currentSession: this.session,
      parentClass: this.parentClass,
      baseUrl: this.baseUrl,
    };
  },

  closeNotePopovers: function() {
    if (this.session.notes) {
      this.session.notes.trigger('closeAll');
    }
  },

  scrollToSession: function(session) {
    // Hide and show the summary depending on if this is the first video
    // If we're viewing the first session then scroll the playlist to the top,
    // otherwise scroll to the session row
    if (session.isFirstOverall()) {
      this.$el.addClass('first-video');
      this.scrollToTopOfPlaylist();
    } else {
      this.$el.removeClass('first-video');
      this.scrollToPlaylistRow(session);
    }

    session.view.$el.addClass('active');
  },

  scrollToTopOfPlaylist: function() {
    this.$unitList.animate({
      scrollTop: 0,
    }, 300, 'linear');
  },

  scrollToPlaylistRow: function(session) {
    // This is to account for the border on top of each of the items
    const buffer = 1;
    let $listItem = null;

    if (session.isFirstInUnit()) {
      // Session is the first within it's unit so scroll to the unit title
      $listItem = session.unit.view.$el;
    } else {
      // Scroll to the session itself
      $listItem = session.view.$el;
    }

    this.$unitList.animate({
      scrollTop: this.$unitList.scrollTop() + $listItem.position().top + buffer,
    }, 300, 'linear');
  },

  displayVideoPostRoll: function() {
    if (this.inEditMode) {
      return;
    }

    this.closeNotePopovers();

    if (!this.playerIsLocked) {
      if (this.nextSession()) {
        this.loadNextSessionVideo(true);
      } else {
        if (this.videoPlayer.isFullscreen()) {
          this.videoPlayer.exitFullscreen();
        }
        this.displayCountdownOverlay();
      }
      return;
    }

    this.displayLockedView();
  },

  displayLockedView: function() {
    this.videoPlayer.stop();
    this.displayUpgradeOverlay();
    this.videoPlayer.exitFullscreen();
  },

  displayUpgradeOverlay: function() {
    if (this.videoRollOverlay) {
      this.videoRollOverlay.remove();
    }

    this.videoRollOverlay = new VideoRollOverlayUpgradeView(_.extend({
      templateData: _.extend(this.premiumUpgradeData, {
        // gr_locd_atf
        shouldRenderLocdAboveTheFold: shouldRenderLocdAboveTheFold()
      })
    }, this.getDataForOverlay()));

    this.displayVideoRollOverlay();
  },

  displayCountdownOverlay: function() {
    if (this.videoRollOverlay) {
      this.videoRollOverlay.remove();
    }

    this.videoRollOverlay = new VideoRollOverlayCountdownView(this.getDataForOverlay());

    this.displayVideoRollOverlay();
  },

  displayEnrollButtonOverlay: function() {
    const data = _.extend({}, this.session.attributes, this.joinModule);
    const html = Mustache.render(lockedTemplate, data, {
      'modules/_video-player-cta': lockedCTATemplate,
    });

    this.$lockedView.html(html).show();

    Common.initRestrictedAccessHandlers(this);
  },

  displayVideoRollOverlay: function() {
    this.closeVideoShareOverlay();
    this.showVideoOverlay();

    this.listenTo(this.videoRollOverlay, 'nextVideo', this.onVideoRollOverlayNextVideo);
    this.listenTo(this.videoRollOverlay, 'close', this.onVideoRollOverlayClose);
    this.listenTo(this.videoRollOverlay, 'scrollToHeaders', this.onVideoRollOverlayScrollToHeaders);
  },

  displayVideoEmbedPopup: function() {
    if (this.session.get('showEmbedButton')) {
      this.videoPlayer.pause();

      const sessionId = this.session.get('id');
      const authToken = this.session.get('authToken');

      new VideoEmbedPopupView({
        sessionId: sessionId,
        authToken: authToken,
        linkTitle: this.shareLinks.get('embedTitle'),
        linkUrl: this.shareLinks.get('embedUrl'),
        tagLine: this.shareLinks.get('embedTagline'),
        basicPopup: true,
      });
    }
  },

  showVideoOverlay: function() {
    this.$el.addClass('overlayed');
  },

  hideVideoOverlay: function() {
    this.$el.removeClass('overlayed');
  },

  showVideoPlayer: function() {
    this.videoPlayer.$el.css('opacity', 1);
  },

  hideVideoPlayer: function() {
    this.videoPlayer.$el.css('opacity', 0);
  },

  closeOverlays: function() {
    this.closeVideoRollOverlay();
    this.closeVideoShareOverlay();
    this.closeEnrollButtonOverlay();
    this.hideStartView();
  },

  closeVideoRollOverlay: function() {
    if (this.videoRollOverlay) {
      this.videoRollOverlay.close();
    }
  },

  closeVideoShareOverlay: function() {
    if (this.videoShareOverlay) {
      this.videoShareOverlay.close();
    }
  },

  closeEnrollButtonOverlay: function() {
    this.$lockedView.empty();
    this.showVideoPlayer();
  },

  handleMyNotesPopupOnLoad: function() {
    if (!this.isNotesEnabled) {
      return;
    }

    let showMyNotesPopupOnLoad = SS.serverBootstrap.pageData.videoPlayerData.showMyNotesPopupOnLoad;

    if (showMyNotesPopupOnLoad) {
      this.showMyNotesPopup();
    }
  },

  showMyNotesPopup: function() {
    const sessions = new VideoSessionsCollection(_.map(this.units.getFlattenedSessions(), function(session) {
      return session.clone();
    }));

    this.myNotesPopup = new MyNotesPopupView({
      parentClass: this.parentClass,
      sessions: sessions,
    });

    this.listenTo(this.myNotesPopup, 'click:videoTime', this.onMyNotesPopupVideoTimeClick);
    this.listenTo(this.myNotesPopup, 'remove:myNotes', this.onMyNotesPopupNoteRemove);
    this.listenTo(this.myNotesPopup, 'change:myNotes', this.onMyNotesPopupNoteChange);

    if (this.videoPlayer.playbackState.isPlaying()) {
      this.videoPlayer.pause();
      this.listenTo(this.myNotesPopup, 'onPopupDidCloseEvent', this.onMyNotesPopupClose);
    }
  },

  addNoteForm: function() {
    const note = new Note({
      privacy_status: this.defaultPrivacyStatus,
    }, {
      session: this.session,
    });

    this.noteForm = new NoteForm({
      model: note,
      player: this.videoPlayer,
      extraTemplateData: {
        isDark: true,
      },
      container: this.$noteForm,
      via: 'video-player',
    });
  },

  removeNoteForm: function() {
    if (this.noteForm) {
      this.noteForm.remove();
    }
  },

  resetNoteForm: function() {
    this.removeNoteForm();
    this.addNoteForm();

    this.noteForm.show();
  },

  setPlayBarProgress: function(session) {
    const sessionLength = session.get('videoLengthSeconds');
    const sessionLastPlayed = session.get('lastPlayedTime');

    // If the last saved position was in the last 10 seconds of the video,
    // assume the user has already finished watching the video and
    // reset the current time to 0
    if (sessionLastPlayed > (sessionLength - 10)) {
      this.videoPlayer.setCurrentTime(0);
    } else {
      this.videoPlayer.setCurrentTime(sessionLastPlayed);
    }
  },

  showStartView: function() {
    const url = this.videoPlayer.getVideoThumbnailImageURL();
    const backgroundImage = url ? `url(${url})` : 'none';

    this.$startView.css('backgroundImage', backgroundImage);
    this.$startView.removeClass('hidden');

    const $playButton = this.$startView.find('.vjs-big-play-button');
    $playButton.removeClass('hidden');

    const eventType = Utils.isTouchDevice() ? 'touchend' : 'click';

    this.$startView.on(eventType, (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (this.videoPlayer) {
        this.videoPlayer.play();
      }
      else {
        this.hideStartView();
      }
    });
  },

  hideStartView: function() {
    this.$startView.addClass('hidden');
  },

  onNoteFormNewNote: function(note) {
    note.set('displayPopover', true);

    this.session.notes.add(note);
    this.videoPlayerNotesBar.show();
    this.resetNoteForm();

    this.session.trigger('new:note', note);
  },

  onMyNotesPopupVideoTimeClick: function(note) {
    const session = this.units.at(0).sessions.get(note.session.get('id'));

    if (session.get('id') !== this.session.get('id')) {
      this.videoPlayer.once('video:player:metadataLoaded', function() {
        this.videoPlayer.setCurrentTime(note.get('video_time'));
      }, this);

      this.loadSessionVideo(session, true);
    } else {
      this.videoPlayer.setCurrentTime(note.get('video_time'));
      this.videoPlayer.play();
    }
  },

  onMyNotesPopupNoteRemove: function(note) {
    this.trigger('remove:note', note);
  },

  onMyNotesPopupNoteChange: function(note) {
    this.trigger('change:note', note);
  },

  onSessionNoteRemove: function(note) {
    this.session.trigger('destroyed:note', note);
  },

  onVideoPlayerNextClick: function() {
    this.loadNextSessionVideo(true);
  },

  onVideoPlayerPrevClick: function() {
    this.loadPreviousSessionVideo(true);
  },

  onVideoPlayerTimeUpdate: function(time) {
    // Don't do anything if the video isn't actually playing
    if (!this.videoPlayer.playbackState.isPlaying()) {
      return;
    }

    this.hideVideoOverlay();

    this.timeTracker.set('session_id', this.session.get('id'));
    this.timeTracker.markProgress(time);
  },

  onVideoPlayerFullscreenChange: function() {
    if (!this.isNotesEnabled) {
      return;
    }

    this.videoPlayer.togglePlaylistCloseButton();
    if (this.videoPlayer.isFullscreen()) {
      if (this.videoPlayerNotesBar.hasNotes()) {
        this.videoPlayerNotesBar.hide();
      }
    } else {
      if (this.videoPlayerNotesBar.hasNotes()) {
        this.videoPlayerNotesBar.show();
      }
    }
  },

  onVideoPlayerPlay: function() {
    this.session.setPlaying();
    this.timeTracker.set('session_id', this.session.get('id'));
    this.timeTracker.start();

    // Make sure the post roll is hidden
    this.closeOverlays();

    this.trackSessionStart(this.session);

    this.trigger('newClasses:video:player:play');
  },

  onVideoPlayerPause: function() {
    this.session.setPaused();
    this.endTrackingTime();
  },

  onVideoPlayerWindowClosed: function() {
    this.session.setPaused();
    this.endTrackingTime();
  },

  onVideoPlayerEnded: function() {
    this.session.setEnded();
    this.endTrackingTime();

    this.displayVideoPostRoll();
  },

  onVideoPlayerLearnModeToggleClick: function() {
    this.videoPlayer.exitFullscreen();
    this.trigger('toggle:learnMode', 'video-control-bar');
  },

  onVideoPlayerTranscriptModeToggleClick: function() {
    this.trigger('toggle:transcriptMode', 'video-control-bar');
  },

  onVideoPlayerNotesBarNoteClick: function(note) {
    this.videoPlayer.setCurrentTime(note.get('video_time'));
  },

  onVideoPlayerNotesBarNoteMoreClick: function(note) {
    this.trigger('click:more', note);
  },

  onVideoPlayerNotesBarPopoverEnter: function() {
    this.videoPlayer.onMouseEnterEvent();
  },

  onVideoPlayerNotesBarInEditModeChange: function(inEditMode) {
    this.inEditMode = inEditMode;

    if (this.inEditMode) {
      this.$el.addClass('edit-mode');
    } else {
      this.$el.removeClass('edit-mode');

      // If the user just exited edit mode and is at the end of the video -
      // close their popover and show the post roll
      if (this.videoPlayer.playbackState.isEnded()) {
        this.closeNotePopovers();
        this.displayVideoPostRoll();
      }
    }
  },

  onVideoRollOverlayNextVideo: function() {
    this.loadNextSessionVideo(true);
  },

  onVideoRollOverlayClose: function() {
    this.hideVideoOverlay();
  },

  onVideoRollOverlayScrollToHeaders: function() {
    this.trigger('scrollToHeaders');
  },

  onVideoPlayerEmbedButtonClick: function() {
    this.displayVideoEmbedPopup();
  },

  onVideoShareOverlayClose: function() {
    this.hideVideoOverlay();
  },

  onVideoPlayerPlaylistCloseButtonClick: function() {
    this.$el.toggleClass('playlist-closed');
  },

  onVideoPlaylistViewMyNotesClick: function() {
    this.showMyNotesPopup();
  },

  onVideoPlaylistSessionClick: function(session) {
    if (session.get('id') !== this.session.get('id')) {
      this.loadSessionVideo(session);
    }
  },

  onVideoPlaylistViewNotesClick: function(session) {
    const via = 'view-notes';

    // Only update if we're clicking another session row other than the one currently playing
    if (session.get('id') !== this.session.get('id')) {
      this.loadSessionVideo(session, true);
    }

    this.trigger('enable:learnMode', via);
  },

  onVideoPlaylistPlaybackStateChange: function(session) {

    const params = {
      sku: this.parentClass.get('sku'),
      parent_class_title: this.parentClass.get('title'),
      is_locked: session.get('premiumAndLocked'),
      lesson_title: session.get('title'),
      lesson_id: session.get('id'),
    };
    // Mixpanel tracking for locked items in video playlist
    SS.EventTracker.track('Clicked-Playlist-Lesson', null, params);

    if (session.get('id') === this.session.get('id')) {
      if (!this.isVideoUnlocked()) {
        return;
      }

      if (session.isPlaying()) {
        this.videoPlayer.play();
      } else if (session.isPaused()) {
        this.videoPlayer.pause();
      } else {
        this.videoPlayer.replay();
      }
    } else {
      this.loadSessionVideo(session, true);
    }
  },

  onVideoPlaylistVideoComplete: function(data) {
    this.trigger('video:complete', {
      videoIndex: data.videoIndex,
    });

    this.trackSessionCompletion(data.session);
  },

  onPlayerInitializedToStartScreen: function() {
    this.showStartView();
  }
});

export default VideoPlayerView;
