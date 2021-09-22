import React from 'react';
import { Icon, Popover, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import usePlanPermissions from '../../../hooks/usePlanPermissions';

import styles from './RevenueDisabledHint.pcss';

interface DisabledHintHoverProps {
	title: string;
	text: string;
}

const DisabledHintHover: React.FC<DisabledHintHoverProps> = ({
	children,
	title,
	text,
}) => {
	const translator = useTranslator();
	const { isAdmin } = usePlanPermissions();

	return (
		<Popover
			trigger="hover"
			placement="right-start"
			offset="s"
			content={
				<div className={styles.container}>
					<div className={styles.titleWrapper}>
						<Icon
							icon="upgrade"
							size="s"
							className={styles.titleIcon}
						/>
						<span className={styles.title}>{title}</span>
					</div>
					<div
						className={styles.description}
						dangerouslySetInnerHTML={{
							__html: text,
						}}
					/>
					{isAdmin && (
						<div className={styles.buttons}>
							<Button
								color="green"
								href="/settings/subscription/change"
								target="_blank"
							>
								{translator.gettext('Upgrade')}
							</Button>
						</div>
					)}
				</div>
			}
		>
			{children}
		</Popover>
	);
};

export default DisabledHintHover;
