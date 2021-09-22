import ClassSectionView from 'core/src/views/class-details/logged-in/section';
import LessonsSectionTemplate from 'text!core/src/templates/class-details/logged-in/_lessons-section.mustache';

const LessonsViewSectionView = ClassSectionView.extend({

  template: LessonsSectionTemplate,

  PLAYLIST_SEL: '.js-video-playlist-module',
  LESSONS_TAB: '.js-video-playlist-module-lessons-tab',
  PLAYER_CONTAINER: '.js-video-and-playlist-container',
  TOP_PLAYER_CONTAINER: '.js-cd-video-player-container',

  MIN_WIDTH_NEEDED: 940,

  playlist: null,
  saveButton: null,

  initialize: function(options = {}) {
    _.extend(this, _.pick(options, 'classModel'));
    this.$ = $;
    this.playlist = this.$(this.PLAYLIST_SEL);
    this.on('attached', this.onAttached);
    this.on('unattach', this.onUnattach);
    ClassSectionView.prototype.initialize.apply(this, arguments);
  },

  onAttached: function() {
    const topContainerWidth = $(this.TOP_PLAYER_CONTAINER).width();
    this.decideLayout(topContainerWidth, false);
    this.attachSizeWatcher();
  },

  onUnattach: function() {
    this.removeSizeWatcher();
  },

  afterRender: function() {
    this.setLayoutBottom();
    ClassSectionView.prototype.afterRender.apply(this, arguments);
  },

  attachSizeWatcher: function() {
    this.$(window).on('resize.skPlaylistResposiveWatcher', () => {
      const topContainerWidth = $(this.TOP_PLAYER_CONTAINER).width();
      this.decideLayout(topContainerWidth);
    });
  },

  decideLayout: function(topContainerWidth, checkForPlaylistIn = true) {
    if( topContainerWidth > this.MIN_WIDTH_NEEDED ) {
      this.setLayoutRight(checkForPlaylistIn);
    } else {
      this.setLayoutBottom();
    }
  },

  removeSizeWatcher: function() {
    $(window).off('resize.skPlaylistResposiveWatcher');
  },

  setLayoutBottom: function() {
    if(!this.playlistIsIn(this.LESSONS_TAB)) {
      this.playlist.appendTo(this.$(this.LESSONS_TAB));
    }
  },

  setLayoutRight: function(checkForPlaylistIn) {
    if(checkForPlaylistIn && this.playlistIsIn(this.PLAYER_CONTAINER)) {
      return;
    }
    this.playlist.appendTo(this.$(this.PLAYER_CONTAINER));
    this.$('.user-navigation-wrapper a[href*="projects"]').last()
      .click();
  },

  playlistIsIn: function(el) {
    return this.playlist.parents(el).length === 1;
  },
});

export default LessonsViewSectionView;