import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import usePlanPermissions from '../../hooks/usePlanPermissions';
import LockedMessage, {
	LockedMessageType,
} from '../../atoms/NotAvailableMessage/LockedMessage';

import styles from './Widget.pcss';

interface CustomfieldLockedMessageProps {
	reportId: string;
	reportName: string;
}

const CustomfieldLockedMessage: React.FC<CustomfieldLockedMessageProps> = ({
	reportId,
	reportName,
}) => {
	const translator = useTranslator();
	const { isAdmin } = usePlanPermissions();

	return (
		<LockedMessage
			type={LockedMessageType.REPORT}
			size="small"
			hasMargin
			message={translator.pgettext(
				'This report contains custom fields that are for Professional plan only.',
				'This report contains custom fields that are for %s%s%s plan only.',
				[
					`<strong class="${styles.textStrong}">`,
					`${translator.gettext('Professional')}`,
					`</strong>`,
				],
			)}
			buttonText={translator.gettext('Remove from dashboard')}
			buttonAction="REMOVE_FROM_DASHBOARD"
			showUpgrade={isAdmin}
			reportId={reportId}
			reportName={reportName}
		/>
	);
};

export default CustomfieldLockedMessage;
