import * as React from 'react';
import MeetNowCommandButton from '../MeetNowCommandButton';

import styles from './MeetNowVariants.scss';

export default function MeetNowFolderPaneButton() {
    return <MeetNowCommandButton rootStyles={styles.meetNowRail} scenario={'ModuleSwitcher'} />;
}
