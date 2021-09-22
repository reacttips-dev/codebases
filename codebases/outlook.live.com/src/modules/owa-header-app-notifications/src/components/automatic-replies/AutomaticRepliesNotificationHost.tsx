import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AutomaticRepliesNotification from './AutomaticRepliesNotification';
import {
    getIsAutomaticReplyNotificationSavedSetting,
    getStartDate,
    getEndDate,
    getPeriodicReplyEnabled,
} from 'owa-automatic-replies-option/lib/selectors/getStoreProperties';
import { initLoadMailboxAutomaticRepliesConfiguration } from 'owa-automatic-replies-option';
import { isBefore, now } from 'owa-datetime';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './AutomaticRepliesNotificationHost.scss';

const AutomaticRepliesNotificationHost = observer(
    function AutomaticRepliesNotificationHost(props: {}) {
        React.useEffect(() => {
            initLoadMailboxAutomaticRepliesConfiguration();
        }, []);

        return (
            getIsAutomaticReplyNotificationSavedSetting() &&
            shouldDisplayAutomaticRepliesNotification() && (
                <div className={styles.container}>
                    <AutomaticRepliesNotification />
                </div>
            )
        );
    }
);
export default AutomaticRepliesNotificationHost;

function shouldDisplayAutomaticRepliesNotification() {
    const currentDate = now();
    const startDate = getStartDate();
    const endDate = getEndDate();

    const isPeriodicReply =
        isFeatureEnabled('cal-notifications-hideAutoReplyNotification') &&
        getPeriodicReplyEnabled();

    return isBefore(startDate, currentDate) && isBefore(currentDate, endDate) && !isPeriodicReply;
}
