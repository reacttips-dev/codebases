import React from 'react';
import classnames from 'classnames';
import { Panel, Icon } from '@pipedrive/convention-ui-react';

import styles from './NoDataPanel.pcss';

interface NoDataPanelProps {
	loading?: boolean;
	message?: string;
}

const NoDataPanel: React.FC<NoDataPanelProps> = ({ loading, message }) => {
	const messageWrapper = (
		<div
			className={styles.messageContainer}
			data-test="no-data-message-container"
		>
			{message}
		</div>
	);

	const icon = (
		<div className={styles.noDataPanelIcon}>
			<Icon icon="warning" size="s" color="yellow" />
		</div>
	);

	return (
		<Panel
			className={classnames(styles.noDataPanel, {
				[styles['is-loading']]: loading,
			})}
			noBorder
			spacing="s"
		>
			{icon}

			{messageWrapper}
		</Panel>
	);
};

export default React.memo(NoDataPanel);
