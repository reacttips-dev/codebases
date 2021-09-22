import { getClosestTimeInFuture } from '../../../../../utils/date';

export const selectNext = (index, options) => {
	return index + 1 < options.length ? options[index + 1] : options[0];
};

export const selectPrevious = (index, options) => {
	return index - 1 < 0 ? options[options.length - 1] : options[index - 1];
};

export const updateInputValueIfNotWriting = ({ isWriting, setInputValue, selected }) => {
	!isWriting && setInputValue(selected);
};

export const selectClosestTimeInFuture = ({
	e,
	fillInputOnFocus,
	options,
	locale,
	setSelectedValue,
}) => {
	if (e.target.value || !fillInputOnFocus) {
		return;
	}

	const newSelected = getClosestTimeInFuture(options, locale);

	setSelectedValue(newSelected, true);
};

export const setSelectedValueIfValid = ({
	time,
	timeFormat,
	setSelectedValue,
	fallback,
	updateInput = false,
}) => {
	const isValid = time.isValid();

	if (isValid) {
		setSelectedValue(time.format(timeFormat), updateInput);

		return;
	}

	fallback && setSelectedValue(fallback, updateInput);
};
