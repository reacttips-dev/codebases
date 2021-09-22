import CollectionView from 'core/src/views/base/collection-view';
import NotesBarItemView from 'core/src/views/item-views/notes-bar-item-view';

const NotesBarCollectionView = CollectionView.extend({
  className: 'vjs-note-bar',
  itemView: NotesBarItemView,
});

export default NotesBarCollectionView;

