import React, { useEffect, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Text } from '@pipedrive/convention-ui-react';
import { MailConnectionsContext } from 'shared/contexts';
import { useTranslator } from 'utils/translator/translator-hook';
import useStore from '../../store';

const WarningMessage = styled(Message).attrs(() => ({ color: 'yellow', alternative: true }))`
	flex: 0 0 auto;
`;
const WarningText = styled(Text)`
	display: inline;
`;

const getConnectionMessage = ({ MailConnections, translator }) => {
	if (MailConnections.getConnectedNylasConnection()) {
		return null;
	}

	const lastDisconnectedAccount = MailConnections.getLastDisconnectedAccount();
	const emailAddress = lastDisconnectedAccount
		? lastDisconnectedAccount.get('email_address')
		: '';

	return translator.gettext('Your email account %s%s%s is no longer connected.', [
		'<strong>',
		emailAddress,
		'</strong>'
	]);
};

const getRecipientMessage = ({
	recipientsFieldErrors,
	validMessages,
	messages,
	translator,
	hasEmailErrors
}) => {
	const hasFieldErrors = recipientsFieldErrors.some((fieldErrors) => fieldErrors.length);

	const invalidMessagesCount = Math.abs(validMessages.length - messages.length);

	if (hasFieldErrors && hasEmailErrors) {
		return translator.ngettext(
			'%s %s message %s will not send due to an invalid email address or missing merge field data.',
			'%s %s messages %s will not send due to an invalid email address or missing merge field data.',
			invalidMessagesCount,
			['<strong>', invalidMessagesCount, '</strong>']
		);
	} else if (hasFieldErrors) {
		return translator.ngettext(
			'%s %s message %s will not send due to missing merge field data.',
			'%s %s messages %s will not send due to missing merge field data.',
			invalidMessagesCount,
			['<strong>', invalidMessagesCount, '</strong>']
		);
	} else if (hasEmailErrors) {
		return translator.ngettext(
			'%s %s message %s will not send due to an invalid email address.',
			'%s %s messages %s will not send due to an invalid email address.',
			invalidMessagesCount,
			['<strong>', invalidMessagesCount, '</strong>']
		);
	}
};

const ComposerWarnings = ({ recipientsFieldErrors, validMessages, isNylasConnected }) => {
	const translator = useTranslator();
	const MailConnections = useContext(MailConnectionsContext);
	const {
		state: { messages, validatedEmails }
	} = useStore();
	const [isRecipientMessageVisible, setRecipientMessageVisible] = useState(false);
	const [isConnectionMessageVisible, setConnectionMessageVisible] = useState(false);

	const hasEmailErrors = messages.some(
		(message) => message.email in validatedEmails && !validatedEmails[message.email]
	);

	const recipientMessage = getRecipientMessage({
		recipientsFieldErrors,
		hasEmailErrors,
		validMessages,
		messages,
		translator
	});
	const [connectionMessage, setConnectionMessage] = useState(null);

	useEffect(() => {
		setConnectionMessage(getConnectionMessage({ MailConnections, translator }));
	}, [MailConnections, isNylasConnected, translator]);

	/**
	 * Function contents copied from
	 * https://github.com/pipedrive/webapp/blob/master/pipedrive/app/components/mail-components/composer/views/base-composer.js#L171
	 */
	const reconnect = useCallback(
		(event) => {
			event.preventDefault();

			if (MailConnections.needsNylasReauth()) {
				const redirectUrl = MailConnections.getNylasAuthLink();

				window.location = redirectUrl;
			} else if (MailConnections.length) {
				MailConnections.reconnectLastDisconnectedAccount();
			} else {
				// If there are no connections at all we send to settings menu.
				window.location = '/settings/email-sync';
			}
		},
		[MailConnections]
	);

	useEffect(() => {
		if (recipientMessage) {
			setRecipientMessageVisible(true);
		}
	}, [recipientMessage]);
	useEffect(() => {
		if (connectionMessage) {
			setConnectionMessageVisible(true);
		}
	}, [connectionMessage]);

	return (
		<React.Fragment>
			{(connectionMessage || isConnectionMessageVisible) && (
				<WarningMessage
					visible={!!(isConnectionMessageVisible && connectionMessage)}
					onTransitionEnd={() => {
						if (!connectionMessage) {
							setConnectionMessageVisible(false);
						}
					}}
				>
					<WarningText>
						<span
							data-ui-test-id="group-email-composer-warning"
							dangerouslySetInnerHTML={{ __html: connectionMessage }} // eslint-disable-line
						></span>
						&nbsp;
						<a onClick={reconnect} href="#">
							{translator.pgettext(
								'Reconnect disconnected email address',
								'Reconnect'
							)}
						</a>
					</WarningText>
				</WarningMessage>
			)}
			{(recipientMessage || isRecipientMessageVisible) && (
				<WarningMessage
					visible={!!(isRecipientMessageVisible && recipientMessage)}
					onTransitionEnd={() => {
						if (!recipientMessage) {
							setRecipientMessageVisible(false);
						}
					}}
				>
					<WarningText
						dangerouslySetInnerHTML={{ __html: recipientMessage }}
					></WarningText>
				</WarningMessage>
			)}
		</React.Fragment>
	);
};

ComposerWarnings.propTypes = {
	recipientsFieldErrors: PropTypes.array.isRequired,
	validMessages: PropTypes.array.isRequired,
	isNylasConnected: PropTypes.bool.isRequired
};

export default ComposerWarnings;
