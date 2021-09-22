const _ = require('lodash');
const $ = require('jquery');

const LocalStorage = require('utils/get-local-storage');
const User = require('models/user');
const SalesPhoneView = require('views/shared/sales-phone-dialler');
const ActivityModel = require('models/activity');

const CALLER12_ONBOARDING_DONE = 'caller12_onboarding_done';

const DEFAULT_CALLTO_SYNTAX = 'callto:[number]';
const CALLER_CALLTO_SYNTAX = 'caller:[number]?call';

const METHOD_INTEGRATION = 'default_callto';
const METHOD_CALLER_WEB = 'caller_web';
const METHOD_CALLER_TRANSFER = 'caller_device';
const METHOD_WEB_TO_MOBILE = 'web_to_mobile';

const SOURCE_QUICK_CALL = 'quick-call';
const SOURCE_QUICK_CALL_PHONE_NUMBER = 'quick-call_phone_number';

const quickCallTooltips = {
	[METHOD_INTEGRATION]: _.gettext('Call with a calling app'),
	[METHOD_CALLER_WEB]: _.gettext('Call with Caller'),
	[METHOD_WEB_TO_MOBILE]: _.gettext('Phone call sent to mobile'),
	[METHOD_CALLER_TRANSFER]: _.gettext('Caller call transferred to a connected device')
};
const ONBOARDING_TOOLTIP = _.gettext('Click to call from Pipedrive');

module.exports = {
	DEFAULT_CALLTO_SYNTAX,
	CALLER_CALLTO_SYNTAX,
	ALLOWED_CALLING_SYNTAXES: [CALLER_CALLTO_SYNTAX, DEFAULT_CALLTO_SYNTAX],
	PHONE_NUMBER_TOOLTIP: quickCallTooltips[METHOD_INTEGRATION],
	SOURCE_QUICK_CALL,
	SOURCE_QUICK_CALL_PHONE_NUMBER,

	isAvailable: function() {
		return (
			User.companyFeatures &&
			(User.companyFeatures.get('salesphone_full') ||
				User.companyFeatures.get('apollo_best_billing'))
		);
	},

	isCaller11() {
		return User.companyFeatures && User.companyFeatures.get('caller_1.1');
	},

	isCaller12() {
		return User.companyFeatures && User.companyFeatures.get('caller_1.2');
	},

	getQuickCallMethod: function() {
		return _.get(User.settings.get('call_picker_options'), 'method') || METHOD_INTEGRATION;
	},

	getQuickCallButtonTooltip: function(method) {
		return quickCallTooltips[method] || ONBOARDING_TOOLTIP;
	},

	setCaller12OnboardingDone: function() {
		LocalStorage.setItem(CALLER12_ONBOARDING_DONE, true);
	},

	activityCreatedCallback: function(data) {
		app.global.fire(`activity.model.${data.id}.update`, new ActivityModel(data));
	},

	onLoadingChange: function(loading, quickCallButtonElement) {
		$(quickCallButtonElement).html(loading ? _.spinner('s') : _.icon('ac-call', 'small'));
	},

	createView: function({
		phoneNumber,
		dealId,
		personId,
		orgId,
		activityId,
		relatedModel,
		phoneFieldElement,
		phoneNumbersArray,
		customPhoneNumberData,
		createPhoneLink,
		clickedOnNumber,
		quickCallMethod,
		quickCallButtonElement,
		quickCallNumberElement,
		source
	}) {
		if (!module.exports.isAvailable()) {
			return;
		}

		const element = document.getElementById('sales-phone-dialler');

		return new SalesPhoneView({
			element,
			phoneNumber,
			dealId,
			personId,
			orgId,
			activityId,
			relatedModel,
			phoneFieldElement,
			phoneNumbersArray,
			customPhoneNumberData,
			createPhoneLink,
			clickedOnNumber,
			quickCallMethod,
			quickCallButtonElement,
			quickCallNumberElement,
			source,
			onLoadingChange: (loading) => this.onLoadingChange(loading, quickCallButtonElement),
			activityCreatedCallback: module.exports.activityCreatedCallback
		});
	}
};
