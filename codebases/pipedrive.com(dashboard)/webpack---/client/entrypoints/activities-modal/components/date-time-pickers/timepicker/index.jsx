import React, { createRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import TimePickerInput from './timepicker-input';
import TimePickerOptions from './timepicker-options';

import {
	getTimeOptions,
	getTimeSuggestions,
	getTimeFormatFromLocale,
	getTimeFormatExampleForLocale,
} from '../../../../../utils/date';
import { TIME_FORMATS, FORMAT_24H, DEFAULT_LOCALE } from '../../../../../config/constants';
import { TimePickerPopover } from '../datetimepicker-styles';

const TimePicker = (props) => {
	const popoverRef = createRef();
	const timeFormat = getTimeFormatFromLocale(props.locale);
	const timeFormats = [...TIME_FORMATS, timeFormat];
	const timeFormatPlaceHolder = getTimeFormatExampleForLocale(props.locale);
	const [selected, setSelected] = useState('');
	const [visible, setVisible] = useState(false);

	const setSelectedValue = (value) => {
		const normalValue = value
			? moment(value, timeFormats, props.locale).locale(DEFAULT_LOCALE).format(FORMAT_24H)
			: '';

		setSelected(value);

		if (normalValue !== props.value) {
			props.onChange(normalValue);
		}
	};

	useEffect(() => {
		const { value, locale } = props;
		const selectedValue = value
			? moment(value, timeFormats).locale(locale).format(timeFormat)
			: '';

		setSelectedValue(selectedValue);
	}, [props.value]);

	const getOptions = () => {
		const { showSuggestionsBasedOnTime, locale } = props;

		return showSuggestionsBasedOnTime
			? getTimeSuggestions(showSuggestionsBasedOnTime, locale)
			: getTimeOptions(15, locale);
	};

	const renderOptions = () => {
		return (
			<TimePickerOptions
				popoverRef={popoverRef.current}
				selected={selected}
				setSelectedValue={(value) => setSelectedValue(value)}
				options={getOptions()}
				closePopover={() => setVisible(false)}
				timeFormat={timeFormat}
				showSuggestionsBasedOnTime={props.showSuggestionsBasedOnTime}
			/>
		);
	};

	const {
		disabled,
		fillInputOnFocus,
		locale,
		onClear,
		showSuggestionsBasedOnTime,
		error,
	} = props;

	return (
		<TimePickerPopover
			long={showSuggestionsBasedOnTime}
			content={() => renderOptions()}
			closeOnClick
			popoverProps={{
				placement: 'bottom-start',
				visible,
				innerRefProp: 'popoverTriggerRef',
				onPopupVisibleChange: (visible) => setVisible(visible),
				popperProps: { positionFixed: true },
			}}
			forwardRef={popoverRef}
		>
			<TimePickerInput
				placeHolder={timeFormatPlaceHolder}
				disabled={disabled}
				fillInputOnFocus={fillInputOnFocus}
				locale={locale}
				timeFormat={timeFormat}
				options={getOptions()}
				selected={selected}
				setSelectedValue={(value) => setSelectedValue(value)}
				onClear={() => onClear()}
				popoverVisible={visible}
				togglePopoverVisibility={(visible) => setVisible(visible)}
				error={error}
			/>
		</TimePickerPopover>
	);
};

TimePicker.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	onClear: PropTypes.func,
	showSuggestionsBasedOnTime: PropTypes.string,
	fillInputOnFocus: PropTypes.bool,
	options: PropTypes.array,
	locale: PropTypes.string,
	error: PropTypes.bool,
};

export default TimePicker;
