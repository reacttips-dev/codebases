import React from 'react';
import classNames from 'classnames';
import { useTranslator } from '@pipedrive/react-utils';
import { Button, Popover, Icon } from '@pipedrive/convention-ui-react';

import { getUserById } from '../../api/webapp';

import styles from './ViewOnlyButton.pcss';

const ViewOnlyButton = ({
	itemOwnerId,
	isDashboard = false,
}: {
	itemOwnerId: number;
	isDashboard?: boolean;
}) => {
	const translator = useTranslator();
	const ownerName = getUserById(itemOwnerId)?.name;

	const getPopoverContent = () => {
		if (isDashboard) {
			return translator.pgettext(
				'You’re a viewer of this dashboard. Only the owner [name] can make changes here.',
				'You’re a %sviewer%s of this dashboard. Only the owner %s%s%s can make changes here.',
				[
					`<strong class="${styles.textStrong}">`,
					'</strong>',
					`<strong class="${styles.textStrong}">`,
					ownerName,
					'</strong>',
				],
			);
		}

		return translator.pgettext(
			'If you make any changes, you can save them as a new report. Only the owner [name] can make changes to this original report.',
			'If you make any changes, you can save them as a new report. Only the owner %s%s%s can make changes to this original report.',
			[`<strong class="${styles.textStrong}">`, ownerName, '</strong>'],
		);
	};

	return (
		<Popover
			className={classNames(styles.popover, {
				[styles.popoverForDashboard]: isDashboard,
			})}
			placement="bottom-end"
			spacing="l"
			content={
				<p
					dangerouslySetInnerHTML={{
						__html: getPopoverContent(),
					}}
				/>
			}
		>
			<Button>
				<Icon icon="pencil-off" size="s" />
				{translator.gettext('View-only')}
				<Icon icon="triangle-down" />
			</Button>
		</Popover>
	);
};

export default ViewOnlyButton;
