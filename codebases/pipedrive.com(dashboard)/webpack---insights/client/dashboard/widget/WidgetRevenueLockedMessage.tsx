import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import usePlanPermissions from '../../hooks/usePlanPermissions';
import LockedMessage, {
	LockedMessageType,
} from '../../atoms/NotAvailableMessage/LockedMessage';

import styles from './Widget.pcss';

interface RecurringRevenueLockedMessageProps {
	reportId: string;
	reportName: string;
}

const ChartRevenueLockedMessage: React.FC<RecurringRevenueLockedMessageProps> =
	({ reportId, reportName }) => {
		const translator = useTranslator();
		const { isAdmin } = usePlanPermissions();

		const message = translator.pgettext(
			'This report is for Professional plan only. ',
			'This report is for %s%s%s plan only.',
			[
				`<strong class="${styles.textStrong}">`,
				`${
					insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT
						? translator.gettext('Professional')
						: translator.gettext('Advanced')
				}`,
				`</strong>`,
			],
		);

		return (
			<LockedMessage
				type={LockedMessageType.REPORT}
				size="small"
				hasMargin
				message={message}
				buttonText={translator.gettext('Remove from dashboard')}
				buttonAction="REMOVE_FROM_DASHBOARD"
				showUpgrade={isAdmin}
				reportId={reportId}
				reportName={reportName}
			/>
		);
	};

export default ChartRevenueLockedMessage;
