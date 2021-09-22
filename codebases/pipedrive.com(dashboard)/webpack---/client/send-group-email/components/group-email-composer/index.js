import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MailConnectionsContext, APIContext, UsageTrackingContext } from 'shared/contexts';
import RecipientList from './recipient-list';
import TemplateAndVisibilityPickers from './template-and-visibility-pickers';
import SubjectEditor from './subject-editor';
import Wysiwyg from '../wysiwyg';
import FileSizeDialog from './warning-dialogs/file-size-dialog';
import ActionBar from './actionbar';
import ConfirmEmptySubjectDialog from './warning-dialogs/confirm-empty-subject-dialog';
import { validateMergeFields } from '../../utils/merge-fields';
import ComposerWarnings from './composer-warnings';
import useFetchData from 'shared/hooks/use-fetch-data';
import { sendGroupEmails } from '../../api/emails';
import useStore from '../../store';
import { fetchDataAndGenerateMessages } from '../../actions/messages';
import reset from '../../actions/reset';
import { useTranslator } from 'utils/translator/translator-hook';

const GroupEmailComposerContainer = styled.div`
	display: flex;
	overflow: hidden;
	max-height: calc(100vh - 48px);
`;
const ComposerArea = styled.div`
	display: flex;
	flex-direction: column;
	width: 672px;
`;
const Composer = styled.div`
	padding: 16px;
	width: 640px;
	display: flex;
	flex-direction: column;
	overflow-x: auto;
`;

const getDefaultComposerData = (MailConnections, API) => {
	const activeConnection = MailConnections.getConnectedNylasConnection();

	const defaultComposerData = {
		priority_type: 'group',
		to: [],
		template_id: null,
		shared_flag: API.userSelf.settings.get('share_incoming_emails') || false
	};

	// link tracking enabled in settings
	if (activeConnection && activeConnection.get('mail_tracking_link_flag')) {
		// default link tracking value
		defaultComposerData.mail_tracking_link = activeConnection.get(
			'last_mail_tracking_link_value'
		);
	}

	// open mail tracking enabled in settings
	if (activeConnection && activeConnection.get('mail_tracking_open_mail_flag')) {
		// default open mail tracking value
		defaultComposerData.mail_tracking_open_mail = activeConnection.get(
			'last_mail_tracking_open_mail_value'
		);
	}

	return defaultComposerData;
};

export const insertEditorDefaultContent = (API, wysiwyg) => {
	const parsedSignature = API.userSelf.settings.mailSignature.getParsedSignature();

	if (parsedSignature) {
		const signature = `
			<br/><br/>
			<div data-pipedrivesignature>
				<div>${parsedSignature}</div>
			</div>
		`;

		wysiwyg.current.editorEl.innerHTML = signature;
	} else {
		wysiwyg.current.editorEl.innerHTML = '';
	}
};

