import React from 'react';

import TrafficCone from '../../../utils/svg/TrafficCone.svg';

import styles from '../WidgetNotAvailableMessage/WidgetNotAvailableMessage.pcss';

interface PublicWidgetNotAvailableMessageProps {
	informativeText: string;
}

const PublicWidgetNotAvailableMessage: React.FC<PublicWidgetNotAvailableMessageProps> =
	({ informativeText }) => {
		return (
			<div className={styles.reportNotAvailableContainer}>
				<TrafficCone />
				{informativeText && (
					<p className={styles.informativeText}>{informativeText}</p>
				)}
			</div>
		);
	};

export default PublicWidgetNotAvailableMessage;
