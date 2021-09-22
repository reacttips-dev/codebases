import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spinner, Snackbar } from '@pipedrive/convention-ui-react';
import { useTranslator } from 'utils/translator/translator-hook';
import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import Recipient from './recipient';
import AddRecipients from '../add-recipients';
import { getRecipientsFromMessages } from '../../../utils/recipients';
import useStore from '../../../store';
import {
	restoreRecoverableRecipient,
	removeRecoverableRecipient
} from '../../../actions/recipients';

const Container = styled.div`
	display: flex;
	width: 320px;
	flex-direction: column;
	border-right: 1px solid ${colors['$color-black-hex-12']};
`;
const Title = styled.div`
	font: ${fonts['$font-title-l']};
	margin: 16px 16px 8px;
	flex: 0 0 auto;
`;
const Recipients = styled.div`
	overflow: auto;
	margin-top: 8px;
	padding: 0px 16px 8px;
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
`;

const RecipientSpinner = styled(Spinner)`
	align-self: center;
	margin: auto 0px;
`;

const RecipientList = ({ recipientsFieldErrors, recipientsLoading, viewType }) => {
	const translator = useTranslator();
	const { state, actions } = useStore({
		restoreRecoverableRecipient,
		removeRecoverableRecipient
	});
	const { messages, recoverableRecipients, validatedEmails } = state;
	const messagesCount = messages.length;
	const recipients = useMemo(() => getRecipientsFromMessages(messages, recipientsFieldErrors), [
		messages,
		recipientsFieldErrors
	]);
	const recipientsIds = recipients.map(({ id }) => id);
	const getMessagesCountForRecipient = (recipient, viewtype) => {
		switch (viewtype) {
			case 'deal':
				return recipient.deals.length;
			case 'activity':
				return recipient.activities.length;
			default:
				return 1;
		}
	};

	return (
		<Container vertical="s" horizontal="m">
			<Title>
				{recipientsLoading
					? translator.gettext('Recipients')
					: translator.gettext('Recipients (%d)', recipients.length)}
			</Title>
			<AddRecipients recipientsIds={recipientsIds} messagesCount={messagesCount} />
			<Recipients>
				{recipientsLoading ? (
					<RecipientSpinner />
				) : (
					recipients.map((recipient) => (
						<Recipient
							key={recipient.id}
							validatedEmails={validatedEmails}
							messagesCount={getMessagesCountForRecipient(recipient, viewType)}
							viewType={viewType}
							{...recipient}
						/>
					))
				)}
			</Recipients>
			{recoverableRecipients.map(({ id, name }) => {
				return (
					<Snackbar
						key={id}
						message={translator.pgettext(
							'Group email recipient removed',
							'%s removed',
							name
						)}
						actionText={translator.gettext('Undo')}
						onClick={() => actions.restoreRecoverableRecipient(id)}
						onDismiss={() => actions.removeRecoverableRecipient(id)}
					/>
				);
			})}
		</Container>
	);
};

RecipientList.propTypes = {
	recipientsFieldErrors: PropTypes.array.isRequired,
	validatedEmails: PropTypes.object,
	recipientsLoading: PropTypes.bool,
	viewType: PropTypes.string
};

export default RecipientList;
