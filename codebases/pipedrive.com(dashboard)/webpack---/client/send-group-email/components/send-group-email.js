import React, { useState, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, Snackbar, Message, Text } from '@pipedrive/convention-ui-react';
import { useTranslator } from 'utils/translator/translator-hook';
import styled from 'styled-components';
import GroupEmailComposer from './group-email-composer';
import ScheduleMailModal from '../../schedule-email/components/schedule-email';
import { APIContext } from 'shared/contexts';
import MessageLimitExceededDialog from './group-email-composer/warning-dialogs/message-limit-exceeded-dialog';
import { MAX_MESSAGES_PER_GROUP_EMAIL } from '../constants';
import { createGroupEmailCoachmark, getGroupEmailCoachmarkInstance } from '../utils/coach-marks';

const Container = styled.div`
	display: flex;
	margin-right: 8px;
`;

const RedirectIcon = styled(Icon).attrs(() => ({
	icon: 'redirect',
	size: 's',
	color: 'blue'
}))`
	padding-top: 2px;
	margin: 0 0 -2px 2px;
`;

function useHookWithRefCallbackForCoachmark(API, translator) {
	const [node, setRef] = useState(null);

	useEffect(() => {
		createGroupEmailCoachmark(API, node, translator);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [node]);

	return [setRef];
}

const SendGroupEmail = ({ type, selection, selectedItemsCount, sort }) => {
	selectedItemsCount = selectedItemsCount || selection.selectedIds.length;

	const translator = useTranslator();
	const [isModalVisible, setModalVisibility] = useState(false);
	const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
	const [scheduledAtTimeProps, setScheduledAtTimeProps] = useState({});
	const [sendingScheduledEmail, setSendingScheduledEmail] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [isModalClosed, setModalClosed] = useState(true);
	const [isMessageLimitDialogVisible, setMessageLimitDialogVisibility] = useState(false);
	const [isSent, setSent] = useState(false);
	const API = useContext(APIContext);
	const modalRef = useRef();
	const [buttonRef] = useHookWithRefCallbackForCoachmark(API, translator);
	const hasSelectedItems = selectedItemsCount > 0;

	const onButtonClick = () => {
		selectedItemsCount <= MAX_MESSAGES_PER_GROUP_EMAIL
			? setModalVisibility(true)
			: setMessageLimitDialogVisibility(true);
	};

	const [sendingDelayCoachmark, setSendingDelayCoachmark] = useState(null);
	const [isSendingDelayCoachmarkVisible, setSendingDelayCoachmarkVisible] = useState(false);
	const sendingDelayURL = 'https://support.pipedrive.com/en/article/group-emailing';
	const createSendingDelayCoachmark = (iamClient) => {
		const coachmark = new iamClient.Coachmark({
			tag: 'group_email_sending_interval',
			onReady: (data) => {
				if (data?.active) setSendingDelayCoachmarkVisible(true);
			}
		});

		setSendingDelayCoachmark(coachmark);
	};
	const closeSendingDelayCoachmark = () => {
		if (!sendingDelayCoachmark) return;

		sendingDelayCoachmark.close();
		setSendingDelayCoachmarkVisible(false);
	};

	useEffect(() => {
		(async () => {
			const iamClient = await API.componentLoader.load('iam-client').catch(() => {});

			if (!iamClient) return null;

			createSendingDelayCoachmark(iamClient);
		})();
	}, [API]);

	useEffect(() => {
		if (isModalVisible) {
			const coachmark = getGroupEmailCoachmarkInstance();

			if (coachmark) {
				coachmark.close();
			}

			setModalClosed(false);
		}
	}, [isModalVisible]);

	useEffect(() => {
		if (isModalClosed && sendingScheduledEmail) {
			setSendingScheduledEmail(false);
		}
	}, [isModalClosed, sendingScheduledEmail]);

	return (
		<React.Fragment>
			{hasSelectedItems && (
				<Container>
					<Button
						onClick={onButtonClick}
						data-ui-test-id="group-email-modal-trigger"
						forwardRef={buttonRef}
					>
						<Icon icon="email" size="s" />
						{translator.gettext('Send group email')}
					</Button>
					<MessageLimitExceededDialog
						selectedItemsCount={selectedItemsCount}
						viewType={type}
						setDialogVisibility={setMessageLimitDialogVisibility}
						setModalVisibility={setModalVisibility}
						isDialogVisible={isMessageLimitDialogVisible}
					/>
					{(isModalVisible || !isModalClosed) && (
						<Modal
							visible={isModalVisible}
							header={translator.gettext('Send group email')}
							onClose={() => setModalVisibility(false)}
							spacing="none"
							onTransitionEnd={() => {
								if (!isModalVisible) {
									setModalClosed(true);
								}
							}}
							forwardRef={modalRef}
						>
							{isSendingDelayCoachmarkVisible && (
								<Message visible onClose={closeSendingDelayCoachmark}>
									<Text>
										<span>
											{translator.gettext(
												'Emails will be sent out with a delay between each message (up to 30 seconds). '
											)}
											<a
												href={sendingDelayURL}
												target="_blank"
												rel="noreferrer"
											>
												{translator.gettext('Learn more')}
												<RedirectIcon />
											</a>
										</span>
									</Text>
								</Message>
							)}
							<GroupEmailComposer
								viewType={type}
								selection={selection}
								sort={sort}
								isModalVisible={isModalVisible}
								setModalVisibility={setModalVisibility}
								setScheduleModalVisible={setScheduleModalVisible}
								setSnackbarMessage={setSnackbarMessage}
								scheduledAtTimeProps={scheduledAtTimeProps}
								setSent={setSent}
								sendingScheduledEmail={sendingScheduledEmail}
								modalElement={modalRef.current && modalRef.current.parentNode}
							/>
						</Modal>
					)}
				</Container>
			)}
			{isScheduleModalVisible && (
				<ScheduleMailModal
					setScheduledAtTimeProps={setScheduledAtTimeProps}
					setSendingScheduledEmail={setSendingScheduledEmail}
					setScheduleModalVisible={setScheduleModalVisible}
					API={API}
					translator={translator}
				/>
			)}
			{isSent && isModalClosed && (
				<Snackbar
					message={snackbarMessage}
					actionText={translator.pgettext(
						'Button to view the outbox to see outgoing group email',
						'View'
					)}
					onClick={(event) => API.router.go(event, '/mail/outbox')}
					onDismiss={() => {
						setScheduledAtTimeProps({});
						setSent(false);
					}}
				/>
			)}
		</React.Fragment>
	);
};

SendGroupEmail.propTypes = {
	type: PropTypes.string,
	selection: PropTypes.object,
	selectedItemsCount: PropTypes.number,
	sort: PropTypes.string
};
SendGroupEmail.defaultProps = {
	selection: { selectedIds: [], excludedIds: [], bulkEditFilter: null }
};

export default SendGroupEmail;
