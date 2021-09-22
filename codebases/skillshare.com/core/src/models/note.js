

const Note = Backbone.Model.extend({

  urlRoot: '/notes',

  defaults: {
    privacy_status: 1,
  },

  initialize: function(attributes, options = {}) {
    if (options.session) {
      this.setSession(options.session);
    }
  },

  setSession: function(session) {
    this.session = session;
    this.set({
      session_id: this.session.id,
    });
  },

  isValid: function() {
    const required = ['body', 'session_id', 'video_time', 'privacy_status'];

    for (let i = 0; i < required.length; i++) {
      const attributeValue = this.get(required[i]);
      if (_.isUndefined(attributeValue)
          || _.isNull(attributeValue)) {
        return false;
      }
    }

    return true;
  },

  isCurrentUsers: function() {
    return SS.currentUser.get('username') === this.get('author').username;
  },

});

export default Note;


