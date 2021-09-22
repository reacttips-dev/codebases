import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import usePlanPermissions from '../../../hooks/usePlanPermissions';
import DisabledHintHover from './DisabledHintHover';

import styles from './RevenueDisabledHint.pcss';

const RecurringRevenueMovementDisabledHover: React.FC = ({ children }) => {
	const translator = useTranslator();
	const { isAdmin } = usePlanPermissions();

	const text = isAdmin
		? translator.pgettext(
				'See how is your recurring revenue changing over time on <strong>Professional</strong> plan.',
				'See how is your recurring revenue changing over time on %s%s%s plan.',
				[
					`<strong class="${styles.textStrong}">`,
					`${translator.gettext('Professional')}`,
					`</strong>`,
				],
		  )
		: translator.pgettext(
				'To see how your revenue changes over time, ask an admin to upgrade to the <strong>Professional</strong> plan.',
				'To see how your revenue changes over time, ask an admin to upgrade to the %s%s%s plan.',
				[
					`<strong class="${styles.textStrong}">`,
					`${translator.gettext('Professional')}`,
					`</strong>`,
				],
		  );

	return (
		<DisabledHintHover
			text={text}
			title={translator.gettext('Track your revenue growth')}
		>
			{children}
		</DisabledHintHover>
	);
};

export default RecurringRevenueMovementDisabledHover;
