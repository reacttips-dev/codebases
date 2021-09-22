import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { continueGetDataFromParentWindow } from '../utils/getDataFromParentWindow';
import { getStore } from '../store/childStore';
import { isFeatureEnabled } from 'owa-feature-flags';
import { PopoutChildState } from '../store/schema/PopoutChildStore';
import { Spinner } from '@fluentui/react/lib/Spinner';

export interface PopoutLoadingViewProps {
    loadingString: string;
}

import styles from './PopoutLoadingView.scss';

export default observer(function PopoutLoadingView(props: PopoutLoadingViewProps) {
    React.useEffect(() => {
        if (!isFeatureEnabled('rp-popoutsDebug')) {
            loadData();
        }
    }, []);
    const renderSpinner = () => {
        return (
            <span>
                <Spinner />
                {props.loadingString}
            </span>
        );
    };
    return (
        <div className={styles.view}>
            {getStore().state == PopoutChildState.Loading ? renderSpinner() : renderDebugButton()}
        </div>
    );
});

function loadData() {
    continueGetDataFromParentWindow();
}

function renderDebugButton() {
    // This UI is only visible when rp-popoutsDebug flight is enabled, and is used for debugging only,
    // so no need to be localized
    return <button onClick={loadData}>Get Data</button>;
}
