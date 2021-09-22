import SSView from 'core/src/views/base/ss-view';
import NotePopoverView from 'core/src/views/modules/note-popover';

const ARROW_LEFT_MAX = 25;
const ARROW_RIGHT_MIN = 75;
const NOTE_PERCENT_LEFT_MAX = 0.6;
const NOTE_PERCENT_RIGHT_MIN = 99.4;
const DISPLAY_POPOVER_TIME = 2000;
const REMOVE_ACTIVE_TIME = 300;

const NotesBarItemView = SSView.extend({

  className: 'vjs-note',

  events: {
    'click': 'onClick',
    'mouseenter': 'addActiveClass',
    'mouseleave': 'removeActiveClass',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['collectionView']));
    this.listenTo(this.model.collection, 'closeAll', this.removeActiveClass);
    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    this.position();
    this.initializePopover();
    if (this.model.isCurrentUsers()) {
      this.addNoteDot();
    }
    SSView.prototype.afterRender.apply(this, arguments);
  },

  position: function() {
    let zIndex = this.model.collection.indexOf(this.model);
    if (this.model.isCurrentUsers()) {
      zIndex += 10;
    }

    const noteTimePercentage = this.calculateNoteTimePercentage();

    // Handle notes that go outside of the boundaries of the notes bar
    let left;
    let right;
    let marginLeft;
    if (noteTimePercentage < NOTE_PERCENT_LEFT_MAX) {
      left = 0;
      marginLeft = 0;
    } else if (noteTimePercentage > NOTE_PERCENT_RIGHT_MIN) {
      right = 0;
    } else {
      left = noteTimePercentage + '%';
    }

    this.$el.css({
      backgroundImage: 'url(' + this.model.get('author').image + ')',
      left: left,
      right: right,
      marginLeft: marginLeft,
      zIndex: zIndex,
    });
  },

  initializePopover: function() {
    const percentage = this.calculateNoteTimePercentage();

    let arrowPlacement;
    if (percentage < ARROW_LEFT_MAX) {
      arrowPlacement = 'left';
    } else if (percentage > ARROW_RIGHT_MIN) {
      arrowPlacement = 'right';
    }

    const notePopover = new NotePopoverView({
      model: this.model,
      anchor: this.$el,
      placement: 'top',
      arrowPlacement: arrowPlacement,
    });
    this.listenTo(notePopover, 'click:more', this.onClickMore);
    this.listenTo(notePopover, 'enter:popover', this.onEnterPopover);
    this.listenTo(notePopover, 'leave:popover', this.removeActiveClass);
    this.listenTo(notePopover, 'change:inEditMode', this.onEditModeChange);

    if (this.model.get('displayPopover')) {
      notePopover.open();
      _.delay(function() {
        notePopover.close();
      }, DISPLAY_POPOVER_TIME);
    }
  },

  addNoteDot: function() {
    this.$el.append('<div class="vjs-note-dot"></div>');
  },

  onClick: function() {
    this.collectionView.trigger('click:note', this.model);
  },

  onClickMore: function() {
    this.collectionView.trigger('click:more', this.model);
  },

  onEnterPopover: function() {
    clearTimeout(this.removeActiveTimerId);
    this.collectionView.trigger('enter:popover');
  },

  onEditModeChange: function(inEditMode) {
    this.collectionView.trigger('change:inEditMode', inEditMode);
  },

  addActiveClass: function() {
    this.$el.addClass('active');
  },

  removeActiveClass: function() {
    const _this = this;
    this.removeActiveTimerId = _.delay(function() {
      _this.$el.removeClass('active');
    }, REMOVE_ACTIVE_TIME);
  },

  calculateNoteTimePercentage: function() {
    const fullVideoLength = this.model.session.get('videoLengthSeconds');
    const videoTime = this.model.get('video_time');
    const percentage = (videoTime / fullVideoLength) * 100;
    return Math.round(percentage * 100) / 100;
  },

});

export default NotesBarItemView;

