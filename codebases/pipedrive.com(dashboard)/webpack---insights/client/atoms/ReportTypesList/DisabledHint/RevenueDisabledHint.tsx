import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import usePlanPermissions from '../../../hooks/usePlanPermissions';
import DisabledHintHover from './DisabledHintHover';

import styles from './RevenueDisabledHint.pcss';

const RevenueMovementHover: React.FC = ({ children }) => {
	const translator = useTranslator();
	const { isAdmin } = usePlanPermissions();

	const text = isAdmin
		? translator.pgettext(
				'See how is your recurring revenue changing over time on <strong>Professional</strong> plan.',
				'See what is your sales revenue from subscriptions and payment schedules on %s%s%s plan.',
				[
					`<strong class="${styles.textStrong}">`,
					`${translator.gettext('Advanced')}`,
					`</strong>`,
				],
		  )
		: translator.pgettext(
				'Ask an admin user to upgrade to <strong>Professional</strong> plan to see how your revenue changes over time.',
				'Ask an admin user to upgrade to %s%s%s plan to see how your revenue changes over time.',
				[
					`<strong class="${styles.textStrong}">`,
					`${translator.gettext('Advanced')}`,
					`</strong>`,
				],
		  );

	return (
		<DisabledHintHover
			text={text}
			title={translator.gettext('Track your subscriptions revenue')}
		>
			{children}
		</DisabledHintHover>
	);
};

export default RevenueMovementHover;
