import Formatter from '@pipedrive/formatter';

export default async function (componentLoader) {
	const { additionalData, attributes } = await componentLoader.load('webapp:user');
	const localeConvention = additionalData?.locale_convention;
	const customCurrencies = attributes?.currencies.filter((currency) => currency.is_custom_flag) || [];

	return new Formatter(localeConvention, customCurrencies);
}
