import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import usePlanPermissions from '../../../hooks/usePlanPermissions';
import DisabledHintHover from './DisabledHintHover';

import styles from './RevenueDisabledHint.pcss';

const RevenueForecastDisabledHint: React.FC = ({ children }) => {
	const translator = useTranslator();
	const { isAdmin } = usePlanPermissions();

	const text = isAdmin
		? translator.pgettext(
				'Find your expected revenue for the upcoming period on <strong>Professional</strong> plan.',
				'Find your expected revenue for the upcoming period on %s%s%s plan.',
				[
					`<strong class="${styles.textStrong}">`,
					`${translator.gettext('Professional')}`,
					`</strong>`,
				],
		  )
		: translator.pgettext(
				'To track your revenue forecast, ask an admin to upgrade to <strong>Professional</strong> plan.',
				'To track your revenue forecast, ask an admin to upgrade to %s%s%s plan.',
				[
					`<strong class="${styles.textStrong}">`,
					`${translator.gettext('Professional')}`,
					`</strong>`,
				],
		  );

	return (
		<DisabledHintHover
			text={text}
			title={translator.gettext('Track your revenue forecast')}
		>
			{children}
		</DisabledHintHover>
	);
};

export default RevenueForecastDisabledHint;
