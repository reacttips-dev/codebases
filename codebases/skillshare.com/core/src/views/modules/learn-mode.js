import VideoDrawer from 'core/src/views/modules/video-drawer';
import Note from 'core/src/models/note';
import NotesCollection from 'core/src/collections/notes';
import NoteForm from 'core/src/views/forms/note-form';
import LearnModeNotesCollectionView from 'core/src/views/collection-views/learn-mode-notes-collection-view';
import InfiniteScrollerView from 'core/src/views/modules/infinite-scroller';
import NumberHelpers from 'core/src/helpers/number-helpers';
import template from 'text!core/src/templates/class-details/shared/_learn-mode.mustache';

const EMPTY_COPY_ALL = 'There are no notes for this video.';

const LearnModeView = VideoDrawer.extend({

  defaultPrivacyStatus: 1,

  template: template,

  events: {
    'click .close-button': 'closeDrawer',
  },

  initComponent: function(options) {

    _.bindAll(this, 'addNotesCollectionView', 'onStateChange');
    _.extend(this, _.pick(options, [
      'displayNote',
      'via',
      'templateData',
    ]));

    this.notes = new NotesCollection([]);
    this.notes.comparator = 'video_time';
    this.listenTo(this.notes, 'sync', this.onCollectionFetch);

    // track a visit to learn mode
    SS.EventTracker.track('Viewed Learn Mode', {}, { via: this.via });
  },

  afterRender: function() {
    VideoDrawer.prototype.afterRender.apply(this, arguments);

    // cache the loading icon
    this.$loadingIcon = this.$('.icon-loading');

    // Save page elements
    this.$numNotes = this.$('.num-notes');
    this.$sessionTitle = this.$('.session-title');
    this.$notesWrapper = this.$('.notes-wrapper');
    this.$notesCollectionWrapper = this.$('.learn-mode-notes-collection-wrapper');
    this.$emptyArea = this.$('.empty-area');

    // Render the note form
    this.addNoteForm();

    // Add the notes collection view
    this.addNotesCollectionView();

    // Fetch all of the notes
    this.fetchNotes();

    // this page is "done loading" automatically
    this.endLoading();
  },

  onStateChange: function() {
    // when the state changes (aka when the session changes), re-fetch the notes
    this.fetchNotes();

    // then reset out the note form
    this.removeNoteForm();
    this.addNoteForm();
  },

  addNoteForm: function() {
    const modelOptions = {
      session: this.session,
    };
    const note = new Note({
      privacy_status: this.defaultPrivacyStatus,
    }, modelOptions);

    this.noteForm = new NoteForm({
      container: this.$('.note-form-wrapper'),
      player: this.player,
      model: note,
      session: this.session,
      via: 'learn-mode',
    });

    this.listenTo(this.noteForm, 'created:note', this.onNewNote);
    this.listenTo(this.noteForm, 'change:privacy_status', this.onPrivacyStatusChange);
  },

  removeNoteForm: function() {
    this.noteForm.remove();
  },

  onNewNote: function(note) {
    this.notes.add(note);
    this.resetNoteForm();
    this.incrementNoteCount();
    this.updateEmptyState();
    this.trigger('created:note', note);
  },

  resetNoteForm: function() {
    this.removeNoteForm();
    this.addNoteForm();
    this.noteForm.show();
  },

  addNotesCollectionView: function() {
    const learnModeCollectionView = new LearnModeNotesCollectionView({
      container: this.$notesCollectionWrapper,
      collection: this.notes,
    });

    this.infiniteScroller = new InfiniteScrollerView({
      collection: this.notes,
      container: this.$notesCollectionWrapper,
      buffer: 300,
    });

    this.listenTo(learnModeCollectionView, 'click:videoTime', this.onVideoTimeClick);
    this.listenTo(this.notes, 'remove', this.onNoteRemove);
  },

  fetchNotes: function() {
    this.startLoading();

    const _this = this;
    this.notes.fetchSet({
      data: this.state.attributes,
      success: function() {
        _this.endLoading();
      },
      error: function() {
        _this.endLoading();
      },
    });
  },

  onCollectionFetch: function() {
    if (this.displayNote) {
      this.highlightNote(this.displayNote);
      // We only want to highlight this note on the first fetch
      this.displayNote = undefined;
    }

    this.infiniteScroller.update({
      fetchOptions: {
        data: this.state.attributes,
      },
    });

    this.$sessionTitle.html(_.escape(this.session.get('title')));
    this.updateEmptyState();
    this.$numNotes.html(NumberHelpers.pluralize(this.notes.total, ' Note'));
  },

  updateEmptyState: function() {
    if (this.notes.total > 0) {
      this.$emptyArea.hide();
      this.$numNotes.css('display', 'inline-block');
      return;
    }

    this.$numNotes.hide();
    this.$emptyArea.html(EMPTY_COPY_ALL).show();
  },

  incrementNoteCount: function() {
    this.notes.total += 1;
    const count = parseInt(this.$numNotes.html(), 10);
    this.$numNotes.html(NumberHelpers.pluralize(count + 1, ' Note'));
  },

  decrementNoteCount: function() {
    this.notes.total -= 1;
    const count = parseInt(this.$numNotes.html(), 10);
    this.$numNotes.html(NumberHelpers.pluralize(count - 1, ' Note'));
  },

  onNoteRemove: function() {
    this.decrementNoteCount();
    this.updateEmptyState();
  },

  onVideoTimeClick: function(note) {
    // when the user clicks the video time of a note,
    //   seek to that time in the player
    this.player.setCurrentTime(note.get('video_time'));
    this.player.play();

    // then scroll to the top for convenience
    $('html, body').scrollTop(0);
  },

  onPrivacyStatusChange: function(privacyStatus) {
    this.defaultPrivacyStatus = privacyStatus;
  },

  highlightNote: function(note) {
    const activeNote = this.notes.get(note);
    if (activeNote) {
      activeNote.trigger('highlight');
    }
  },

  // override the default start- and end- Loading methods
  //   because learn-mode uses direct dom updates instead of
  //   the state to manage ui
  startLoading: function() {
    this.$loadingIcon.show();
  },

  endLoading: function() {
    this.$loadingIcon.hide();
  },

});

export default LearnModeView;
