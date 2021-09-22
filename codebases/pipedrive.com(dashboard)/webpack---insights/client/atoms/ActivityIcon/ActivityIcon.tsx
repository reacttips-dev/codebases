import React from 'react';
import { Icon } from '@pipedrive/convention-ui-react';

import styles from './ActivityIcon.pcss';

const ActivityIcon = ({ icon, color }: { icon: string; color: string }) => {
	return (
		<div className={styles.iconBackground} style={{ background: color }}>
			<Icon
				icon={`ac-${icon}`}
				color="white"
				size="s"
				className={styles.icon}
			/>
		</div>
	);
};

export default ActivityIcon;
