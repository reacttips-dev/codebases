import React from 'react';
import classNames from 'classnames';

import styles from './ActionBarFirstRow.pcss';

interface ActionBarFirstRowProps {
	className?: string;
}

const ActionBarFirstRow: React.FC<ActionBarFirstRowProps> = ({
	className,
	children,
}) => {
	return (
		<div className={classNames(styles.actionBarFirstRow, className)}>
			{children}
		</div>
	);
};

export default ActionBarFirstRow;
