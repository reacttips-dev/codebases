import type { BrandSubscriptionModel } from '../index';
import type BrandSubscriptionStore from './schema/BrandSubscriptionStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const store: BrandSubscriptionStore = createStore<BrandSubscriptionStore>('BrandSubscription', {
    subscriptions: new ObservableMap<string, BrandSubscriptionModel>({}),
    unsubscribedSubscriptions: new ObservableMap<string, BrandSubscriptionModel>({}),
})();

export default store;
