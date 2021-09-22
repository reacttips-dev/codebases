import React from 'react';
import classNames from 'classnames';

import styles from './ActionButtons.pcss';

interface ActionButtonsProps {
	className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
	className,
	children,
}) => {
	return (
		<span className={classNames(styles.actionButtons, className)}>
			{children}
		</span>
	);
};

export default ActionButtons;
