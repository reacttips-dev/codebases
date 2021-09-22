const Pipedrive = require('pipedrive');
const Backbone = require('backbone');
const _ = require('lodash');
const $ = require('jquery');
const User = require('models/user');
const browser = require('utils/browser');
const webmailProviders = require('utils/webmail-providers');

const logger = new Pipedrive.Logger('utils', 'helpers');
const companyDomain = location.host.split('.')[0];
const isCurrentCompany = companyDomain === app.config.appDomain;

function isDev() {
	const isBuildOrDev = app.config.appDomain === 'build' && app.ENV === 'dev';

	return isCurrentCompany && isBuildOrDev;
}
function isAccessToCompany() {
	let accessToCompany = false;

	if (isCurrentCompany) {
		accessToCompany = true;
	} else {
		// eslint-disable-next-line no-unused-vars
		for (const i in User.get('companies')) {
			if (User.get('companies')[i].domain === companyDomain) {
				accessToCompany = true;
				break;
			}
		}
	}

	return accessToCompany;
}
function getIconName(name) {
	// Hack for attach
	if (name === 'sm-attach') {
		name = 'attach';
	}

	return name;
}
/**
 * Inserts escape characters into query and returns new RegExp
 * @param query         query to construct RegExp
 * @returns {RegExp}    RegExp with inserted escape characters
 */
function insertEscapeCharacters(query) {
	query = _.escape(
		query
			.trim()
			.replace(/\*|\?/, '')
			.replace(/\s+/g, '|')
			.replace(/([()[\]/.+])/g, '\\$1')
			.replace(/\\+$/, '')
	);

	try {
		return new RegExp(`(${query})`, 'gi');
	} catch (e) {
		logger.remote(
			'warning',
			'Failed to create RegExp',
			{
				error_details: e.message,
				stack: e.stack
			},
			`webapp.${app.ENV}`
		);
	}
}
/**
 * Show error on main page if browser is 8.0 IE or api sends back an error
 * @param  {object} api response
 * @param  {object} user model
 * @param  {object} api response
 */
function isEmail(email) {
	return _.isString(email) && !!email.match(/^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}$/);
}
function isInteger(n) {
	return _.isNumber(n) && n % 1 === 0;
}
/**
 * Get human readable file size like: "24 kB", "2.5MB"
 * @param  {Number} size 	file size in bytes
 * @return {String}
 */
function combineHumanizedFileSize(size) {
	if (!isInteger(size)) {
		return '';
	}

	// http://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable
	const i = size === 0 ? size : Math.floor(Math.log(size) / Math.log(1024));

	return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
}

function getParentWithScroll($el) {
	return $el
		.parents()
		.filter(function() {
			return /(auto|scroll)/.test(
				$(this).css('overflow') + $(this).css('overflow-y') + $(this).css('overflow-x')
			);
		})
		.first();
}

