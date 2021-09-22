import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Input } from '@pipedrive/convention-ui-react';

import { TIME_FORMATS } from '../../../../../config/constants';
import {
	selectNext,
	selectPrevious,
	updateInputValueIfNotWriting,
	selectClosestTimeInFuture,
	setSelectedValueIfValid,
} from './timepicker-utils';

const ENTER = 'Enter';
const ARROW_DOWN = 'ArrowDown';
const ARROW_UP = 'ArrowUp';

const TimePickerInput = (props) => {
	const [isWriting, setIsWriting] = useState(false);
	const [inputValue, setInputValue] = useState(props.selected);
	const timeFormats = [...TIME_FORMATS, props.timeFormat];

	useEffect(() => {
		updateInputValueIfNotWriting({ isWriting, setInputValue, selected: props.selected });
	}, [props.selected]);

	const setSelectedValue = (value, updateInput) => {
		props.setSelectedValue(value);

		updateInput && setInputValue(value);
	};

	const handleFocus = (e) => {
		const { fillInputOnFocus, locale, options } = props;

		setIsWriting(true);
		selectClosestTimeInFuture({ e, fillInputOnFocus, options, locale, setSelectedValue });
	};

	const handleChange = (e) => {
		const { timeFormat } = props;
		const value = e.target.value;
		const time = moment(value, timeFormats);

		setInputValue(value);
		setSelectedValueIfValid({ time, timeFormat, setSelectedValue });
	};

	const handleInputValue = (inputValue) => {
		const { selected, timeFormat, onClear } = props;

		if (!inputValue) {
			return onClear();
		}

		if (inputValue === selected) {
			return null;
		}

		return setSelectedValueIfValid({
			time: moment(inputValue, timeFormats),
			timeFormat,
			setSelectedValue,
			fallback: selected,
			updateInput: true,
		});
	};

	const handleArrowKeys = (key) => {
		const { selected, popoverVisible, togglePopoverVisibility, options } = props;

		!popoverVisible && togglePopoverVisibility(true);

		const selectedObject = options.find((option) => option.value === selected);
		const index = options.indexOf(selectedObject);
		const newSelected =
			key === ARROW_DOWN ? selectNext(index, options) : selectPrevious(index, options);

		setSelectedValue(newSelected.value, true);
	};

	const handleKeyDown = (e) => {
		if (e.key === ENTER) {
			handleInputValue(e.target.value);
			props.togglePopoverVisibility(false);
		} else if (e.key === ARROW_DOWN || e.key === ARROW_UP) {
			e.preventDefault();
			handleArrowKeys(e.key);
		}
	};

	const handleBlur = () => {
		setIsWriting(false);
		handleInputValue(inputValue);
	};

	return (
		<div ref={props.popoverTriggerRef} onClick={(e) => props.onClick(e)}>
			<Input
				allowClear
				value={inputValue}
				onFocus={(e) => handleFocus(e)}
				onChange={(e) => handleChange(e)}
				onKeyDown={(e) => handleKeyDown(e)}
				onBlur={() => handleBlur()}
				placeHolder={props.placeHolder}
				disabled={props.disabled}
				{...(props.error ? { color: 'red' } : {})}
			/>
		</div>
	);
};

TimePickerInput.propTypes = {
	placeHolder: PropTypes.string,
	disabled: PropTypes.bool,

	fillInputOnFocus: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	timeFormat: PropTypes.string.isRequired,
	options: PropTypes.array.isRequired,

	selected: PropTypes.string,
	setSelectedValue: PropTypes.func.isRequired,
	onClear: PropTypes.func.isRequired,
	popoverVisible: PropTypes.bool.isRequired,
	togglePopoverVisibility: PropTypes.func.isRequired,

	onClick: PropTypes.func,
	popoverTriggerRef: PropTypes.func,

	error: PropTypes.bool,
};

export default TimePickerInput;
