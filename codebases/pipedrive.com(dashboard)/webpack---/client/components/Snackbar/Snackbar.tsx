import React, { useContext } from 'react';
import { Snackbar as CUISnackbar } from '@pipedrive/convention-ui-react';
import { SnackbarConfig } from 'Types/types';
import { ModalContext } from 'components/AddModal/AddModal.context';

type Props = Partial<SnackbarConfig>;

const Snackbar: React.FC<Props> = ({ message, href, onDismiss }) => {
	const { translator } = useContext(ModalContext);

	if (!message) {
		return null;
	}

	const snackbarActionText = translator.pgettext('Snackbar action hyperlink that opens a new view', 'VIEW');

	return (
		<CUISnackbar
			message={message}
			actionText={href ? snackbarActionText : undefined}
			href={href}
			onDismiss={onDismiss}
		/>
	);
};

export default Snackbar;
