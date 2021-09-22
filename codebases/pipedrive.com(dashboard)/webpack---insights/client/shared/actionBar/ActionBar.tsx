import React from 'react';
import classNames from 'classnames';

import styles from './ActionBar.pcss';

interface ActionBarProps {
	className?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ className, children }) => {
	return (
		<div className={classNames(styles.actionBar, className)}>
			{children}
		</div>
	);
};

export default ActionBar;
