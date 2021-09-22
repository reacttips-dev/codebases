import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input } from '@pipedrive/convention-ui-react';

import modalContext from '../../../../utils/context';
import { convertInputValueToAttendee } from './helpers';

const BorderlessInput = styled(Input)`
	.cui4-input__box {
		input {
			border: none !important;
			box-shadow: none !important;
		}
	}
`;

const AttendeesInput = ({
	inputProps,
	onFocus,
	onBlur,
	translator,
	addOnEnter,
	addAttendee,
	removeLastAttendee,
	fetchSearchResults,
	loading,
	inputRef,
	autoFocus,
}) => {
	const addInputValueAsAttendee = (inputValue) => {
		const newAttendee = convertInputValueToAttendee(inputValue);

		addAttendee(newAttendee);
	};

	return (
		<BorderlessInput
			{...inputProps}
			forwardRef={inputRef}
			onFocus={() => {
				onFocus && onFocus();
			}}
			onBlur={(e) => {
				const inputValue = e.target.value;

				if (inputValue) {
					addInputValueAsAttendee(inputValue);
				}

				onBlur && onBlur(e, !inputValue);
				inputProps.onBlur(e);
			}}
			onChange={(e) => {
				if (e.target.value.length > 1) {
					fetchSearchResults(e.target.value);
				}

				inputProps.onChange(e);
			}}
			onKeyDown={(e) => {
				if (e.key === ',' && e.target.value && addAttendee) {
					e.preventDefault();
					addInputValueAsAttendee(e.target.value);
				}

				if (e.key === 'Enter' && addOnEnter && addAttendee) {
					addInputValueAsAttendee(e.target.value);
				}

				if (e.keyCode === 8 && !e.target.value) {
					removeLastAttendee();
				}

				inputProps.onKeyDown(e);
			}}
			placeholder={translator.gettext('Add guests – invite your contacts or via email')}
			loading={loading}
			autoFocus={autoFocus}
		/>
	);
};

AttendeesInput.propTypes = {
	inputProps: PropTypes.object,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	translator: PropTypes.object.isRequired,
	addOnEnter: PropTypes.bool,
	addAttendee: PropTypes.func,
	removeLastAttendee: PropTypes.func,
	fetchSearchResults: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	inputRef: PropTypes.object,
	autoFocus: PropTypes.bool,
};

export default modalContext(AttendeesInput);
