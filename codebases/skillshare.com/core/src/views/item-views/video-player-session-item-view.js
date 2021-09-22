import SSView from 'core/src/views/base/ss-view';
import AttachmentsPopoverView from 'core/src/views/popovers/attachments-popover';
import Common from 'core/src/common';
import deepRetrieve from 'core/src/utils/deep-retrieve';
import viewNotesTemplate from 'text!core/src/templates/modules/video-player/_view-notes.mustache';
import template from 'text!core/src/templates/items/video-player-session-item.mustache';
import Mustache from 'mustache';

const VideoPlayerSessionItemView = SSView.extend({

  template,
  tagName: 'li',
  className: 'session-item',

  playbackStates: {
    PAUSED: 0,
    PLAYING: 1,
    ENDED: 3,
  },

  templatePartials: {
    'modules/video-player/_view-notes': viewNotesTemplate,
  },

  templateData: function() {
    return _.extend({ userIsGuest: SS.currentUser.isGuest() }, this.model.attributes);
  },

  events: {
    'click': 'onClick',
    'click .js-playback-control-container': 'onClickPlaybackControl',
    'click .view-notes.active-note': 'onViewNotes',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['collectionView']));

    // Always begin the playback state as paused
    this.model.view = this;
    this.model.set('playbackState', this.playbackStates.PAUSED);

    // Listen for changes to play state and update play button accordingly
    this.listenTo(this.model, 'change:playbackState', this.onChangePlaybackState);

    // Listen for completions on the video and bubble up events
    this.listenTo(this.model, 'shouldComplete', this.completeVideo);

    this.listenTo(this.model, 'new:note', this.incrementNoteCount);
    this.listenTo(this.model, 'destroyed:note', this.decrementNoteCount);

    if (this.model.get('rank') === 0) {
      this.$el.addClass('first');
    }

    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    SSView.prototype.afterRender.apply(this, arguments);

    this.listenTo(this.model.completion, 'change:completed', this.onCompleteVideoChange);

    new AttachmentsPopoverView({
      anchor: this.$('.attachments-popover-button'),
      el: this.$('.attachments-popover'),
      autoPosition: false,
    });

    this.$viewNotesWrapper = this.$('.view-notes-wrapper');

    this.$("[data-toggle='tooltip']").tooltip();

    // Update the state on first render
    this.update();
  },

  // Clicking directly on the session row
  onClick: function() {
    this.collectionView.trigger('click:session', { session: this.model });
  },

  // Clicking on the Play/Pause/Replay button
  onClickPlaybackControl: function(ev) {
    ev.stopPropagation();

    let newState;
    const currState = this.model.get('playbackState');

    if (currState === this.playbackStates.PLAYING) {
      newState = this.playbackStates.PAUSED;
    } else if (currState === this.playbackStates.PAUSED) {
      newState = this.playbackStates.PLAYING;
    } else {
      newState = this.playbackStates.ENDED;
    }

    this.$el.addClass('active');
    this.model.set('playbackState', newState);
    this.collectionView.trigger('change:playbackState', { session: this.model });

  },

  onViewNotes: function(ev) {
    ev.stopPropagation();
    this.collectionView.trigger('click:viewNotes', this.model);
  },

  // Updates once the Play/Pause/Replay button have been selected
  onChangePlaybackState: function() {
    this.update();
  },

  incrementNoteCount: function() {
    const currentCount = parseInt(this.$('.view-notes').html(), 0);
    const count = currentCount ? currentCount + 1 : 1;
    this.updateNoteCount(count);
  },

  decrementNoteCount: function() {
    const currentCount = parseInt(this.$('.view-notes').html(), 0);
    const count = currentCount ? currentCount - 1 : 0;
    this.updateNoteCount(count);
  },

  updateNoteCount: function(count) {
    if (count < 1) {
      this.$viewNotesWrapper.empty();
      return;
    }

    const html = Mustache.render(viewNotesTemplate, {
      totalNumNotes: count,
    });
    this.$viewNotesWrapper.html(html);
    Common.initNewTooltips(this);
  },

  // Set the current state of the play button
  update: function() {
    const $control = this.$('.js-playback-icon');
    const state = this.model.get('playbackState');

    // Remove all icon classes from control
    $control.removeClass(function(index, css) {
      return (css.match(/\bss-icon-\S+/g) || []).join(' ');
    });

    // Update the UI
    let icon = '#play';

    // Show lock icon if the class is premium and the video is locked
    if (this.model.get('premiumAndLocked')) {
      icon = '#locked';
    } else if (state === this.playbackStates.PLAYING) {
      icon = '#pause';
    }

    $control.find('use').attr('xlink:href', icon);
  },

  showRecommendBoxIfPossible: function() {
    let totalNumberOfSessions = 0;
    let currentSessionIndex = 0;
    const totalNumberOfUnits = this.model.unit.collection.length;
    const currentSession = this.model;

    const classIsFree = deepRetrieve(SS, 'serverBootstrap', 'premiumUpgradeData', 'isFree');

    // Determine if user is more than halfway through a class
    // by checking if the current session is
    // more than half the total number of sessions.
    // This way, a skipped video still counts as watched
    for (let i = 0; i < totalNumberOfUnits; i++) {
      const unit = this.model.unit.collection.models[i];
      const numberOfSessions = unit.sessions.models.length;

      for (let j = 0; j < numberOfSessions; j++) {
        const session = unit.sessions.models[j];
        totalNumberOfSessions++;

        if (currentSession.id === session.id) {
          currentSessionIndex = totalNumberOfSessions;
        }
      }
    }
    const moreThanHalfwayThroughClass = (currentSessionIndex > (totalNumberOfSessions / 2)) || (totalNumberOfSessions === 1);

    if(currentSessionIndex === 3 && !classIsFree) {
      $('.leave-a-review-popup-btn').removeClass('disabled')
        .addClass('mute-popover');
    }

    // do not show recommend-box if the user has previously closed it
    let showRecommendBox = true;
    const shouldShowCookie = $.cookie('show_recommend_box');
    if (shouldShowCookie) {
      // convert the string 'false' or 'true' to a boolean
      showRecommendBox = shouldShowCookie === 'true';
    }

    if (moreThanHalfwayThroughClass && showRecommendBox) {
      $('.js-recommend-class-box').css('visibility', 'inherit')
        .show('slow');
    }
  },

  // Completes the session, this is triggered from video-player.js
  completeVideo: function() {
    this.model.completion.set('completed', true);
  },

  onCompleteVideoChange: function() {
    this.showRecommendBoxIfPossible();

    this.$('.playback-control-wrapper').addClass('session-is-complete');
    this.$('.js-completion-button').addClass('completed');

    this.collectionView.trigger('video:complete', {
      videoIndex: this.model.get('rank'),
      session: this.model,
    });
  },
});

export default VideoPlayerSessionItemView;
