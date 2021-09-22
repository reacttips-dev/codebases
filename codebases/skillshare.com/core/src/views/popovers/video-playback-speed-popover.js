import PopoverView from 'core/src/views/modules/popover';

const VideoPlaybackSpeedPopoverView = PopoverView.extend({

  showOnHover: true,

  autoPosition: false,

  placement: 'top',

  events: {
    'click li': 'onPlaybackSpeedClick',
  },

  initialize: function(options) {
    PopoverView.prototype.initialize.apply(this, arguments);
    _.extend(this, _.pick(options, ['model', 'videoPlayer']));

    _.bindAll(this, 'updateActive', 'onOpen', 'onClose');

    this.$playbackSpeedList = this.$('ul');

    this.listenTo(this.model, 'change:playback_speed', this.updateActive);
    this.listenTo(this, 'popover:open', this.onOpen);
    this.listenTo(this, 'popover:close', this.onClose);
  },

  afterRender: function() {
    PopoverView.prototype.afterRender.apply(this, arguments);
    this.updateActive();
  },

  onPlaybackSpeedClick: function(event) {
    const active = event.currentTarget;
    const index = $(active).index();
    this.model.setCurrentPlaybackSpeedByIndex(index);
  },

  toggleActive: function(active) {
    this.$('li').removeClass('active');
    $(active).addClass('active');
  },

  updateActive: function() {
    const speedList = this.$playbackSpeedList.children().toArray();
    const active = speedList[this.model.getCurrentPlaybackSpeedIndex()];
    this.toggleActive(active);
  },

  onOpen: function() {
    this.videoPlayer.setPreventControlBarHide('playbackSpeedPopover', true);
  },

  onClose: function() {
    this.videoPlayer.setPreventControlBarHide('playbackSpeedPopover', false);
  },
});

export default VideoPlaybackSpeedPopoverView;

