import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, InlineInfo } from '@pipedrive/convention-ui-react';
import { DatePicker, TimePicker, RadioGroup, FormFieldsContext } from '@pipedrive/form-fields';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import styled from 'styled-components';
import moment from 'moment';
import PropTypes from 'prop-types';

const StyledRadioGroup = styled(RadioGroup)`
	display: flex;
	flex-direction: column;
	margin-bottom: 8px;
	.cui4-radio {
		margin-right: 0;
	}
	.cui4-radio__label {
		width: 100%;
	}
`;

const RadioButtonContainer = styled.div`
	margin-bottom: 8px;
	display: flex;
	justify-content: space-between;
`;

const RadioText = styled.div`
	display: flex;
	min-width: 228px;
`;

const MomentDate = styled.div`
	display: flex;
	color: ${colors['$color-black-hex-64']};
`;

const DateTimeContainer = styled.div`
	display: flex;
	margin-left: 24px;
`;

const DateTimeHeader = styled.div`
	display: flex;
	flex-direction: column;
	color: ${(props) => props.disabled && `${colors['$color-black-hex-64']}`};
`;

const DateTimeComponent = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 8px;
`;
const CalendarDatePicker = styled(DatePicker)`
	width: 112px;
	input[type='text'] {
		color: ${(props) => props.disabled && colors['$color-black-rgba-32']};
	}
	.react-datepicker {
		margin-top: 4px;
	}
	.react-datepicker__triangle {
		display: none;
	}
`;
const FFTimePicker = styled(TimePicker)`
	.react-datepicker-wrapper {
		width: 104px;
		.react-datepicker__input-container {
			width: 104px;
		}
	}
	.react-datepicker__input-container {
		> button {
			margin-top: 1px;
		}

		> input {
			::placeholder,
			:disabled {
				color: ${colors['$color-black-rgba-32']};
			}
		}
	}
`;

const FooterDiv = styled.div`
	display: flex;
	align-items: center;
	svg {
		margin: 0 8px;
	}
`;
const TimezoneHelperText = styled.div`
	text-align: left;
`;

const FooterButtons = styled.div`
	display: flex;
	justify-content: flex-end;
	flex: auto;
	button:first-of-type {
		margin-right: 8px;
	}
