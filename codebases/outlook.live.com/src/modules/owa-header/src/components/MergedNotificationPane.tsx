import * as React from 'react';

import { NotificationToast, headerToastNotificationStore } from 'owa-header-toast-notification';
import { observer } from 'mobx-react-lite';
import { NotificationPane } from 'owa-header-app-notifications/lib/lazyFunctions';

// #24738 - We should move owa-header-toast-notification to owa-header-app-notifications and unify on a design
// For now, this merges the two together.

export default observer(function MergedNotificationPane() {
    return <NotificationPane>{getHeaderToasts()}</NotificationPane>;
});

function getHeaderToasts() {
    return headerToastNotificationStore.notificationViewStates.map(notification => (
        <NotificationToast notification={notification} key={notification.id} />
    ));
}
