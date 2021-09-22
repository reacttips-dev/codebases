import * as React from 'react';
import MeetNowCommandButton from '../MeetNowCommandButton';

import styles from './MeetNowVariants.scss';

export default function MeetNowSuiteHeaderButton() {
    return (
        <MeetNowCommandButton rootStyles={styles.meetNowButtonContainer} scenario={'SuiteHeader'} />
    );
}