async function getRedirectUrl() {
	const domain = User.get('companies')[User.get('company_id')].domain;
	const baseDomain = app.config.baseDomain;

	if (isDev()) {
		return false;
	}

	const appDomain = app.config.appDomain;
	const isHostCorrect = location.host === `${appDomain}.${baseDomain}`;

	if (!isAccessToCompany() && !isHostCorrect) {
		return `${domain}.${baseDomain}`;
	} else if (companyDomain && isHostCorrect) {
		return `${domain}.${baseDomain}${location.pathname}`;
	}

	return false;
}
function isSupportedBrowser() {
	return browser.isSupportedBrowser();
}
function showError(data, user, xhr) {
	const $err = $('<div class="appError"/>');

	if (data === 'IE') {
		$err.html(
			`<h1>${_.gettext('Something went wrong.')}</h1>` +
				`<p>${_.gettext(
					"Pipedrive doesn't support your current browser. Please upgrade!"
				)}</p>` +
				`<p class="message">${_.gettext(
					'You are currently using Internet Explorer %s',
					browser.getUserWebBrowserVersion()
				)}</p>`
		);
	} else {
		if (Number(xhr.status) === 401 || Number(xhr.status) === 402) {
			return;
		}

		$err.html(
			`<h1>${_.gettext('This is not quite right.')}</h1>${
				app.ENV === 'dev'
					? `<p class="message">${_.isObject(data) ? data.error : data}</p>`
					: ''
			}<p>${_.gettext(
				'Something went wrong with loading Pipedrive. Please wait for a few moments and try again.'
			)}</p><br>` +
				`<p>${_.gettext(
					'Meanwhile, %sour status page%s can tell you how our systems are doing.',
					[
						'<a class="green" href="http://status.pipedrive.com/" target="_blank">',
						'</a>'
					]
				)}</p><br>` +
				`<small>${_.gettext(
					"In any case, we're sorry for the trouble and we're working hard" +
						' to never have to show this page to you again!'
				)}</small>`
		);
	}

	$err.appendTo($('#application'));
	const top = ($(document).height() - $err.outerHeight()) / 2;

	$err.css({ top });
	$('body').removeClass('loading');
}
function isTouch() {
	return (
		!!('ontouchstart' in window) || // works on most browsers
		(!!('onmsgesturechange' in window) && !!('onMsMaxTouchPoints' in window.navigator))
	); // works on ie10
}
function isModel(o) {
	return (
		_.isObject(o) &&
		(o instanceof Backbone.Model || o.prototype instanceof Backbone.Model || o.isUserModel)
	);
}
function isCollection(o) {
	return (
		_.isObject(o) &&
		(o instanceof Backbone.Collection || o.prototype instanceof Backbone.Collection)
	);
}
function isView(o) {
	return _.isObject(o) && (o instanceof Backbone.View || o.prototype instanceof Backbone.View);
}
// eslint-disable-next-line max-params
function adler32(a, b, c, d, e, f) {
	for (b = 65521, c = 1, d = 0, e = 0, f; (f = a.charCodeAt(e++)); d = (d + c) % b) {
		c = (c + f) % b;
	}

	// eslint-disable-next-line no-bitwise
	return (d << 16) | c;
}
function capitalize(string) {
	if (!_.isString(string)) {
		return string;
	}

	return string.charAt(0).toUpperCase() + string.substring(1);
}
function fullTrim(string) {
	if (!_.isString(string)) {
		return string;
	}

	return string.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
}
function parseQueryParam(url, paramName) {
	const name = paramName.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
	const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
	const results = regex.exec(url);

	return results === null ? '' : decodeURIComponent(results[1]);
}
/**
 * createPhoneLink returns phone link href formatted according to company settings
 * @param  {string} phone
 * @param  {object} optional data object with deal_id, person_id, org_id set
 * @return {string}
 */
function createPhoneLink(phone, data) {
	if (!_.isString(phone)) {
		logger.warn('Phone value is not a string');

		return '';
	}

	let formatted = _.toString(User.settings.get('callto_link_syntax'));

	// Remove spaces

	const cleanPhone = phone.replace(/(\s)/g, '');
	/*
	[number] -> the phone number value in the field
	[user_id] -> the id of the logged in user
	[deal_id] -> the deal id of the deal the user is on (if possible)
	[person_id] -> the id of the person the number is linked to (if possible)
	[org_id] -> the id of the organization the number is linked to (if possible)
	*/

	formatted = formatted.split('[number]').join(cleanPhone);
	formatted = formatted.split('[user_id]').join(User.id);

	data = data || {};

	// other optional fields replaced with blank if no data provided
	formatted = formatted.split('[deal_id]').join(data.deal_id || '');
	formatted = formatted.split('[person_id]').join(data.person_id || '');
	formatted = formatted.split('[org_id]').join(data.org_id || '');

	if (formatted.match(/javascript|data:/gi)) {
		logger.warn('XSS attempt');

		return '';
	}

	return formatted;
}
/**
 * formatPhoneNumber converts 10 digit long phone numbers to US phone number format
 * if user has "en_US" locale and "format_phone_numbers_enabled" setting is turned on.
 * It has similar purpose as "format_visible_phone_nr" helper method in back-end.
 *
 * @param  {string}
 * @return {string}
 */
function formatPhoneNumber(phone) {
	let formatted = phone;

	if (User.settings.get('format_phone_numbers_enabled') && User.get('locale') === 'en_US') {
		formatted = phone.startsWith('+1')
			? `+1 ${phone
					.slice(2)
					.trim()
					.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}`
			: phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
	}

	return formatted;
}
/**
 * Try to guess name from email bits
 */
