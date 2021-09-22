import React from 'react';

import LockedReport from '../../../utils/svg/LockedReport.svg';
import Locked from '../../../utils/svg/Locked.svg';
import LockedDashboard from '../../../utils/svg/LockedDashboard.svg';
import { LockedMessageType } from './LockedMessage';

import styles from './LockedMessagePanel.pcss';

interface LockedIconProps {
	type: LockedMessageType;
	isSmall: boolean;
}

const LockedIcon: React.FC<LockedIconProps> = ({ type, isSmall }) => {
	if (isSmall) {
		return <Locked className={styles.smallIcon} />;
	}

	if (type === LockedMessageType.DASHBOARD) {
		return <LockedDashboard />;
	}

	if (type === LockedMessageType.REPORT) {
		return <LockedReport />;
	}

	return null;
};

export default LockedIcon;
