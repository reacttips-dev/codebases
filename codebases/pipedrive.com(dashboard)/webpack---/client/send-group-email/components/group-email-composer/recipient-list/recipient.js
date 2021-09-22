import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Avatar, Button } from '@pipedrive/convention-ui-react';
import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';
import RecipientWarnings from './recipient-warnings';
import { UsageTrackingContext } from 'shared/contexts';
import useStore from '../../../store';
import { removeRecipient } from '../../../actions/recipients';

const RecipientContainer = styled.div`
	display: grid;
	grid-template-columns: 40px auto 24px;
	grid-gap: 8px;
	padding: 8px 0;
	align-items: center;
`;
const NameAndEmail = styled.div`
	overflow: hidden;
	margin-left: 4px;
`;
const Text = styled.div`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	font: ${fonts['$font-body']};
`;

const Recipient = ({
	id,
	name,
	picture,
	email,
	fieldErrors,
	messagesCount,
	viewType,
	validatedEmails
}) => {
	const usageTracking = useContext(UsageTrackingContext);
	const { actions } = useStore({ removeRecipient });

	return (
		<RecipientContainer>
			<Avatar size="l" name={name} img={picture} />
			<NameAndEmail data-ui-test-id="group-email-recipient-name-and-email">
				<Text>{name}</Text>
				<RecipientWarnings
					email={email}
					fieldErrors={fieldErrors}
					validatedEmails={validatedEmails}
					messagesCount={messagesCount}
					viewType={viewType}
				/>
			</NameAndEmail>
			<Button
				color="ghost"
				size="s"
				onClick={() => {
					actions.removeRecipient(id, name);
					usageTracking.sendMetrics('group_email_modal', 'interacted', {
						interaction: 'recipient_removed'
					});
				}}
			>
				<Icon icon="cross" size="s" />
			</Button>
		</RecipientContainer>
	);
};

Recipient.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	picture: PropTypes.string,
	email: PropTypes.string.isRequired,
	fieldErrors: PropTypes.array,
	messagesCount: PropTypes.number,
	viewType: PropTypes.string,
	validatedEmails: PropTypes.object
};

export default Recipient;
