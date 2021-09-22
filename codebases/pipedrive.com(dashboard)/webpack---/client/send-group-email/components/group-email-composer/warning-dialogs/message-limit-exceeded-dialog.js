import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button, Text } from '@pipedrive/convention-ui-react';
import { useTranslator } from 'utils/translator/translator-hook';
import { MAX_MESSAGES_PER_GROUP_EMAIL } from '../../../constants';

const MessageLimitExceededDialog = ({
	viewType,
	selectedItemsCount,
	setDialogVisibility,
	isDialogVisible,
	setModalVisibility
}) => {
	const translator = useTranslator();
	const getActionText = (viewType) => {
		switch (viewType) {
			case 'person':
				return translator.gettext(
					'You have selected %s %s people%s, but group emails can only be sent to %s max. %s %s at a time.',
					[
						'<strong>',
						selectedItemsCount,
						'</strong>',
						'<strong>',
						MAX_MESSAGES_PER_GROUP_EMAIL,
						'</strong>'
					]
				);
			case 'activity':
				return translator.gettext(
					'You have selected %s %s activities%s, but group emails can only be sent to %s max. %s %s at a time.',
					[
						'<strong>',
						selectedItemsCount,
						'</strong>',
						'<strong>',
						MAX_MESSAGES_PER_GROUP_EMAIL,
						'</strong>'
					]
				);
			case 'deal':
				return translator.gettext(
					'You have selected %s %s deals%s, but group emails can only be sent to %s max. %s %s at a time.',
					[
						'<strong>',
						selectedItemsCount,
						'</strong>',
						'<strong>',
						MAX_MESSAGES_PER_GROUP_EMAIL,
						'</strong>'
					]
				);
			default:
				'';
		}
	};
	const openModal = () => {
		setDialogVisibility(false);
		setModalVisibility(true);
	};
	const closeDialog = () => {
		setDialogVisibility(false);
	};

	return (
		<Dialog
			visible={isDialogVisible}
			closeOnEsc
			actionsLayout="column"
			onClose={closeDialog}
			actions={
				<React.Fragment>
					<Button onClick={closeDialog}>
						{translator.gettext('Go back and select again')}
					</Button>
					<Button color="green" onClick={openModal}>
						{translator.gettext(
							'Continue sending to first %s',
							MAX_MESSAGES_PER_GROUP_EMAIL
						)}
					</Button>
				</React.Fragment>
			}
		>
			<Text dangerouslySetInnerHTML={{ __html: getActionText(viewType) }} />
		</Dialog>
	);
};

MessageLimitExceededDialog.propTypes = {
	viewType: PropTypes.string.isRequired,
	selectedItemsCount: PropTypes.number.isRequired,
	setDialogVisibility: PropTypes.func.isRequired,
	setModalVisibility: PropTypes.func.isRequired,
	isDialogVisible: PropTypes.bool.isRequired
};

export default MessageLimitExceededDialog;
