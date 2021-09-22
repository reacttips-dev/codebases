import * as React from 'react';
import getStore from '../../store/store';
import { ForwardingNoticeNotification } from './ForwardingNoticeNotification';
import { loadForwardingConfiguration } from '../../actions/loadForwardingConfiguration';
import { observer } from 'mobx-react-lite';
import { forwardingNoticeDismissed } from '../../actions/forwardingNoticeDismissed';
import { lazyMountAndShowFullOptions } from 'owa-options-view';

const openForwardingOptions = () => {
    lazyMountAndShowFullOptions.importAndExecute('mail', 'forwarding');
    forwardingNoticeDismissed();
};

export const ForwardingNoticeNotificationHost = observer(
    function ForwardingNoticeNotificationHost(props: {}) {
        React.useEffect(() => {
            loadForwardingConfiguration();
        }, []);

        const { forwardingNotice } = getStore();
        return (
            <>
                {forwardingNotice.showForwardingNotice ? (
                    <ForwardingNoticeNotification
                        forwardingAddress={forwardingNotice.forwardingAddress}
                        onDismiss={forwardingNoticeDismissed}
                        onTurnOff={openForwardingOptions}
                    />
                ) : null}
            </>
        );
    }
);
