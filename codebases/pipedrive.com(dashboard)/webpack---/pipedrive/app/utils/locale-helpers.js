const _ = require('lodash');
const { fe: crowdin } = require('@pipedrive/translator-client/crowdin');
const getTranslator = require('@pipedrive/translator-client/fe');
const moment = require('moment');
const MomentHelpers = require('utils/helpers-moment');
const MomentLocaleHelper = require('utils/helpers-moment-locale');
const Logger = require('utils/logger');
const logger = new Logger(`webapp.${app.ENV}`, 'utils');

const locals = {
	getSupportedLanguages: function(Languages) {
		const languages = Languages.map((language) => {
			return language.getKey('_');
		});

		// Exclude default language key
		return _.without(languages, 'en_US');
	},

	initCrowdin: function(userLanguage) {
		setTimeout(() => {
			crowdin(userLanguage);
		}, 1500);
	}
};

const helpers = {
	setMomentLocale: async function(user) {
		const locale = user.get('locale');
		const momentLocaleName = MomentLocaleHelper[locale];

		if (momentLocaleName && momentLocaleName !== MomentHelpers.LOCALE) {
			try {
				await import(
					/* webpackMode: "lazy-once", webpackChunkName: "l10n-moment-all" */
					`moment/locale/${momentLocaleName}`
				);

				moment.locale(momentLocaleName);

				if (momentLocaleName in MomentHelpers.formatOverrides) {
					moment.updateLocale(
						momentLocaleName,
						MomentHelpers.formatOverrides[momentLocaleName]
					);
				}
			} catch (err) {
				logger.error(`Could not fetch moment locale for ${locale}`, err);
			}
		}
	},

	loadTranslations: async function(user) {
		const userLanguage = user.getLanguage();
		const isDefaultLanguage = userLanguage === 'en-US';

		if (userLanguage && !isDefaultLanguage) {
			locals.initCrowdin(userLanguage);

			const translator = await getTranslator('webapp', userLanguage, logger);

			_.setLang(userLanguage, translator);
		}
	},

	setSelect2Locale: async function(user, Languages) {
		const language = user.get('language');
		const languageKey = `${language.language_code}_${language.country_code}`;
		const supportedLanguages = locals.getSupportedLanguages(Languages);

		let fileName = language.language_code === 'nb' ? 'no' : language.language_code;

		if (language.country_code === 'GB') {
			fileName = 'en-GB';
		}

		if (_.indexOf(supportedLanguages, languageKey) !== -1 && languageKey !== 'aa_ER') {
			try {
				await import(
					/* webpackMode: "lazy-once", webpackChunkName: "l10n-select2-all" */
					`../../libs/select/select2_locale_${fileName}`
				);
			} catch (err) {
				logger.logError(
					err,
					`Could not fetch select2 locale for ${fileName}`,
					'error',
					null,
					`webapp.${app.ENV}`
				);
			}
		}
	}
};

module.exports = helpers;
