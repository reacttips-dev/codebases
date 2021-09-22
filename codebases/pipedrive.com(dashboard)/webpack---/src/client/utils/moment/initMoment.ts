import moment from 'moment';
import momentLocaleHelper from './constants/locale';
import Logger from '@pipedrive/logger-fe';
import { FORMAT_PATTERNS, LOCALE, FORMAT_OVERRIDE } from './constants';

interface MomentCustom extends moment.Moment {
	getEditorTime?: () => any;
	fn: any;
	updateLocale: any;
}

const customMoment: MomentCustom = moment as any;
const logger = new Logger('froot', 'initMoment');
const customFormats = {
	pd_day_month: function () {
		const userLocale = this.locale();

		// List of Pipedrive's most important locales and their format patterns ..
		const formatPatterns = FORMAT_PATTERNS;

		// .. and a fallback for the rest.

		const fallback = 'l';

		return formatPatterns.hasOwnProperty(userLocale) ? formatPatterns[userLocale] : fallback;
	},
};

function is24HourFormat() {
	return !moment().localeData().longDateFormat('LT').includes('A');
}

function getEditorTimeFormat() {
	return is24HourFormat() ? 'HH:mm' : 'hh:mm A';
}

async function initLocale(user: any, componentLoader: ComponentLoader) {
	const locale = user.get('locale');
	const momentLocaleName = momentLocaleHelper[locale];

	if (momentLocaleName && momentLocaleName !== LOCALE) {
		try {
			await import(
				/* webpackChunkName: "l10n-moment-all" */
				`moment/locale/${momentLocaleName}.js`
			);
			customMoment.locale(momentLocaleName);

			if (momentLocaleName in FORMAT_OVERRIDE) {
				customMoment.updateLocale(momentLocaleName, FORMAT_OVERRIDE[momentLocaleName]);
			}

			componentLoader.registerExternal('moment', customMoment);
		} catch (err) {
			componentLoader.registerExternal('moment', customMoment);
			logger.error(`Could not fetch moment locale for ${locale}`, err);
		}
	} else {
		componentLoader.registerExternal('moment', customMoment);
	}
}

export default async (user: any, componentLoader: ComponentLoader) => {
	customMoment.fn.getEditorTime = function () {
		const locale = this.locale();

		let time = '';

		if (this.isValid()) {
			this.locale('en');
			time = this.format(getEditorTimeFormat());
			this.locale(locale);
		}

		return time;
	};
	const origFormat = moment.fn.format;

	customMoment.fn.format = function (inputString) {
		if (typeof customFormats[inputString] === 'function') {
			inputString = customFormats[inputString].call(this);
		}

		return origFormat.call(this, inputString);
	};
	await initLocale(user, componentLoader);
};