function parseNamesFromEmail(email) {
	let namePattern = email.match(/^(.*)@/);
	let orgPattern = email.match(/@((.+)(\.co)?\.\w+)$/);

	if (namePattern) {
		namePattern = namePattern[1].replace(/[.+]/g, ' ');

		if (namePattern.length) {
			namePattern = namePattern.split(' ');

			_.forEach(namePattern, (nameStr, i) => {
				namePattern[i] = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
			});

			namePattern = namePattern.join(' ');
		}
	} else {
		namePattern = email;
	}

	if (orgPattern) {
		const orgDomain = orgPattern[1];

		let orgName = orgPattern[2];

		// If the domain name is of a well known email provider, such as gmail.com or hotmail.com
		// don't parse it as the org name, as the contact most probably does not work there.
		if (_.includes(webmailProviders, orgDomain.toLowerCase())) {
			orgName = null;
		} else {
			orgName = orgName.replace(/\.\+/g, ' ');

			if (orgName.length) {
				orgName = orgName.charAt(0).toUpperCase() + orgName.slice(1);
			}
		}

		orgPattern = orgName;
	} else {
		orgPattern = email;
	}

	return {
		name: namePattern,
		org: orgPattern
	};
}
function icon(name, size, color, className) {
	name = getIconName(name);

	if (!name) {
		return;
	}

	const iconName = `#icon-${name}`;
	const colorMap = {
		light: 'black-24',
		mid: 'black-32',
		blue: 'blue',
		green: 'green',
		red: 'red',
		yellow: 'yellow',
		purple: 'purple',
		white: 'white',
		dark: 'black-88'
	};
	const sizeMap = {
		small: 's'
	};

	color = colorMap[color] || color;
	size = sizeMap[size] || size;

	const colorClassName = color ? ` cui4-icon--${color}` : '';
	const sizeClassName = size ? ` cui4-icon--${size}` : '';
	const svgClassName = className ? ` ${className}` : '';
	const iconMarkup =
		`<svg class="cui4-icon${colorClassName}${sizeClassName}${svgClassName}">` +
		`<use xlink:href="${iconName}" href="${iconName}"/>` +
		`</svg>`;

	return iconMarkup;
}
function badge(options) {
	const color = options.color;
	const _icon = options.icon ? icon(`sm-${options.icon}`, 'small', color) : '';
	const text = options.text ? `<div class="cui4-badge__label">${options.text}</div>` : '';
	const classNames = ['cui4-badge'];

	if (options.outline) {
		classNames.push('cui4-badge--outline');
	}

	if (color) {
		classNames.push(`cui4-badge--${color}`);
	}

	return `<div class="${classNames.join(' ')}">${text}${_icon}</div>`;
}
/**
 * Returns a Spinner with given style
 * @param  {String}		size			Size of spinner ['s', 'm' (default), l', 'xl']
 * @param  {Boolean}	green			Sets if spinner has green color
 * @return {Boolean}	darkBackground	Sets if spinner has dark background
 */
function spinner(size, green, darkBackground) {
	const classes = [];

	let spinnerIcon = '';

	(size || 'm') && classes.push(`cui4-spinner--${size}`);

	if (!green) {
		classes.push('cui4-spinner--light');
	}

	if (darkBackground) {
		classes.push('cui4-spinner--dark-background');
	}

	if (size === 'xl') {
		spinnerIcon = icon('p', '', '', 'cui4-spinner__icon');
	}

	return (
		`<div class="cui4-spinner ${classes.join(' ')}">` +
		`<div class="cui4-spinner__trail"></div>${spinnerIcon}</div>`
	);
}
function addObjectToFormData(formData, object) {
	if (!formData || !_.isPlainObject(object)) {
		return;
	}

	const addRecursively = function(value, key) {
		if (_.isPlainObject(value)) {
			_.forEach(
				value,
				_.bind((subValue, subKey) => {
					addRecursively(subValue, key ? `${key}[${subKey}]` : subKey);
				})
			);
		} else {
			formData.append(key, value);
		}
	};

	addRecursively(object);
}
/* If item not visible, show yellow message. Make sure to bind your context (this) when calling this function */
function itemNotVisible() {
	const $div = $('<div>')
		.addClass('noView message')
		.text(
			_.gettext(
				'This item is not visible to you or does not exist.' +
					' If you think you should be able to access this item,' +
					' please contact an administrator from your company.'
			)
		);

	this.$el.html($div);
}
/* For testing async tests :) */
function async(next) {
	setTimeout(() => {
		next(true);
	}, 100);
	setTimeout(() => {
		next(false);
	}, 50);
}
function hasAdBlocker() {
	const ad = $('<div/>', {
		id: 'bottomAd',
		css: {
			position: 'absolute',
			top: '-1000px',
			left: '-1000px',
			width: '1px',
			height: '1px'
		}
	});

	$('body').append(ad);

	return !ad.is(':visible');
}
function breakingExtensions() {
	const active = [];
	const extensions = [
		{
			name: 'Point',
			selector: '.pnt-on-image-wrapper'
		}
	];

	_.forEach(extensions, (ext) => {
		if ($(ext.selector).length > 0) {
			active.push(ext.name);
		}
	});

	return active.length > 0 ? active : false;
}
/**
 * Highlights a string by replacing query text with a HTML element.
 * @param  {string} string        String to replace in
 * @param  {string} query         String to search and replace
 * @param  {string} [replacement] Replacement string(Optional).
 *                                Should contain '$1' as that is the value which is replaced.
 * @return {string}               Highlighted string
 */
