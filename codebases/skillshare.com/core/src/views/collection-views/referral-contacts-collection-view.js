import CollectionView from 'core/src/views/base/collection-view';
import ReferralContactItemView from 'core/src/views/item-views/referral-contact-item-view';

const ReferralContactsCollectionView = CollectionView.extend({
  itemView: ReferralContactItemView,
  animateOnRemove: true,
});

export default ReferralContactsCollectionView;