const GroupEmailComposer = ({
	viewType,
	selection,
	sort,
	isModalVisible,
	setModalVisibility,
	setScheduleModalVisible,
	setSnackbarMessage,
	sendingScheduledEmail,
	scheduledAtTimeProps,
	setSent,
	modalElement
}) => {
	const translator = useTranslator();
	const MailConnections = useContext(MailConnectionsContext);
	const API = useContext(APIContext);
	const usageTracking = useContext(UsageTrackingContext);
	const { state, actions } = useStore({ fetchDataAndGenerateMessages, reset });
	const [composerData, setComposerData] = useState(getDefaultComposerData(MailConnections, API));
	const [recipientsFieldErrors, setRecipientsFieldErrors] = useState([]);
	const [isSending, setSending] = useState(false);
	const [isComposerVisible, setComposerVisible] = useState(false);
	const [activeEditor, setActiveEditor] = useState('body');
	const [sendingSubjectStatus, setSendingSubjectStatus] = useState('unchecked');
	const [isNylasConnected, setNylasConnected] = useState(true);
	const [isFailedResponse, setFailedResponse] = useState(false);
	const subjectEditor = useRef();
	const wysiwyg = useRef();

	const {
		messages,
		validatedEmails,
		relatedObjects,
		attachments: { tooBigFiles, files }
	} = state;

	useEffect(() => {
		if (isComposerVisible) {
			return;
		}

		if (wysiwyg.current && subjectEditor.current) {
			setComposerVisible(true);
			insertEditorDefaultContent(API, wysiwyg);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isComposerVisible, wysiwyg.current, subjectEditor.current, setComposerVisible]);
	// Reset data when send group modal is made visible
	useEffect(() => {
		if (isModalVisible) {
			setComposerData(getDefaultComposerData(MailConnections, API));
			setSending(false);
			setSent(false);
			setSendingSubjectStatus('unchecked');
			actions.reset();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [MailConnections, setSent, isModalVisible, API]);

	// Fetch the recipients
	const { loading: recipientsLoading, loaded: recipientsLoaded } = useFetchData(async () => {
		if (isModalVisible) {
			await actions.fetchDataAndGenerateMessages(viewType, selection, sort, API);
		}
	}, isModalVisible);

	useEffect(() => {
		if (recipientsLoaded && isModalVisible) {
			usageTracking.sendMetrics('group_email_modal', 'opened', {
				count_of_recipients: messages.length
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipientsLoaded, isModalVisible]);

	// Validate if messages have merge field values
	useEffect(() => {
		if (wysiwyg.current) {
			const editors = [wysiwyg.current.editorEl, subjectEditor.current.editorEl];

			return validateMergeFields(editors, messages, setRecipientsFieldErrors);
		}
	}, [messages]);

	const validMessages = useMemo(
		() =>
			messages.filter(
				(message, index) =>
					validatedEmails[message.email] &&
					!(recipientsFieldErrors[index] && recipientsFieldErrors[index].length)
			),
		[messages, recipientsFieldErrors, validatedEmails]
	);

	const getSnackBarMessage = () => {
		if (sendingScheduledEmail && scheduledAtTimeProps?.time) {
			const dt = moment.utc(scheduledAtTimeProps?.time).local();
			const formattedDateTime = `${dt.format('pd_day_month')}, ${dt.format('LT')}`;

			return translator.ngettext(
				'%d email is scheduled to be sent on %s',
				'%d emails are scheduled to be sent on %s',
				validMessages.length,
				[validMessages.length, formattedDateTime]
			);
		}

		return translator.gettext('Group email is being sent out…');
	};

	// Sending scheduled email
	useEffect(() => {
		if (sendingScheduledEmail && scheduledAtTimeProps.time) {
			setSending(true);
		}
	}, [sendingScheduledEmail, scheduledAtTimeProps]);

	// Send the emails
	useEffect(() => {
		if (isSending) {
			sendGroupEmails({
				messages: validMessages,
				relatedObjects,
				composerData,
				wysiwyg,
				subjectEditor,
				files,
				sendingSubjectStatus,
				usageTracking,
				setSending,
				setModalVisibility,
				setSent,
				setSendingSubjectStatus,
				setFailedResponse,
				scheduledAtTimeProps,
				sendingScheduledEmail
			});

			setFailedResponse(false);
			setSnackbarMessage(getSnackBarMessage());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSending, sendingSubjectStatus, sendingScheduledEmail, scheduledAtTimeProps]);

	// Remember if nylas is connected
	useEffect(() => {
		const changeListener = () => {
			setNylasConnected(!!MailConnections.getConnectedNylasConnection());
		};

		MailConnections.on('change', changeListener);

		changeListener();

		return () => {
			MailConnections.off('change', changeListener);
		};
	}, [MailConnections]);

	return (
		<GroupEmailComposerContainer>
			<RecipientList
				recipientsFieldErrors={recipientsFieldErrors}
				recipientsLoading={recipientsLoading}
				viewType={viewType}
			/>
			<ComposerArea>
				<ComposerWarnings
					recipientsFieldErrors={recipientsFieldErrors}
					validMessages={validMessages}
					composerData={composerData}
					isNylasConnected={isNylasConnected}
				/>
				<Composer>
					<TemplateAndVisibilityPickers
						composerData={composerData}
						setComposerData={setComposerData}
						isModalVisible={isModalVisible}
						subjectEditor={subjectEditor.current}
						wysiwyg={wysiwyg.current}
						modalElement={modalElement}
					/>
					<SubjectEditor ref={subjectEditor} onFocus={() => setActiveEditor('subject')} />
					<Wysiwyg ref={wysiwyg} onFocus={() => setActiveEditor('body')} />
					<ActionBar
						composerData={composerData}
						setComposerData={setComposerData}
						setModalVisibility={setModalVisibility}
						setScheduleModalVisible={setScheduleModalVisible}
						isSending={isSending}
						setSending={setSending}
						validMessages={validMessages}
						activeEditor={activeEditor}
						wysiwyg={wysiwyg.current}
						subjectEditor={subjectEditor.current}
						isNylasConnected={isNylasConnected}
						modalElement={modalElement}
						isFailedResponse={isFailedResponse}
						setFailedResponse={setFailedResponse}
					/>
				</Composer>
			</ComposerArea>
			{sendingSubjectStatus === 'checking' && (
				<ConfirmEmptySubjectDialog
					setSending={setSending}
					setSendingSubjectStatus={setSendingSubjectStatus}
					subjectEditor={subjectEditor.current}
				/>
			)}
			{!!tooBigFiles.length && <FileSizeDialog files={tooBigFiles} />}
		</GroupEmailComposerContainer>
	);
};

GroupEmailComposer.propTypes = {
	viewType: PropTypes.string.isRequired,
	selection: PropTypes.object.isRequired,
	isModalVisible: PropTypes.bool.isRequired,
	sendingScheduledEmail: PropTypes.bool.isRequired,
	setModalVisibility: PropTypes.func.isRequired,
	setScheduleModalVisible: PropTypes.func.isRequired,
	setSnackbarMessage: PropTypes.func.isRequired,
	setSent: PropTypes.func.isRequired,
	modalElement: PropTypes.object,
	scheduledAtTimeProps: PropTypes.object.string,
	sort: PropTypes.string
};

export default GroupEmailComposer;
