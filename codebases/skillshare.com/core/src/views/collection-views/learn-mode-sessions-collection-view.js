import CollectionView from 'core/src/views/base/collection-view';
import LearnModeSessionItemView from 'core/src/views/item-views/learn-mode-session-item-view';

const LearnModeSessionsCollectionView = CollectionView.extend({
  className: 'learn-mode-sessions',
  itemView: LearnModeSessionItemView,
});

export default LearnModeSessionsCollectionView;

