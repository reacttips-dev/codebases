import React from 'react';
import classNames from 'classnames';
import { Panel } from '@pipedrive/convention-ui-react';

import styles from './ReportPanel.pcss';

interface ReportPanelProps {
	className?: string;
	children: React.ReactNode;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ className, children }) => {
	return (
		<Panel
			noBorder
			elevation="01"
			spacing="none"
			radius="s"
			className={classNames(styles.panel, {
				[className]: className,
			})}
		>
			{children}
		</Panel>
	);
};

export default ReportPanel;
