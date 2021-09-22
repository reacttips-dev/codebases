import React, { useEffect, useState } from 'react';
import { Icon } from '@pipedrive/convention-ui-react';

import styles from './SidemenuItemGroup.pcss';

interface SidemenuItemGroupProps {
	heading: string;
	children?: React.ReactNode;
	isCollapsedDefault?: boolean;
	noItemsMessage?: string;
}

const SidemenuItemGroup: React.FC<SidemenuItemGroupProps> = ({
	heading,
	children,
	isCollapsedDefault = false,
	noItemsMessage = '',
}) => {
	const [collapsed, setCollapsed] = useState(isCollapsedDefault);
	const hasChildren = !!React.Children.count(children);

	useEffect(() => {
		if (!isCollapsedDefault) {
			setCollapsed(false);
		}
	}, [isCollapsedDefault]);

	const renderContent = () => {
		if (hasChildren) {
			return children;
		}

		return <span className={styles.noItemsMessage}>{noItemsMessage}</span>;
	};

	return (
		<li>
			<span
				className={styles.subItemsHeader}
				onClick={() => setCollapsed(!collapsed)}
			>
				<Icon
					icon={collapsed ? 'arrow-right' : 'arrow-down'}
					size="s"
					color="black-64"
					className={styles.icon}
				/>
				<span className={styles.heading}>{heading}</span>
			</span>
			{!collapsed && (
				<ul className={styles.subItems}>{renderContent()}</ul>
			)}
		</li>
	);
};

export default SidemenuItemGroup;
