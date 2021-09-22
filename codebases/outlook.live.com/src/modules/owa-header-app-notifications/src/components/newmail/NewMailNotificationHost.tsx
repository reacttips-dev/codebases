import * as React from 'react';
import NewMailNotification from './NewMailNotification';
import { observer } from 'mobx-react-lite';
import getStore from '../../store/store';
import { TransitionGroup } from 'react-transition-group';
import { toJS } from 'mobx';
import { raiseNewEmailNotification } from '../../utils/raiseHostNotification';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import styles from './NewMailNotificationHost.scss';
import classnamesBind from 'classnames/bind';
const classnames = classnamesBind.bind(styles);

export default observer(function NewMailNotificationsHost(props: {}) {
    const { newMailNotifications } = getStore();
    newMailNotifications.map(item => {
        raiseNewEmailNotification(item);
    });

    const isMonarch = isHostAppFeatureEnabled('nativeResolvers');
    return isMonarch ? null : (
        /**
         * NOTE: Calling toJS() on an observable object is generally ill-advised
         * It is only done in this case so the <NewMailNotification /> can render properly when
         * it is being animated out, since the <TransitionGroup /> clones the object.
         * If we didn't do this, the data passed in would be nulled out in the cloned
         * <NewMailNotification /> component, causing issues.
         */
        <TransitionGroup
            className={
                isMonarch
                    ? classnames(styles.newEmailNotificationExit)
                    : classnames(styles.container)
            }>
            {newMailNotifications.map(item => (
                <NewMailNotification notification={toJS(item)} key={item.ItemId} />
            ))}
        </TransitionGroup>
    );
});
