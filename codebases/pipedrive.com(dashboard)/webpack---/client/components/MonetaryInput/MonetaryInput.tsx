import React, { useState, useEffect } from 'react';
import { isNil } from 'lodash';

import { Input, InputProps } from '@pipedrive/convention-ui-react';

type Value = string | number;

type MonetaryInputProps = Omit<InputProps, 'onBlur' | 'onChange' | 'value'> & {
	value: Value;
	onChange: (amount: number) => void;
};

const formatValue = (value: Value) => (isNil(value) ? '' : String(value));

const MonetaryInput: React.FC<MonetaryInputProps> = ({ value: passedValue, onChange, ...restProps }) => {
	const [amount, setAmount] = useState(formatValue(passedValue));

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = formatValue(event.target.value);

		setAmount(value);
		onChange(Number(value));
	};

	useEffect(() => {
		/**
		 * Comma and dot formatting will not trigger reset from parent prop.
		 * Enabling continued editing in the field as is with formatting present.
		 */
		const hasDisparityFromFormattedValue = Number(passedValue) !== Number(amount);

		/**
		 * When new upstream value is present it will take
		 * precedence over local state.
		 */
		if (hasDisparityFromFormattedValue) {
			setAmount(formatValue(passedValue));
		}
	}, [passedValue]);

	return <Input {...restProps} type="number" value={amount} onChange={handleChange} />;
};

export default MonetaryInput;
