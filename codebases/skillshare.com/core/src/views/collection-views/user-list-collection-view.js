import CollectionView from 'core/src/views/base/collection-view';
import UserListItemView from 'core/src/views/item-views/user-list-item-view';

const UserListCollectionView = CollectionView.extend({
  itemView: UserListItemView,
});

export default UserListCollectionView;

