import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import { DialogType } from '../../utils/constants';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import LockedMessage, {
	LockedMessageType,
} from '../../atoms/NotAvailableMessage/LockedMessage';

import styles from './VisualBuilder.pcss';

interface ReportRecurringRevenueLockedMessageProps {
	reportType: insightsTypes.ReportType;
}

const ReportRevenueLockedMessage: React.FC<ReportRecurringRevenueLockedMessageProps> =
	({ reportType }) => {
		const translator = useTranslator();
		const { isAdmin, getCurrentCompanyPlan } = usePlanPermissions();

		const revenueMovementAdminText = translator.pgettext(
			'Recurring revenue growth report is not available on Essential|Advanced plan. Upgrade to the Professional plan to get a full overview of your results.',
			'Recurring revenue growth report is not available on the %s plan. Upgrade to the %s%s%s plan to get a full overview of your results.',
			[
				`${translator.gettext(getCurrentCompanyPlan())}`,
				`<strong class="${styles.textStrong}">`,
				`${translator.gettext('Professional')}`,
				`</strong>`,
			],
		);

		const recurringRevenueAdminText = translator.pgettext(
			'Recurring revenue report is not available on the Essential plan. Upgrade to the Advanced plan to track your recurring revenue.',
			'Recurring revenue report is not available on the Essential plan. Upgrade to the %s%s%s plan to track your recurring revenue.',
			[
				`<strong class="${styles.textStrong}">`,
				`${translator.gettext('Advanced')}`,
				`</strong>`,
			],
		);

		const revenueMovementRegularText = translator.pgettext(
			'Recurring revenue growth report is not available on Essential|Advanced plan. Ask an admin user to upgrade to the Professional plan to get a full overview of your results.',
			'Recurring revenue growth report is not available on the %s plan. Ask an admin user to upgrade to the %s%s%s plan to get a full overview of your results.',
			[
				`${translator.gettext(getCurrentCompanyPlan())}`,
				`<strong class="${styles.textStrong}">`,
				`${translator.gettext('Professional')}`,
				`</strong>`,
			],
		);

		const recurringRevenueRegularText = translator.pgettext(
			'Recurring revenue report is not available on the Essential plan. Ask an admin user to upgrade to the Advanced plan to track your recurring revenue.',
			'Recurring revenue report is not available on the Essential plan. Ask an admin user to upgrade to the %s%s%s plan to track your recurring revenue.',
			[
				`<strong class="${styles.textStrong}">`,
				`${translator.gettext('Advanced')}`,
				`</strong>`,
			],
		);

		const adminMessage =
			reportType ===
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT
				? revenueMovementAdminText
				: recurringRevenueAdminText;

		const regularUserMessage =
			reportType ===
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT
				? revenueMovementRegularText
				: recurringRevenueRegularText;

		return (
			<LockedMessage
				type={LockedMessageType.REPORT}
				title={translator.gettext('This report is no longer available')}
				message={isAdmin ? adminMessage : regularUserMessage}
				buttonText={translator.gettext('Delete this report')}
				buttonAction={DialogType.REPORT_DELETE}
				showUpgrade={isAdmin}
			/>
		);
	};

export default ReportRevenueLockedMessage;
