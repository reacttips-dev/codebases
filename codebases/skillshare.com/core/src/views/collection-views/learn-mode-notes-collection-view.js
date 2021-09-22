import CollectionView from 'core/src/views/base/collection-view';
import LearnModeNoteItemView from 'core/src/views/item-views/learn-mode-note-item-view';

const LearnModeNotesCollectionView = CollectionView.extend({
  className: 'learn-mode-notes',
  itemView: LearnModeNoteItemView,
});

export default LearnModeNotesCollectionView;

