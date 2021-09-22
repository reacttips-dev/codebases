import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Panel } from '@pipedrive/convention-ui-react';

import UnderConstruction from '../../utils/svg/UnderConstruction.svg';
import { ERROR_CODES } from '../../utils/constants';
import WidgetNotAvailableMessage from '../NotAvailableMessage/WidgetNotAvailableMessage';
import ReportNotAvailableMessage from '../NotAvailableMessage/ReportNotAvailableMessage';
import PublicWidgetNotAvailableMessage from '../NotAvailableMessage/PublicWidgetNotAvailableMessage';
import LockedMessage, {
	LockedMessageType,
} from '../NotAvailableMessage/LockedMessage';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import ErrorMessage from '../../molecules/ErrorMessage/ErrorMessage';
import { containsErrorWithCode, containsGraphQLError } from './networkErrors';

import styles from './ReportErrorMessage.pcss';

interface ReportErrorMessageProps {
	error?: any;
	isWidget: boolean;
	reportId: string;
	reportName: string;
	isPublicPage: boolean;
	containsInactiveCustomFields?: boolean;
}

const ReportErrorMessage: React.FC<ReportErrorMessageProps> = ({
	error,
	isWidget,
	reportId,
	reportName,
	isPublicPage,
	containsInactiveCustomFields,
}) => {
	const translator = useTranslator();
	const { isAdmin } = usePlanPermissions();

	const hasDeletedCustomFieldError = containsErrorWithCode(
		error,
		ERROR_CODES.REPORT_HAS_DELETED_CUSTOM_FIELD,
	);
	const hasCustomFieldsFlagError = containsErrorWithCode(
		error,
		ERROR_CODES.CUSTOM_FIELDS_FLAG_NOT_ENABLED,
	);
	const hasTooShortIntervalError = containsGraphQLError(
		error,
		'Too short interval',
	);

	if (isPublicPage) {
		return (
			<PublicWidgetNotAvailableMessage
				informativeText={translator.gettext(
					'This report is currently not available.',
				)}
			/>
		);
	}

	if (
		(hasDeletedCustomFieldError || containsInactiveCustomFields) &&
		isWidget
	) {
		return (
			<WidgetNotAvailableMessage
				reportId={reportId}
				reportName={reportName}
				informativeText={translator.gettext(
					'This report contains a custom field that no longer exists.',
				)}
				includesDeleteReportButton
			/>
		);
	}

	if (hasCustomFieldsFlagError && isWidget) {
		return (
			<LockedMessage
				type={LockedMessageType.REPORT}
				size="small"
				message={translator.pgettext(
					'This report contains custom fields that are for Professional plan only.',
					'This report contains custom fields that are for %s%s%s plan only.',
					[
						`<strong class="${styles.textStrong}">`,
						`${translator.gettext('Professional')}`,
						`</strong>`,
					],
				)}
				buttonText={
					isAdmin
						? translator.gettext('Remove')
						: translator.gettext('Remove from dashboard')
				}
				buttonAction="REMOVE_FROM_DASHBOARD"
				showUpgrade={isAdmin}
				reportId={reportId}
				reportName={reportName}
			/>
		);
	}

	if (
		hasDeletedCustomFieldError ||
		hasCustomFieldsFlagError ||
		containsInactiveCustomFields
	) {
		return (
			<ReportNotAvailableMessage
				title={translator.gettext(
					'This report is no longer available.',
				)}
				informativeText={translator.gettext(
					'This report contains a custom field that no longer exists.',
				)}
			/>
		);
	}

	if (hasTooShortIntervalError) {
		return (
			<>
				<Panel
					radius="s"
					elevation="01"
					noBorder
					className={styles.panel}
				>
					<UnderConstruction />

					<p className={styles.informativeText}>
						{translator.gettext(
							'Please select a shorter forecast duration to view results.',
						)}
					</p>
				</Panel>
			</>
		);
	}

	if (error) {
		return (
			<div className={styles.errorMessage}>
				<ErrorMessage allowed />
			</div>
		);
	}

	return null;
};

export default ReportErrorMessage;
