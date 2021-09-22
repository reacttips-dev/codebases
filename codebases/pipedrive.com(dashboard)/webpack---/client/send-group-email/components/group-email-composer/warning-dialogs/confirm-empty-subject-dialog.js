import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from 'utils/translator/translator-hook';

const ConfirmEmptySubjectDialog = ({ setSending, setSendingSubjectStatus, subjectEditor }) => {
	const translator = useTranslator();

	const close = () => {
		setSending(false);
		setSendingSubjectStatus('unchecked');
		subjectEditor.editorEl.focus();
	};
	const send = () => setSendingSubjectStatus('checked');

	return (
		<Dialog
			visible
			closeOnEsc
			onClose={close}
			actions={
				<React.Fragment>
					<Button onClick={close}>{translator.gettext('Cancel')}</Button>
					<Button onClick={send} color="green">
						{translator.gettext('Send anyway')}
					</Button>
				</React.Fragment>
			}
		>
			{translator.gettext('This message has no subject. Do you want to send it anyway?')}
		</Dialog>
	);
};

ConfirmEmptySubjectDialog.propTypes = {
	setSending: PropTypes.func.isRequired,
	setSendingSubjectStatus: PropTypes.func.isRequired,
	subjectEditor: PropTypes.object
};

export default ConfirmEmptySubjectDialog;
