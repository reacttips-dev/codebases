import InfiniteScrollerCollection from 'core/src/collections/infinite-scroller';
import Note from 'core/src/models/note';

const NotesCollection = InfiniteScrollerCollection.extend({

  url: '/notes',
  model: Note,
  comparator: 'update_time',

  parse: function(response) {
    InfiniteScrollerCollection.prototype.parse.apply(this, arguments);

    this.total = response.total;

    return response.notes;
  },
});

export default NotesCollection;

