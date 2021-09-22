import React, { useState, useContext, useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import {
	Button,
	Icon,
	Snackbar,
	Tooltip,
	ButtonGroup,
	Dropmenu,
	Option
} from '@pipedrive/convention-ui-react';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import useStore from '../../store';
import { addFiles } from '../../actions/attachments';
import FieldPicker from 'templates/containers/field-picker';
import { UsageTrackingContext, APIContext } from 'shared/contexts';
import AttachmentsDropArea from 'shared/components/drag-and-drop-area';
import { createMailSchedulingCoachmark, getMailSchedulingCoachmark } from '../../utils/coach-marks';
import { useTranslator } from 'utils/translator/translator-hook';

const Container = styled.div`
	flex: 0 0 auto;
	display: flex;
	height: 57px;
	padding: 12px 16px;
	box-sizing: border-box;
	border: 1px solid ${colors['$color-black-hex-12']};
	border-top: none;
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
`;
const Left = styled.div`
	flex: 0 0 auto;
	display: flex;
	align-items: center;
`;
const Right = styled.div`
	display: flex;
	justify-content: flex-end;
	flex: 1 1 auto;
`;
const ActionButton = styled(Button)`
	&:not(:last-child) {
		margin-right: 8px;
	}
`;
const SchedulingDropDownBtn = styled(Button)`
	border-left: 1px solid ${colors['$color-black-rgba-16']};
	margin-left: -2px;
	svg {
		transform: ${(props) => (props.dropdownVisible ? 'rotate(180deg);' : 'unset')};
	}
`;
const StyledDropmenu = styled(Dropmenu)`
	margin-top: 4px;
	min-width: ${(props) =>
		props.sendBtnGroupRef.current ? `${props.sendBtnGroupRef.current.clientWidth}px` : '171px'};
`;

const ActionBar = ({
	composerData,
	setComposerData,
	setModalVisibility,
	setScheduleModalVisible,
	isSending,
	setSending,
	validMessages,
	activeEditor,
	subjectEditor,
	wysiwyg,
	isNylasConnected,
	modalElement,
	isFailedResponse,
	setFailedResponse
}) => {
	const translator = useTranslator();
	const usageTracking = useContext(UsageTrackingContext);
	const API = useContext(APIContext);
	const {
		userSelf: { settings: userSettings, companyFeatures }
	} = useContext(APIContext);
	const {
		state: {
			attachments: { files }
		},
		actions
	} = useStore({ addFiles });
	const [isEditorEmpty, setEditorEmpty] = useState(true);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const canUseEmailTracking = userSettings.get('can_use_email_tracking');
	const mailTrackingOpenMailEnabled =
		composerData.hasOwnProperty('mail_tracking_open_mail') && canUseEmailTracking;
	const mailTrackingLinkEnabled =
		composerData.hasOwnProperty('mail_tracking_link') && canUseEmailTracking;
	const attachmentsInput = useRef(null);
	const schedulingDropDownBtnRef = useRef(null);
	const sendBtnGroupRef = useRef(null);
	const fontPickersEnabled = companyFeatures.get('wysiwyg_formatting');
	const mailSchedulingEnabled = companyFeatures.get('scheduled_emails');

	const sendUsageStatistics = (isDragAndDrop = false) => {
		usageTracking.sendMetrics('email_composer', 'interacted', {
			interaction: isDragAndDrop ? 'drag_and_drop_attachment_added' : 'attachment_added',
			wysiwyg_formatting: fontPickersEnabled,
			area: 'footer'
		});
	};

	const browseFiles = () => {
		attachmentsInput.current.click();

		sendUsageStatistics();
	};
	const onFileDrop = (e) => {
		actions.addFiles(Array.from(e.dataTransfer?.files || []));

		sendUsageStatistics(true);
	};

	const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

	const getOpenTrackingTooltip = (isEnabled) => {
		return isEnabled
			? translator.gettext('Do not track email opening')
			: translator.gettext('Track email opening');
	};

	const getLinkTrackingTooltip = (isEnabled) => {
		return isEnabled
			? translator.gettext('Do not track link opening')
			: translator.gettext('Track link opening');
	};

	const onOpenTrackingClick = () => {
		setComposerData((composerData) => ({
			...composerData,
			mail_tracking_open_mail: !composerData.mail_tracking_open_mail
		}));

		usageTracking.sendMetrics('email_composer', 'interacted', {
			interaction: 'track_open',
			wysiwyg_formatting: fontPickersEnabled
		});
	};

	const onOpenLinkTrackingClick = () => {
		setComposerData((composerData) => ({
			...composerData,
			mail_tracking_link: !composerData.mail_tracking_link
		}));

		usageTracking.sendMetrics('email_composer', 'interacted', {
			interaction: 'track_link',
			wysiwyg_formatting: fontPickersEnabled
		});
	};

	const sendLaterOnClicked = () => {
		setScheduleModalVisible(true);
		toggleDropdown();
		usageTracking.sendMetrics('group_email_send_later', 'clicked', {
			interaction: 'group_sending_opened'
		});
	};

	const validMessagesCount = validMessages.length;

	useEffect(() => {
		if (wysiwyg) {
			const onChange = debounce(() => {
				setEditorEmpty(!wysiwyg || wysiwyg.isEditorEmpty());
			}, 250);

			wysiwyg.editorEl.addEventListener('input', onChange);

			return () => {
				wysiwyg.editorEl.removeEventListener('input', onChange);
			};
		}
	}, [wysiwyg]);

	const fileUploadInProgress = files.some(({ file }) => !(file && file.id));
	const isSendButtonDisabled = useMemo(
		() =>
			validMessagesCount === 0 || isEditorEmpty || fileUploadInProgress || !isNylasConnected,
		[validMessagesCount, isEditorEmpty, fileUploadInProgress, isNylasConnected]
	);

	/**
	 * We need to remember if the field picker is visible or not in order to disable the tooltip with the same trigger.
	 * Otherwise when you hover the field picker contents the tooltip becomes visible as well.
	 */
	const [isFieldPickerVisible, setFieldPickerVisible] = useState(false);
	const fieldPickerToolTipProps = useMemo(
		() => (isFieldPickerVisible ? { visible: false } : {}),
		[isFieldPickerVisible]
	);

	useEffect(() => {
		if (!schedulingDropDownBtnRef.current) return;

		const mailSchedulingCoachmark = getMailSchedulingCoachmark();

		if (isSendButtonDisabled) {
			mailSchedulingCoachmark?.unqueue();

			return;
		}

		if (mailSchedulingCoachmark) return;

		createMailSchedulingCoachmark(API, translator, schedulingDropDownBtnRef.current, () =>
			setScheduleModalVisible(true)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSendButtonDisabled, schedulingDropDownBtnRef]);

	return (
		<AttachmentsDropArea onDrop={(e) => onFileDrop(e)} showBorder={false}>
			<Container>
				<Left>
					<Tooltip placement="top" content={translator.gettext('Attach')}>
						<ActionButton
							color="ghost"
							href="#"
							className={`toolbar__link`}
							onClick={browseFiles}
						>
							<input
								ref={attachmentsInput}
								type="file"
								multiple="multiple"
								style={{ display: 'none' }}
								onChange={(e) => actions.addFiles(Array.from(e.target.files))}
							/>
							<Icon icon="file" />
						</ActionButton>
					</Tooltip>
					{mailTrackingOpenMailEnabled && (
						<Tooltip
							placement="top"
							content={getOpenTrackingTooltip(composerData.mail_tracking_open_mail)}
						>
							<ActionButton
								color="ghost"
								onClick={onOpenTrackingClick}
								data-ui-test-id="group-email-track-email-opening"
								active={!!composerData.mail_tracking_open_mail}
							>
								<Icon icon="open-tracking" />
							</ActionButton>
						</Tooltip>
					)}
					{mailTrackingLinkEnabled && (
						<Tooltip
							placement="top"
							content={getLinkTrackingTooltip(composerData.mail_tracking_link)}
						>
							<ActionButton
								color="ghost"
								onClick={onOpenLinkTrackingClick}
								data-ui-test-id="group-email-track-link-opening"
								active={!!composerData.mail_tracking_link}
							>
								<Icon icon="link-tracking" />
							</ActionButton>
						</Tooltip>
					)}
					<Tooltip
						placement="top"
						content={translator.gettext('Fields')}
						{...fieldPickerToolTipProps}
					>
						<div>
							<FieldPicker
								activeEditorName={activeEditor}
								editors={{ subject: subjectEditor, body: wysiwyg }}
								isConfigMode={true}
								usageTracking={usageTracking}
								trackingData={{ source: 'group_email' }}
								hideLeadFieldsInGroupEmail={true}
								showLinkText={false}
								popoverPortalTo={modalElement}
								onPopupVisibleChange={setFieldPickerVisible}
								triggerContent={
									<Button color="ghost">
										<Icon icon="add-field" color="black-64" />
										<Icon icon="triangle-down" size="s" color="black-64" />
									</Button>
								}
							/>
						</div>
					</Tooltip>
				</Left>
				<Right>
					<ActionButton onClick={() => setModalVisibility(false)}>
						{translator.gettext('Cancel')}
					</ActionButton>
					<ButtonGroup forwardRef={sendBtnGroupRef}>
						<Button
							loading={isSending}
							disabled={isSendButtonDisabled}
							color="green"
							onClick={() => setSending(true)}
							data-ui-test-id="group-email-send-button"
						>
							{translator.ngettext(
								'Send %s message',
								'Send %s messages',
								validMessagesCount,
								validMessagesCount
							)}
						</Button>
						{mailSchedulingEnabled && (
							<StyledDropmenu
								sendBtnGroupRef={sendBtnGroupRef}
								closeOnClick={true}
								popoverProps={{
									placement: 'bottom-end',
									visible: dropdownVisible,
									onPopupVisibleChange: (dropdownVisible) =>
										!dropdownVisible && setDropdownVisible(dropdownVisible)
								}}
								content={
									<Option onClick={sendLaterOnClicked}>
										{translator.gettext('Send later…')}
									</Option>
								}
							>
								<SchedulingDropDownBtn
									dropdownVisible={dropdownVisible}
									disabled={isSendButtonDisabled || isSending}
									color="green"
									onClick={() => {
										getMailSchedulingCoachmark()?.close();
										toggleDropdown();
									}}
									forwardRef={schedulingDropDownBtnRef}
								>
									<Icon icon="triangle-down" />
								</SchedulingDropDownBtn>
							</StyledDropmenu>
						)}
					</ButtonGroup>
				</Right>
				{isFailedResponse && (
					<Snackbar
						message={translator.pgettext(
							'Sending emails failed due to a technical problem',
							"Can't send messages"
						)}
						actionText={translator.pgettext('Retry to send emails', 'Retry')}
						onClick={() => setSending(true)}
						onDismiss={() => setFailedResponse(false)}
					/>
				)}
			</Container>
		</AttachmentsDropArea>
	);
};

ActionBar.propTypes = {
	composerData: PropTypes.object.isRequired,
	setComposerData: PropTypes.func.isRequired,
	setModalVisibility: PropTypes.func.isRequired,
	setScheduleModalVisible: PropTypes.func.isRequired,
	isSending: PropTypes.bool.isRequired,
	setSending: PropTypes.func.isRequired,
	validMessages: PropTypes.array.isRequired,
	activeEditor: PropTypes.string,
	wysiwyg: PropTypes.object,
	subjectEditor: PropTypes.object,
	isNylasConnected: PropTypes.bool.isRequired,
	modalElement: PropTypes.object,
	isFailedResponse: PropTypes.bool.isRequired,
	setFailedResponse: PropTypes.func.isRequired
};

export default ActionBar;