function highlight(string, query, replacement) {
	if (!_.isString(string) && !_.isNumber(string)) {
		return '';
	}

	string = _.escape(string);

	if (!_.isString(query)) {
		return string;
	}

	const pattern = insertEscapeCharacters(query);

	replacement = replacement || '<span class="highlight">$1</span>';

	return pattern ? string.replace(pattern, replacement) : string;
}
/**
 * Regex tester for particular string in another string
 * @param string		string to search from
 * @param query			string to search for
 * @returns {boolean} 	true if there is a match
 */
function includesString(string, query) {
	if (!_.isString(string) && !_.isNumber(string)) {
		return false;
	}

	string = _.escape(string);

	if (!_.isString(query)) {
		return false;
	}

	const pattern = insertEscapeCharacters(query);

	return pattern ? pattern.test(string) : false;
}
/**
 * Open popup in the center of the page
 * @param  {string} url Popup URL
 * @param  {string} w   Popup width
 * @param  {string} h   Popup height
 * @return {object}     Popup object
 */
function openPopupInCenter(url, w, h) {
	const dualScreenLeft = window.screenLeft || screen.left;
	const dualScreenTop = window.screenTop || screen.top;

	// eslint-disable-next-line max-len

	const width = window.innerWidth
		? window.innerWidth
		: document.documentElement.clientWidth
		? document.documentElement.clientWidth
		: screen.width;

	// eslint-disable-next-line max-len

	const height = window.innerHeight
		? window.innerHeight
		: document.documentElement.clientHeight
		? document.documentElement.clientHeight
		: screen.height;
	const left = width / 2 - w / 2 + dualScreenLeft;
	const top = height / 2 - h / 2 + dualScreenTop;

	return window.open(
		url,
		'apopup',
		`location=0,status=0,width=${w},height=${h},top=${top},left=${left}`
	);
}
/**
 * Returns translated tier label
 * @param {string} tier silver|gold|platinum|diamond
 * @return {string|undefined}
 */
function getTierLabel(tier) {
	return User.get('tier_names')[tier];
}
/**
 * Returns direction styles for the given text
 * @param {string} text Text to validate
 * @return {string} Returns direction styles or empty string
 */
function getDirectionStyles(text = '') {
	// Character range for the following right-to-left alphabets: Hebrew, Arabic,
	// Syriac, Arabic Supplement, Thaana, NKo
	const rtlRegex = /[\u0591-\u07FF]/;

	return rtlRegex.test(text) ? 'style="direction: rtl;"' : '';
}

function isLastRouteMailPage(lastRoute) {
	return /^(mail$|\/mail\/)/.test(lastRoute);
}

module.exports = {
	browser: browser.getUserWebBrowser,
	browserVersion: browser.getUserWebBrowserVersion,
	deviceType: browser.getUserDeviceType,
	operatingSystem: browser.getUserOperatingSystem,
	title: {
		default: $('title').text(),
		set: function(title) {
			if (_.isString(title)) {
				document.title = title;
			}
		},
		reset: function() {
			$('title').text(_.title.default);
		}
	},
	insertEscapeCharacters,
	isEmail,
	isInteger,
	combineHumanizedFileSize,
	getParentWithScroll,
	getRedirectUrl,
	isSupportedBrowser,
	showError,
	isTouch,
	isModel,
	isCollection,
	isView,
	adler32,
	capitalize,
	fullTrim,
	parseQueryParam,
	createPhoneLink,
	formatPhoneNumber,
	parseNamesFromEmail,
	icon,
	badge,
	spinner,
	addObjectToFormData,
	itemNotVisible,
	async,
	hasAdBlocker,
	breakingExtensions,
	highlight,
	includesString,
	openPopupInCenter,
	getTierLabel,
	getDirectionStyles,
	isLastRouteMailPage
};