`;

const ScheduleMailModal = ({
	setSendingScheduledEmail,
	setScheduleModalVisible,
	setScheduledAtTimeProps,
	sendMail,
	API,
	translator
}) => {
	const locale = API.userSelf.get('locale');
	const [scheduleModalVisible, setVisible] = useState(true);
	const [activeRadioValue, setRadioGroupValue] = useState('');
	const [scheduledDateTime, setScheduledDateTime] = useState(null);
	const [calendarDateValue, setCalendarDateValue] = useState(moment().format('YYYY-MM-DD'));
	const [calendarTimeValue, setCalendarTimeValue] = useState('');
	const DatePickerRef = useRef(null);
	const momentTomorrowMorning = moment()
		.add(1, 'd')
		.hour(9)
		.minute(0)
		.second(0);
	const momentTomorrowAN = moment()
		.add(1, 'd')
		.hour(14)
		.minute(0)
		.second(0);
	const momentNextMonday = moment()
		.startOf('isoWeek')
		.add(1, 'week')
		.hour(9)
		.minute(0)
		.second(0);

	useEffect(() => {
		if (!scheduleModalVisible) {
			setRadioGroupValue(null);
		}
	}, [scheduleModalVisible]);

	useEffect(() => {
		if (calendarDateValue && calendarTimeValue) {
			setScheduledDateTime(moment(`${calendarDateValue} ${calendarTimeValue}`));
		}
	}, [calendarDateValue, calendarTimeValue]);

	const handleRadioSelection = (selectedValue) => {
		setRadioGroupValue(selectedValue);

		switch (selectedValue) {
			case 'mondayMorning':
				setCalendarDateValue(momentNextMonday.format('YYYY-MM-DD'));
				setCalendarTimeValue(momentNextMonday.format('HH:mm'));
				break;

			case 'tomorrowAfternoon':
				setCalendarDateValue(momentTomorrowAN.format('YYYY-MM-DD'));
				setCalendarTimeValue(momentTomorrowAN.format('HH:mm'));
				break;

			case 'tomorrowMorning':
				setCalendarDateValue(momentTomorrowMorning.format('YYYY-MM-DD'));
				setCalendarTimeValue(momentTomorrowMorning.format('HH:mm'));
				break;

			case 'custom':
				if (!calendarDateValue || !calendarTimeValue) return;

				setScheduledDateTime(moment(`${calendarDateValue} ${calendarTimeValue}`));
				break;

			default:
				return;
		}
	};

	const dayTimeHourFormat = (moment) => {
		return `${moment.format('pd_day_month')}, ${moment.format('LT')}`;
	};

	const onClose = () => {
		setVisible(false);

		if (!sendMail) {
			setScheduleModalVisible(false);
			setScheduledAtTimeProps({});
		}
	};

	const sendScheduledMail = () => {
		const scheduledAtTimeISO = moment(scheduledDateTime).toISOString();

		if (sendMail) {
			// initiated from webapp composer
			sendMail({
				delayedUntil: scheduledAtTimeISO,
				delayedType: activeRadioValue,
				priorityType: 'scheduled_default'
			});

			setVisible(false);
		} else {
			// sending scheduled group email
			setScheduledAtTimeProps({
				time: scheduledAtTimeISO,
				type: activeRadioValue
			});
			setSendingScheduledEmail(true);
			setVisible(false);
			setScheduleModalVisible(false);
		}
	};

	const selectedTimePassed = () => {
		if (activeRadioValue === 'custom' && scheduledDateTime) {
			return (
				moment(scheduledDateTime).isBefore(moment().format('')) &&
				translator.gettext("Time can't be in the past")
			);
		}
	};

	const radioButtonText = (text, datePlaceholder) => {
		return (
			<RadioButtonContainer>
				<RadioText>{text}</RadioText>
				<MomentDate>{datePlaceholder}</MomentDate>
			</RadioButtonContainer>
		);
	};

	const isSendingDisabled = () => {
		if (activeRadioValue === 'custom') {
			return !calendarDateValue || !calendarTimeValue || selectedTimePassed();
		}

		return !scheduledDateTime;
	};

	const modalFooter = () => {
		return (
			<FooterDiv>
				{translator.gettext('GMT ')}
				{API.userSelf.get('timezone_offset')}
				<InlineInfo
					placement="top"
					text={
						<TimezoneHelperText>
							{translator.pgettext(
								'Timezone info in what time zone scheduled emails will be sent',
								'Times are shown in your current time zone:'
							)}
							<div>
								{translator.gettext('%s (GMT %s)', [
									API.userSelf.get('timezone_name'),
									API.userSelf.get('timezone_offset')
								])}
							</div>
						</TimezoneHelperText>
					}
				/>
				<FooterButtons>
					<Button onClick={() => onClose()}>{translator.gettext('Cancel')}</Button>
					<Button
						color="green"
						disabled={isSendingDisabled()}
						onClick={() => sendScheduledMail()}
					>
						{translator.gettext('Schedule email')}
					</Button>
				</FooterButtons>
			</FooterDiv>
		);
	};

	return (
		<>
			<Modal
				header={translator.gettext('Schedule email')}
				backdrop
				footer={modalFooter()}
				visible={scheduleModalVisible}
				closeOnEsc={true}
				onClose={onClose}
			>
				<StyledRadioGroup
					name="radiogroup"
					value={activeRadioValue}
					onComponentChange={(ev) => handleRadioSelection(ev.target.value)}
					options={[
						{
							label: radioButtonText(
								translator.gettext('Tomorrow morning'),
								dayTimeHourFormat(momentTomorrowMorning)
							),
							value: 'tomorrowMorning'
						},
						{
							label: radioButtonText(
								translator.gettext('Tomorrow afternoon'),
								dayTimeHourFormat(momentTomorrowAN)
							),
							value: 'tomorrowAfternoon'
						},
						{
							label: radioButtonText(
								translator.gettext('Monday morning'),
								dayTimeHourFormat(momentNextMonday)
							),
							value: 'mondayMorning'
						},
						{
							label: translator.gettext('Custom date and time'),
							value: 'custom'
						}
					]}
				/>
				<DateTimeContainer>
					<DateTimeComponent
						onClick={() => {
							setRadioGroupValue('custom');

							if (!DatePickerRef.current.state.open) {
								DatePickerRef.current.setOpen(true);
							}
						}}
					>
						<DateTimeHeader disabled={activeRadioValue !== 'custom'}>
							{translator.gettext('Date')}
						</DateTimeHeader>
						<FormFieldsContext.Provider value={{ translator, locale }}>
							<CalendarDatePicker
								ref={DatePickerRef}
								value={calendarDateValue}
								onComponentChange={(ev) => setCalendarDateValue(ev)}
								disabled={activeRadioValue !== 'custom'}
								minEndDate={moment().format('')}
								showTimeSelect={true}
							/>
						</FormFieldsContext.Provider>
					</DateTimeComponent>
					<DateTimeComponent onClick={() => setRadioGroupValue('custom')}>
						<DateTimeHeader disabled={activeRadioValue !== 'custom'}>
							{translator.gettext('Time')}
						</DateTimeHeader>
						<FormFieldsContext.Provider value={{ locale }}>
							<FFTimePicker
								value={calendarTimeValue}
								error={selectedTimePassed()}
								onComponentChange={() => {}}
								onRawChange={(moment) =>
									setCalendarTimeValue(moment ? moment.format('HH:mm') : '')
								}
								disabled={activeRadioValue !== 'custom'}
							/>
						</FormFieldsContext.Provider>
					</DateTimeComponent>
				</DateTimeContainer>
			</Modal>
		</>
	);
};

ScheduleMailModal.propTypes = {
	API: PropTypes.object.isRequired,
	setScheduleModalVisible: PropTypes.func,
	setModalVisibility: PropTypes.func,
	setModalClosed: PropTypes.func,
	setSendingScheduledEmail: PropTypes.func,
	setScheduledAtTimeProps: PropTypes.func,
	sendMail: PropTypes.func,
	translator: PropTypes.object.isRequired,
	draftModel: PropTypes.object
};

export default ScheduleMailModal;
