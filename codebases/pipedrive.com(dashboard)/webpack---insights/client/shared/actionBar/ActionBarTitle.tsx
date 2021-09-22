import React from 'react';
import { Icon, Tooltip, EditableText } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { getSharedItemTooltipContent } from '../../utils/messagesUtils';

import styles from './ActionBarTitle.pcss';

interface ActionBarTitleProps {
	title: string;
	onChange: (value: string) => void;
	isSharedReport?: boolean;
	readOnly?: boolean;
}

const ActionBarTitle: React.FC<ActionBarTitleProps> = ({
	title,
	isSharedReport = false,
	onChange,
	readOnly,
}: ActionBarTitleProps) => {
	const translator = useTranslator();

	const getTitleIcon = () => {
		return (
			<Tooltip
				placement="bottom"
				content={getSharedItemTooltipContent({
					isSharedReport,
					translator,
				})}
				portalTo={document.body}
			>
				<Icon icon="team-folder" color="black-32" />
			</Tooltip>
		);
	};

	return (
		<div className={styles.titleWrap} data-test="action-bar-title">
			<EditableText
				key={title}
				tagType="h3"
				onChange={(value) => onChange(value)}
				className={styles.title}
				tooltipProps={{
					placement: 'bottom',
					portalTo: document.body,
				}}
				placeholder={title}
				readOnly={readOnly}
			>
				{title}
			</EditableText>

			{isSharedReport && getTitleIcon()}
		</div>
	);
};

export default ActionBarTitle;
