import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import LockedMessage, {
	LockedMessageType,
} from '../../atoms/NotAvailableMessage/LockedMessage';
import { isAdmin } from '../../api/webapp';

import styles from './GoalLockedMessage.pcss';

const GoalLockedMessage: React.FC = () => {
	const translator = useTranslator();
	const isAdminUser = isAdmin();

	return (
		<LockedMessage
			type={LockedMessageType.REPORT}
			title={translator.gettext('This goal is no longer available')}
			message={
				isAdminUser
					? translator.pgettext(
							'Upgrade to the Professional plan to get a full overview of your results.',
							'Upgrade to the %s%s%s plan to get a full overview of your results.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
					  )
					: translator.pgettext(
							'Ask an admin user to upgrade to the Professional plan to get a full overview of your results.',
							'Ask an admin user to upgrade to the %s%s%s plan to get a full overview of your results.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
					  )
			}
			showUpgrade={isAdminUser}
		/>
	);
};

export default GoalLockedMessage;
