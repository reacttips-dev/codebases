import React from 'react';
import { Translator, useTranslator } from '@pipedrive/react-utils';

import ModalMessage from '../ModalMessage';
import { isAdmin } from '../../api/webapp';
import { showCappingFeatures } from '../../shared/featureCapping/cappingUtils';
import { LIMIT_FOR_DIAMOND_IN_THE_BACKGROUND } from '../../shared/featureCapping/cappingConstants';

import styles from './ReportCreationErrorMessage.pcss';
import { getCapMapping } from '../../api/commands/capping';

interface ReportCreationErrorMessageProps {
	numberOfReports: number;
	limitAsString: string;
	error?: string | false;
	shouldNotDisplayReportLimitMessage?: boolean;
	hasReachedReportsLimit?: boolean;
	isNearReportsLimit?: boolean;
	showLimitForSaveAsNew?: boolean;
	onClose?: () => void;
}

const getWarningText = ({
	hasReachedReportsLimit,
	showLimitForSaveAsNew,
	translator,
	isNearReportsLimit,
	limitAsString,
	nextTier,
}: {
	hasReachedReportsLimit: boolean;
	showLimitForSaveAsNew: boolean;
	translator: Translator;
	isNearReportsLimit: boolean;
	limitAsString: string;
	nextTier: string;
}) => {
	if (hasReachedReportsLimit && !showCappingFeatures(false)) {
		return translator.pgettext(
			'Can’t create the report as you have reached the reports limit of [450].',
			'Can’t create the report as you have reached the reports limit of %s.',
			[LIMIT_FOR_DIAMOND_IN_THE_BACKGROUND],
		);
	}

	if (hasReachedReportsLimit && showLimitForSaveAsNew) {
		if (isAdmin()) {
			return translator.pgettext(
				'Can’t save report as new because you have exceeded the reports limit. [View usage button] or [Upgrade now button].',
				'Can’t save report as new because you have exceeded the reports limit. %sView usage%s or %supgrade now%s.',
				[
					`<a href="/settings/usage-caps" target="_blank" class="${styles.textStrong}">`,
					'</a>',
					`<a href="/settings/subscription/change?tier=${nextTier}" target="_blank" class="${styles.textStrong}">`,
					'</a>',
				],
			);
		}

		return translator.pgettext(
			'Can’t save report as new because you have exceeded the reports limit. [View usage button] or contact an admin user to upgrade now.',
			'Can’t save report as new because you have exceeded the reports limit. %sView usage%s or contact an admin user to upgrade now.',
			[
				`<a href="/settings/usage-caps" target="_blank" class="${styles.textStrong}">`,
				'</a>',
			],
		);
	}

	if (isNearReportsLimit && !showLimitForSaveAsNew) {
		if (isAdmin()) {
			return translator.pgettext(
				'You have used [number] of reports. [View usage button] or [Upgrade now button].',
				'You have used %s of reports. %sView usage%s or %supgrade now%s.',
				[
					limitAsString,
					`<a href="/settings/usage-caps" target="_blank" class="${styles.textStrong}">`,
					'</a>',
					`<a href="/settings/subscription/change?tier=${nextTier}" target="_blank" class="${styles.textStrong}">`,
					'</a>',
				],
			);
		}

		return translator.pgettext(
			'You have used [number] of reports. [View usage button] or contact an admin user to upgrade now.',
			'You have used %s of reports. %sView usage%s or contact an admin user to upgrade now.',
			[
				limitAsString,
				`<a href="/settings/usage-caps" target="_blank" class="${styles.textStrong}">`,
				'</a>',
			],
		);
	}

	return '';
};

const ReportCreationErrorMessage: React.FC<ReportCreationErrorMessageProps> = ({
	error,
	shouldNotDisplayReportLimitMessage = false,
	hasReachedReportsLimit = false,
	isNearReportsLimit = false,
	limitAsString,
	showLimitForSaveAsNew = false,
	onClose,
}) => {
	const translator = useTranslator();
	const { nextTier } = getCapMapping();

	if (error) {
		return <ModalMessage content={error} />;
	}

	if (shouldNotDisplayReportLimitMessage) {
		return null;
	}

	const warning = getWarningText({
		hasReachedReportsLimit,
		showLimitForSaveAsNew,
		translator,
		isNearReportsLimit,
		limitAsString,
		nextTier,
	});

	if (warning) {
		return (
			<ModalMessage
				isWarning
				content={
					<div
						dangerouslySetInnerHTML={{
							__html: warning,
						}}
						data-test="report-creation-error-message"
					/>
				}
				{...(onClose ? { onClose } : {})}
			/>
		);
	}

	return null;
};

export default ReportCreationErrorMessage;
