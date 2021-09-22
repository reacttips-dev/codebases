import React from 'react';
import classNames from 'classnames';
import { Spacing, Panel, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import LockedIcon from './LockedIcon';

import styles from './LockedMessagePanel.pcss';

export enum LockedMessageType {
	REPORT = 'report',
	DASHBOARD = 'dashboard',
}

interface LockedMessagePanelProps {
	type: LockedMessageType;
	size?: 'small';
	title?: string | false;
	message: string;
	showUpgrade?: boolean;
	buttonText?: string;
	hasMargin?: boolean;
	onButtonClick: () => void;
}

const LockedMessagePanel: React.FC<LockedMessagePanelProps> = ({
	size,
	hasMargin,
	showUpgrade,
	title,
	buttonText,
	onButtonClick,
	message,
	type,
}) => {
	const translator = useTranslator();
	const isSmall = size === 'small';

	return (
		<Panel
			radius="s"
			elevation={isSmall ? null : '01'}
			noBorder
			className={classNames(styles.panel, {
				[styles.panelSmall]: isSmall,
				[styles.panelHasMargin]: hasMargin,
			})}
			data-test={`locked-message-${type}`}
		>
			<LockedIcon isSmall={isSmall} type={type} />
			<Spacing top={isSmall ? 'm' : 'xl'} bottom={isSmall ? 'm' : 'l'}>
				{title && <h1 className={styles.title}>{title}</h1>}
				{/* eslint-disable-next-line react/no-danger */}
				<h2 dangerouslySetInnerHTML={{ __html: message }} />
			</Spacing>
			<div className={styles.buttonGroup}>
				{showUpgrade && (
					<Button
						href="/settings/subscription/change"
						target="_blank"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						{translator.gettext('Upgrade')}
					</Button>
				)}
				{buttonText && (
					<Button
						onClick={(e) => {
							e.stopPropagation();

							onButtonClick();
						}}
					>
						{buttonText}
					</Button>
				)}
			</div>
		</Panel>
	);
};

export default LockedMessagePanel;
