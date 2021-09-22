import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { TIME_FORMATS } from '../../../../../config/constants';
import { TimePickerOption, DurationLabel } from '../datetimepicker-styles';

const findSelectedOptionTopOffset = (options, selectedOption) => {
	const optionHeight = 32;
	const topPadding = 8;
	const numberOfOptionsVisibleAboveSelected = 3;
	const calculateOffsetFromIndex = (index) =>
		(index - numberOfOptionsVisibleAboveSelected) * optionHeight + topPadding;

	const valueObject = options.find((option) => option.value === selectedOption);
	const index = options.indexOf(valueObject);

	if (index > -1) {
		return calculateOffsetFromIndex(index);
	}

	const nextTimeObject =
		options.find((option) =>
			moment(option.value, TIME_FORMATS).isAfter(moment(selectedOption, TIME_FORMATS)),
		) || options[0];
	const nextIndex = options.indexOf(nextTimeObject);

	return calculateOffsetFromIndex(nextIndex ? nextIndex - 1 : options.length - 1);
};

const TimePickerOptions = (props) => {
	const [selected, setSelected] = useState(props.selected);

	const scrollToSelectedOption = () => {
		const { popoverRef, options } = props;

		if (popoverRef && popoverRef.children.length > 0) {
			const scrollableArea = popoverRef.children[0];
			const offset = findSelectedOptionTopOffset(options, selected);

			scrollableArea.scrollTop = offset;
		}
	};

	useEffect(() => {
		if (props.popoverRef && selected) {
			scrollToSelectedOption();
		}

		if (props.selected !== selected) {
			setSelected(props.selected);
			scrollToSelectedOption();
		}
	}, [props.popoverRef, props.selected]);

	const updateSelected = (selected) => {
		setSelected(selected);
		props.setSelectedValue(selected);
		props.closePopover();
	};

	const { options } = props;

	return (
		options &&
		options.map((option) => {
			return (
				<TimePickerOption
					key={option.value}
					onClick={() => updateSelected(option.value)}
					highlighted={option.value === selected}
				>
					<span>{option.value}</span>
					{option.duration && <DurationLabel>{option.duration}</DurationLabel>}
				</TimePickerOption>
			);
		})
	);
};

TimePickerOptions.propTypes = {
	popoverRef: PropTypes.object,
	selected: PropTypes.string,
	scrollTo: PropTypes.func,
	setSelectedValue: PropTypes.func,
	options: PropTypes.array,
	closePopover: PropTypes.func,
};

export default TimePickerOptions;
