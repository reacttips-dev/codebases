import React, { useContext } from 'react';
import { Message } from '@pipedrive/convention-ui-react';
import { ModalContext } from 'components/AddModal/AddModal.context';

import styles from './CappingCounter.pcss';

interface Props {
	usageCapsMapping: any;
	isAccountSettingsEnabled: boolean;
}

export function CappingError({isAccountSettingsEnabled, usageCapsMapping}: Props) {
	const { translator } = useContext(ModalContext);

	return (
		<Message className={styles.errorMessage} color="red" icon="warning" visible alternative={true}>
			<span
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html:
						translator.pgettext(
							'Your company has exceeded the open deals limit. <a>View usage details</a>',
							'Your company has exceeded the open deals limit. %sView usage details%s',
							['<a href="/settings/usage-caps/overview" target="_blank">', '</a>'],
						) +
						(isAccountSettingsEnabled
							? ` ${translator.pgettext('or <a>upgrade now</a>.', 'or %supgrade now%s.', [
									`<a href="/settings/subscription/change?tier=${usageCapsMapping?.nextTier}" target="_blank">`,
									'</a>',
							  ])}`
							: ` ${translator.gettext('or contact an admin user to upgrade now.')}`),
				}}
			/>
		</Message>
	);
}
