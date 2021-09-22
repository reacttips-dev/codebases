import { lazySubscribe, NotificationSubscription } from 'owa-notification';
import type SubscriptionParameters from 'owa-service/lib/contract/SubscriptionParameters';
import fetchCategoryDetails from '../utils/fetchCategoryDetails';
import { getStore } from '../store/store';
import debounce from 'lodash-es/debounce';

let isSubscriptionInitialized = false;

export default function subscribeToCategoryNotifications() {
    if (
        !getStore().isSearchFolderReady || // AllCategorizedItems search folder is still being populated
        isSubscriptionInitialized
    ) {
        return;
    }
    isSubscriptionInitialized = true;

    let subscriptionParameters: SubscriptionParameters = {
        NotificationType: 'CategoriesNotification',
    };

    let subscription: NotificationSubscription = {
        subscriptionId: 'CategoriesNotification',
        requiresExplicitSubscribe: true,
        subscriptionParameters: subscriptionParameters,
    };

    // subscribe and store the subscription object
    lazySubscribe.importAndExecute(subscription, newCategoryNotificationCallback);
}

// Throttle the call to fetch category details so if lots of category changes
// are being made at once a service call isn't made every time
const newCategoryNotificationCallback = debounce(fetchCategoryDetails, 5000, {
    leading: true,
    trailing: true,
});
