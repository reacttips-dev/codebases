import React from 'react';
import { Tooltip } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { ReportParentType } from '../../../utils/constants';
import RecurringRevenueMovementDisabledHint from './RecurringRevenueMovementDisabledHint';
import RevenueDisabledHint from './RevenueDisabledHint';
import RevenueForecastDisabledHint from './RevenueForecastDisabledHint';

interface DisabledHoverProps {
	reportParentType: ReportParentType;
	dataType: insightsTypes.DataType;
	children: React.ReactNode;
}

const DisabledHint: React.FC<DisabledHoverProps> = ({
	reportParentType,
	children,
	dataType,
}) => {
	const translator = useTranslator();

	if (reportParentType === ReportParentType.RECURRING_REVENUE_MOVEMENT) {
		return (
			<RecurringRevenueMovementDisabledHint>
				{children}
			</RecurringRevenueMovementDisabledHint>
		);
	}

	if (reportParentType === ReportParentType.RECURRING_REVENUE) {
		return <RevenueDisabledHint>{children}</RevenueDisabledHint>;
	}

	if (reportParentType === ReportParentType.REVENUE_FORECAST) {
		return (
			<RevenueForecastDisabledHint>
				{children}
			</RevenueForecastDisabledHint>
		);
	}

	return (
		<Tooltip
			placement="top"
			content={<span>{translator.gettext('Coming soon')}</span>}
			key={dataType}
		>
			{children}
		</Tooltip>
	);
};

export default DisabledHint;
