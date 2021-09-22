import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import { DialogType } from '../../utils/constants';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import LockedMessage, {
	LockedMessageType,
} from '../../atoms/NotAvailableMessage/LockedMessage';

import styles from './VisualBuilder.pcss';

const ReportCustomfieldLockedMessage: React.FC = () => {
	const translator = useTranslator();
	const { isAdmin } = usePlanPermissions();

	return (
		<LockedMessage
			type={LockedMessageType.REPORT}
			title={translator.gettext('This report is no longer available')}
			message={
				isAdmin
					? translator.pgettext(
							'This report contains custom fields. Upgrade to the Professional plan to get a full overview of your results.',
							'This report contains custom fields. Upgrade to the %s%s%s plan to get a full overview of your results.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
					  )
					: translator.pgettext(
							'This report contains custom fields. Ask an admin user to upgrade to the Professional plan to get a full overview of your results.',
							'This report contains custom fields. Ask an admin user to upgrade to the %s%s%s plan to get a full overview of your results.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
					  )
			}
			buttonText={translator.gettext('Delete this report')}
			buttonAction={DialogType.REPORT_DELETE}
			showUpgrade={isAdmin}
		/>
	);
};

export default ReportCustomfieldLockedMessage;
