

const Playlist = Backbone.Model.extend({
  url: function() {
    if (this.isNew()) {
      return '/lists/new';
    }

    return '/lists/' + this.get('id') + '/edit';
  },
});

export default Playlist;

