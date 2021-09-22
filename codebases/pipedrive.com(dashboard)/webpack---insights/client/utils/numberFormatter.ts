import Formatter from '@pipedrive/formatter';

import { get as getWebappApi, getAdditionalData } from '../api/webapp';

let formatterInstance: Formatter;

export const getFormatter = (): Formatter => {
	if (!formatterInstance) {
		const additionalData = getAdditionalData();
		const localeConvention = additionalData
			? additionalData.locale_convention
			: // eslint-disable-next-line no-undefined
			  undefined;

		formatterInstance = new Formatter(
			localeConvention,
			getWebappApi().userSelf.currencies,
		);
	}

	return formatterInstance;
};

export const getCurrency = (currencyCode?: string): string => {
	const WebappApi = getWebappApi();
	const defaultCurrency = WebappApi.userSelf.settings.default_currency;

	return currencyCode || defaultCurrency;
};

export const getCurrencyNameByCode = (currencyCode: string): string => {
	const WebappApi = getWebappApi();
	const selectedCurrency: Pipedrive.Currency =
		WebappApi.userSelf.currencies.find(
			(currency: Pipedrive.Currency) => currency.code === currencyCode,
		);

	return selectedCurrency ? selectedCurrency.name : currencyCode;
};

export const numberFormatter = {
	format: ({
		value,
		isMonetary = true,
		currencyCode,
	}: {
		value: string | number;
		isMonetary?: boolean;
		currencyCode?: string;
	}): string => {
		const formatter = getFormatter();
		const currency = getCurrency(currencyCode);

		return isMonetary
			? formatter.format(Number(value), currency).replace(/\s/g, ' ')
			: formatter.format(Number(value));
	},
	unformat: ({
		value,
		isMonetary = true,
		currencyCode,
	}: {
		value: string;
		isMonetary?: boolean;
		currencyCode?: string;
	}): number => {
		const formatter = getFormatter();
		const currency = getCurrency(currencyCode);

		return formatter.unformat(value, isMonetary && currency);
	},
	abbreviateNumber: ({
		value,
		isMonetary,
		currencyCode,
		precision = 0,
	}: {
		value: number;
		isMonetary: boolean;
		currencyCode?: string;
		precision: number;
	}): string => {
		const formatter = getFormatter();

		if (isMonetary && !currencyCode) {
			currencyCode = getCurrency();
		}

		return formatter.abbreviateNumber(
			value,
			currencyCode,
			precision as any,
		);
	},
};
