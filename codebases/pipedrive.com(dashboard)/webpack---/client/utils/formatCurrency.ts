import { getDefaultCurrency } from '../shared/api/webapp';

let formatter;
// For viewer which does not have access to webappApi like we do in the normal app
let defaultCurrency;

export async function initFormatter(componentLoader: any, fixedDefaultCurrency?: string) {
	formatter = await componentLoader.load('froot:formatter');

	if (fixedDefaultCurrency) {
		defaultCurrency = fixedDefaultCurrency;
	}
}

export default (val = 0, currency?: string) => {
	if (!formatter) {
		throw new Error('Formatter was not initialized');
	}

	return formatter.format(val, currency || defaultCurrency || getDefaultCurrency());
};
