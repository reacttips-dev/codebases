import SSView from 'core/src/views/base/ss-view';
import Session from 'core/src/models/session';
import fullscreenControlsTemplate from 'text!core/src/templates/modules/video-player/_video-player-fullscreen-controls.mustache';

const VideoPlayerFullscreenControls = SSView.extend({

  className: 'vjs-fullscreen-controls',

  template: fullscreenControlsTemplate,

  player: null,
  units: null,
  session: null,

  events: {
    'click .next-video': 'onClickNextVideo',
    'click .prev-video': 'onClickPreviousVideo',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, [
      'player',
      'units',
      'session',
    ]));

    this.initializePlayer();

    SSView.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    this.player.$videojs.append(this.$el);

    SSView.prototype.render.apply(this, arguments);
  },

  afterRender: function() {
    this.initializeButtons();

    SSView.prototype.afterRender.apply(this, arguments);
  },

  initializePlayer: function() {
    if (_.isNull(this.player)) {
      throw new Error('You must pass a Player when creating PlayerFullscreenControls');
    }

    if (_.isNull(this.session)) {
      this.session = Session;
    }

    if (_.isNull(this.units)) {
      throw new Error('You must pass a VideoUnitsCollection when creating PlayerFullscreenControls');
    }
  },

  initializeButtons: function() {
    const previousSession = this.units.previousSession(this.session);
    if (!previousSession) {
      this.$el.find('.prev-video').addClass('disabled');
    }
    const nextSession = this.units.nextSession(this.session);
    if (!nextSession) {
      this.$el.find('.next-video').addClass('disabled');
    }
  },

  onClickNextVideo: function(event) {
    if (!$(event.target).hasClass('disabled')) {
      this.trigger('video:player:fullscreenControls:nextClick');
    }
  },

  onClickPreviousVideo: function(event) {
    if (!$(event.target).hasClass('disabled')) {
      this.trigger('video:player:fullscreenControls:prevClick');
    }
  },
});

export default VideoPlayerFullscreenControls;

