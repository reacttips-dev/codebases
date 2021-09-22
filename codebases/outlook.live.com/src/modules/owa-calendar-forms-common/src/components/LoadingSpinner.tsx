import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import * as React from 'react';

import styles from './LoadingSpinner.scss';

export default function LoadingSpinner() {
    return (
        <div className={styles.spinnerContainer}>
            <Spinner size={SpinnerSize.large} className={styles.spinner} />
        </div>
    );
}
