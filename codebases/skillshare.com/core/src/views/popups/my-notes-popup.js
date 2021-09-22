import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import NotesCollection from 'core/src/collections/notes';
import VideoSessionsCollection from 'core/src/collections/video-sessions';
import LearnModeSessionsCollectionView from 'core/src/views/collection-views/learn-mode-sessions-collection-view';
import template from 'text!core/src/templates/popups/my-notes-popup.mustache';

const MyNotesPopupView = AbstractPopupView.extend({

  className: 'my-notes-popup',

  centerVertically: false,

  template: template,

  templateData: function() {
    return this.parentClass.attributes;
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['parentClass', 'sessions']));

    if (!this.parentClass) {
      throw new Error('A parentClass model is required for this view.');
    }

    if (!this.sessions) {
      throw new Error('A sessions collection is required for this view.');
    }

    this.notes = new NotesCollection([]);
    this.listenTo(this.notes, 'sync', this.onNotesFetch);

    AbstractPopupView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    AbstractPopupView.prototype.afterRender.apply(this, arguments);
    this.notes.fetch({
      data: {
        user_uid: SS.currentUser.id,
        parent_class_id: this.parentClass.id,
      },
    });
  },

  onNotesFetch: function() {
    this.$('.icon-loading').removeClass('icon-loading');

    if (this.notes.length === 0) {
      this.$('.empty-area').show();
      return;
    }

    // Group all the notes together for each session
    const _this = this;
    this.sessions.each(function(session) {
      const sessionNotes = _this.notes.where({
        session_id: session.id,
      });
      session.notes = new NotesCollection(sessionNotes, {
        comparator: 'video_time',
      });
      session.notes.each(function(note) {
        note.session = session;
      });
      session.set('rank', session.get('overallRank'));
      _this.listenTo(session.notes, 'remove', _this.onNoteRemove);
      _this.listenTo(session.notes, 'change', _this.onNoteChange);
    });

    // Only show sessions where the user has notes
    const sessionModelsWithNotes = this.sessions.filter(function(session) {
      return session.notes.length > 0;
    });

    const sessionsWithNotes = new VideoSessionsCollection(sessionModelsWithNotes);

    const learnModeSessionsCollectionView = new LearnModeSessionsCollectionView({
      el: this.$('.learn-mode-sessions-collection-wrapper'),
      collection: sessionsWithNotes,
    });
    this.listenTo(learnModeSessionsCollectionView, 'click:videoTime', this.onVideoTime);
  },

  onNoteRemove: function(note) {
    this.trigger('remove:myNotes', note);
  },

  onNoteChange: function(note) {
    this.trigger('change:myNotes', note);
  },

  onVideoTime: function(model) {
    this.trigger('click:videoTime', model);
    this.closePopup();
  },

});

export default MyNotesPopupView;

