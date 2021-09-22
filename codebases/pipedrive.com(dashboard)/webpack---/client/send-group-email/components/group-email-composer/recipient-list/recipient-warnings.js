import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import { useTranslator } from 'utils/translator/translator-hook';
import RecipientWarning from './recipient-warning';

const Text = styled.div`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`;
const SmallText = styled(Text)`
	font: ${fonts['$font-body-s']};
	color: ${colors['$color-black-hex-64']};
`;
const EmailPlaceholder = styled.div`
	height: 16px;
`;

const RecipientWarnings = ({ validatedEmails, email, fieldErrors, messagesCount, viewType }) => {
	const translator = useTranslator();
	const hasEmail = !!email.length;
	const emailIsNotValidated = !Object.keys(validatedEmails).includes(email);
	const hasValidEmail = validatedEmails[email];
	const showMultipleMessagesWarning = hasValidEmail && viewType !== 'person' && messagesCount > 1;
	const showMergeFieldsWarning = hasValidEmail && fieldErrors.length > 0;
	const getMultipleMessagesText = (viewType) => {
		switch (viewType) {
			case 'activity':
				return {
					tooltipText: translator.gettext(
						'This contact person will receive separate emails for each activity.'
					),
					messageCountText: translator.ngettext(
						'%s activity selected',
						'%s activities selected',
						messagesCount,
						messagesCount
					)
				};
			case 'deal':
				return {
					tooltipText: translator.gettext(
						'This contact person will receive separate emails for each deal.'
					),
					messageCountText: translator.ngettext(
						'%s deal selected',
						'%s deals selected',
						messagesCount,
						messagesCount
					)
				};
			default:
				return {};
		}
	};
	const emailWarnings = {
		get errorText() {
			return hasEmail ? email : translator.gettext('No email address');
		},

		get tooltipText() {
			return hasEmail
				? translator.gettext(
						'Email address is not valid. This will prevent the message from sending to this recipient.'
				  )
				: translator.gettext(
						'Email address is missing. This will prevent the message from sending to this recipient.'
				  );
		}
	};
	const multipleMessagesText = getMultipleMessagesText(viewType);

	return (
		<React.Fragment>
			{emailIsNotValidated ? (
				<EmailPlaceholder />
			) : hasValidEmail ? (
				<SmallText>{email}</SmallText>
			) : (
				<RecipientWarning
					tooltipText={emailWarnings.tooltipText}
					warningText={emailWarnings.errorText}
					color="red"
				/>
			)}
			{showMultipleMessagesWarning && (
				<RecipientWarning
					tooltipText={multipleMessagesText.tooltipText}
					warningText={multipleMessagesText.messageCountText}
					color="purple"
				/>
			)}
			{showMergeFieldsWarning && (
				<RecipientWarning
					uiTestId="group-email-merge-fields-warning"
					tooltipText={translator.gettext(
						'Merge field data is missing. This will prevent the message from sending to this recipient.'
					)}
					warningText={translator.gettext('Empty merge fields')}
					color="red"
				/>
			)}
		</React.Fragment>
	);
};

RecipientWarnings.propTypes = {
	validatedEmails: PropTypes.object,
	email: PropTypes.string,
	fieldErrors: PropTypes.array.isRequired,
	messagesCount: PropTypes.number.isRequired,
	viewType: PropTypes.oneOf(['deal', 'activity', 'person'])
};

export default RecipientWarnings;
