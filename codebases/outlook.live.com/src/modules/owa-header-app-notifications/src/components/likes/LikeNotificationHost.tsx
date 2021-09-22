import * as React from 'react';
import LikeNotification from './LikeNotification';
import { observer } from 'mobx-react-lite';
import getStore from '../../store/store';
import { TransitionGroup } from 'react-transition-group';
import { toJS } from 'mobx';

import styles from './LikeNotificationHost.scss';

export default observer(function LikeNotificationHost(props: {}) {
    const { likeNotifications } = getStore();

    return (
        /**
         * NOTE: Calling toJS() on an observable object is generally ill-advised
         * It is only done in this case so the <NewMailNotification /> can render properly when
         * it is being animated out, since the <TransitionGroup /> clones the object.
         * If we didn't do this, the data passed in would be nulled out in the cloned
         * <NewMailNotification /> component, causing issues.
         */
        <TransitionGroup className={styles.container}>
            {likeNotifications.map(item => (
                <LikeNotification notification={toJS(item)} key={item.targetLogicalId} />
            ))}
        </TransitionGroup>
    );
});
