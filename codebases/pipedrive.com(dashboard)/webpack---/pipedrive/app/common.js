// eslint-disable-next-line
__webpack_public_path__ = '//cdn.' + app.config.cdnDomain + '/webapp/'; // NOSONAR

const _ = require('lodash').noConflict();
const $ = require('jquery');
const moment = require('moment');
const l10n = require('l10n');
const Backbone = require('backbone');
const User = require('models/user');
const Helpers = require('utils/helpers');
const lodashHelpers = require('utils/helpers-lodash');
const LocaleHelpers = require('utils/locale-helpers');
const MomentHelpers = require('utils/helpers-moment');

// Code that every visual webapp component requires but should be executed only once.
module.exports = async (componentLoader) => {
	const [user, languages] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:languages'),
		// ensure Select2 library is initialised before calling LocaleHelpers.setSelect2Locale
		import('jquery.select'),
		import('jquery.tooltips-0.1')
	]);

	if (!Backbone.LocalStorage) {
		await import('backbone.localstorage');
	}

	User.setUser(user);

	// Locale stuff
	_.assignIn(
		_,
		{
			// Extend lodash with l10n methods
			gettext: function(...args) {
				return l10n.gettext.apply(l10n, args);
			},
			ngettext: function(...args) {
				return l10n.ngettext.apply(l10n, args);
			},
			pgettext: function(...args) {
				return l10n.pgettext.apply(l10n, args);
			},
			npgettext: function(...args) {
				return l10n.npgettext.apply(l10n, args);
			},
			setLang: function(lang, translator) {
				l10n.setLang(lang, translator);
			}
		},
		// Extend underscore with Helpers
		Helpers,
		// Extend underscore with interactive timestamps
		lodashHelpers
	);

	await Promise.all([
		LocaleHelpers.setMomentLocale(user),
		LocaleHelpers.loadTranslations(user),
		LocaleHelpers.setSelect2Locale(user, languages)
	]);

	// Update interactive timestamps
	window.setInterval(() => {
		$('.interactiveTimestamp').each(function() {
			const spec = $(this).data('spec');

			let time = $(this).data('time');

			const utc = $(this).data('utc');
			const noTime = $(this).data('notime');
			const f = $(this).data('f') || 'YYYY-MM-DD HH:mm:ss';
			const oldText = $(this).text();

			if (!spec || !time) {
				return;
			}

			if (!(time instanceof moment.fn.constructor)) {
				time = utc ? moment.utc(time, f).local() : moment(time, f);
			}

			if (noTime) {
				time.noTime = true;
			}

			const newText = _.timestamp(time, spec, utc, f);

			if (oldText !== newText) {
				$(this)
					.text(newText)
					.trigger('contentUpdate');
			}
		});
	}, 25000);

	// Extending moment.js with Helpers
	// Injection is happening in the constructor of this class.
	MomentHelpers.injectCustomizations();
};
