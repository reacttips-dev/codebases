import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import LockedMessage, {
	LockedMessageType,
} from '../../atoms/NotAvailableMessage/LockedMessage';
import { isAdmin } from '../../api/webapp';

import styles from './Widget.pcss';

interface GoalWidgetLockedMessageProps {
	reportId: string;
	goalName: string;
}

const GoalWidgetLockedMessage: React.FC<GoalWidgetLockedMessageProps> = ({
	reportId,
	goalName,
}) => {
	const translator = useTranslator();

	return (
		<LockedMessage
			type={LockedMessageType.REPORT}
			size="small"
			hasMargin
			message={translator.pgettext(
				'This goal is for Professional plan only. ',
				'This goal is for %s%s%s plan only.',
				[
					`<strong class="${styles.textStrong}">`,
					translator.gettext('Professional'),
					`</strong>`,
				],
			)}
			buttonText={translator.gettext('Remove from dashboard')}
			buttonAction="REMOVE_FROM_DASHBOARD"
			showUpgrade={isAdmin()}
			reportId={reportId}
			reportName={goalName}
		/>
	);
};

export default GoalWidgetLockedMessage;
