import React from 'react';
import { Translator } from '@pipedrive/react-utils';

import { ModalType } from '../../utils/constants';
import { LockedDialog } from '..';

import styles from './DashboardLockedDialog.pcss';

interface DashboardLockedDialogProps {
	isAdmin: boolean;
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType>>;
	translator: Translator;
}

const DashboardLockedDialog: React.FC<DashboardLockedDialogProps> = ({
	isAdmin,
	setVisibleModal,
	translator,
}) => {
	return (
		<LockedDialog
			labels={{
				title: translator.gettext(
					'Multiple dashboards available on Professional',
				),
				message: isAdmin
					? translator.pgettext(
							'Upgrade to the Professional plan and get multiple dashboards to clearly organize your results.',
							'Upgrade to the %s%s%s plan and get multiple dashboards to clearly organize your results.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
					  )
					: translator.pgettext(
							'Ask an admin user to upgrade to the Professional plan and get multiple dashboards to clearly organize your results.',
							'Ask an admin user to upgrade to the %s%s%s plan and get multiple dashboards to clearly organize your results.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
					  ),
				cancelButtonText: isAdmin
					? translator.gettext('Not now')
					: translator.gettext('Got it'),
				agreeButtonText: isAdmin ? translator.gettext('Upgrade') : null,
				link: isAdmin
					? null
					: translator.gettext('Learn more about dashboards'),
			}}
			setVisibleModal={setVisibleModal}
		/>
	);
};

export default DashboardLockedDialog;
