import * as React from 'react';
import ReactionNotification from './ReactionNotification';
import { observer } from 'mobx-react-lite';
import getStore from '../../store/store';
import { TransitionGroup } from 'react-transition-group';
import { toJS } from 'mobx';

import styles from './ReactionNotificationHost.scss';

export default observer(function ReactionNotificationHost(props: {}) {
    const { reactionNotifications } = getStore();

    return (
        /**
         * NOTE: Calling toJS() on an observable object is generally ill-advised
         * It is only done in this case so the <ReactionNotification /> can render properly when
         * it is being animated out, since the <TransitionGroup /> clones the object.
         * If we didn't do this, the data passed in would be nulled out in the cloned
         * <ReactionNotification /> component, causing issues.
         */
        <TransitionGroup className={styles.container}>
            {reactionNotifications.map(item => (
                <ReactionNotification notification={toJS(item)} key={item.targetLogicalId} />
            ))}
        </TransitionGroup>
    );
});
