import get from 'lodash/get';
import Formatter from '@pipedrive/formatter';

let formatter;

export const initFormatter = (userSelf = {}) => {
	const formatterOptions = [
		get(userSelf, 'additionalData.locale_convention'),
		get(userSelf, 'attributes.currencies', []).filter((currency) => currency.is_custom_flag)
	];

	formatter = new Formatter(...formatterOptions);
};

export const format = (value, currency, userSelf) => {
	if (!formatter) {
		initFormatter(userSelf);
	}

	return formatter.format(value, currency);
};
