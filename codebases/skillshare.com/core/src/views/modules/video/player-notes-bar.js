import SSView from 'core/src/views/base/ss-view';
import Session from 'core/src/models/session';
import SessionNotesCollection from 'core/src/collections/session-notes';
import NotesBarCollectionView from 'core/src/views/collection-views/notes-bar-collection-view';

const VideoPlayerNotesBar = SSView.extend({

  className: 'video-player-notes-bar-module',

  player: null,
  session: null,
  notes: null,
  notesBarCollectionView: null,

  initialize: function(options) {
    _.extend(this, _.pick(options, [
      'player',
      'session',
      'notes',
    ]));

    this.initializePlayer();
    this.initializeSession();
    this.initializeNotes();
    this.initializeNotesBarCollectionView();

    SSView.prototype.initialize.apply(this, arguments);
  },

  initializePlayer: function() {
    if (_.isNull(this.player)) {
      throw new Error('You must pass a Player when creating a PlayerNotesBar');
    }
  },

  initializeSession: function() {
    if (_.isNull(this.session)) {
      this.session = Session;
    }
  },

  initializeNotes: function() {
    if (_.isNull(this.notes)) {
      this.notes = this.session.notes;

      if (_.isNull(this.notes)) {
        this.notes = SessionNotesCollection;
      }
    }
  },

  initializeNotesBarCollectionView: function() {
    this.notesBarCollectionView = new NotesBarCollectionView({
      collection: this.notes,
    });

    this.listenTo(this.notesBarCollectionView, 'click:note', this.onNoteClick);
    this.listenTo(this.notesBarCollectionView, 'click:more', this.onNoteMoreClick);
    this.listenTo(this.notesBarCollectionView, 'enter:popover', this.onPopoverEnter);
    this.listenTo(this.notesBarCollectionView, 'change:inEditMode', this.onInEditModeChange);
  },

  render: function() {
    this.player.$controlBar.append(this.notesBarCollectionView.$el);

    if (this.hasNotes()) {
      this.show();
    } else {
      this.hide();
    }

    SSView.prototype.render.apply(this, arguments);
  },

  remove: function() {
    this.notesBarCollectionView.remove();

    SSView.prototype.remove.apply(this, arguments);
  },

  hasNotes: function() {
    return this.notes && this.notes.length > 0;
  },

  hide: function() {
    this.notesBarCollectionView.$el.hide();
  },

  show: function() {
    this.notesBarCollectionView.$el.show();
  },

  onNoteClick: function(note) {
    this.trigger('video:player:notesBar:noteClick', note);
  },

  onNoteMoreClick: function(note) {
    this.trigger('video:player:notesBar:noteMoreClick', note);
  },

  onPopoverEnter: function() {
    this.trigger('video:player:notesBar:popoverEnter');
  },

  onInEditModeChange: function(inEditMode) {
    this.trigger('video:player:notesBar:inEditModeChange', inEditMode);
  },
});

export default VideoPlayerNotesBar;
