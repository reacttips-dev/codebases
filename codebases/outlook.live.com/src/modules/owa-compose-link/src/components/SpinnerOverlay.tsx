import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import styles from './SpinnerOverlay.scss';
function SpinnerOverlay(props: {}) {
    return <Spinner className={styles.linkSpinner} size={SpinnerSize.xSmall} />;
}

export function displaySpinnerOverlay(spinnerContainer: HTMLElement) {
    ReactDOM.render(
        <React.StrictMode>
            <SpinnerOverlay />
        </React.StrictMode>,
        spinnerContainer
    );
}
