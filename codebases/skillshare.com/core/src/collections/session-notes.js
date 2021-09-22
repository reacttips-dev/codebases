import NotesCollection from 'core/src/collections/notes';
import Session from 'core/src/models/session';

const SessionNotesCollection = NotesCollection.extend({

  session: null,

  initialize: function(models, options) {
    _.extend(this, _.pick(options, [
      'session',
    ]));

    this.initializeSession();

    NotesCollection.prototype.initialize.apply(this, arguments);
  },

  initializeSession: function() {
    if (_.isNull(this.session)) {
      this.session = Session;
    }

    this.listenTo(this, 'set', this.onSet);
    this.listenTo(this, 'update', this.onUpdate);
  },

  url: function() {
    return '/sessions/' + this.session.get('id') + '/notesData';
  },

  setSessionOnModels: function() {
    _.each(this.models, function(note) {
      note.setSession(this.session);
    }, this);
  },

  onSet: function() {
    this.setSessionOnModels();
  },

  onUpdate: function() {
    this.setSessionOnModels();
  },
});

export default SessionNotesCollection;

