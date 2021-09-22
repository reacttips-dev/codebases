const _ = require('lodash');
const User = require('models/user');
const $ = require('jquery');
const Logger = require('@pipedrive/logger-fe').default;
const customFieldsModalHandler = require('./coachmarks/custom-fields-modal');
const gettingStartedV2Handler = require('./coachmarks/getting-started-v2');
const addMenuItemNotification = require('./coachmarks/add-menu-item-notification');
const addInsightsMessage = require('./coachmarks/insights-message');
const calendarSyncTeaser = require('./coachmarks/calendar-sync-teaser');
const { mailSettingsButton } = require('./coachmarks/email-sender-name');
const {
	sendCampaignButton,
	editMarketingColumn,
	bulkEditMarketingStatus
} = require('./coachmarks/marketing');
const { scheduleMailDropdown } = require('./coachmarks/schedule-mail-dropdown');
const { notesComposer, wysiwyg, commentsButton } = require('./coachmarks/mentions');
const componentLoader = require('webapp-component-loader');
const logger = new Logger(`webapp.${app.ENV}`, 'iam');
const internal = {};

internal.ready = $.Deferred();
internal.coachmarks = {
	ACTIVITY_LOOP_SINGLE_DEAL_ACTIVITY: 'emnt_activityLoop1.1_singleDealActivityIcon',
	ACTIVITY_LOOP_DEAL_WON_LOST_OR_DELETED: 'emnt_activityLoop1.1_dealWonLostOrDeleted',
	ACTIVITY_INVITES_SEND_NOTIFICATIONS: 'activity_invites_coachmark',
	ADD_DEAL_PROBABILITY_DETAILVIEW_COUCHMARK: 'red_dealProbability_dealDetailViewCouchMark',
	GETTING_STARTED_V2_TOGGLE_BUTTON: 'emnt_gettingStartedV2_toggleButton',
	CUSTOM_FIELDS_POPOVER: 'emnt_customFields_listViewChooseColumns',
	NO_EXPECTED_CLOSE_DATE_PROMPT: 'scarlet_deal_no_expected_close_date',
	GETTING_STARTED_CLOSED: 'emnt_gettingStartedV2_closedCoachMark',
	INVOICE_CREATE_NEW: 'tagus_invoiceCreateNew',
	NEW_DOCUMENTS_TAB: 'tagus_new_documents_tab',
	SMART_DOCS_NEW_FEATURE: 'tagus_smart_docs_new_feature',
	SALES_PHONE_CAPABILITY: 'space_sales_phone_capability',
	INSIGHTS_FEATURE_NOTIFICATION: 'scarlet_insights_notification',
	INSIGHTS_FEATURE_COACHMARK: 'scarlet_insights_coachmark',
	INSIGHTS_FEATURE_MESSAGE_MODAL: 'scarlet_insights_message_modal',
	SEARCH_FILTER_NARROW_RESULTS: 'search_filter_narrow_results_coachMark',
	CALENDAR_SYNC_TEASER: 'calendar_sync_promo_activity_list_and_calendar',
	MENTIONS_NOTES_COMPOSER: 'mentions_notes_composer',
	MENTIONS_WYSIWYG: 'mentions_wysiwyg',
	MENTIONS_COMMENTS_BUTTON: 'mentions_comments_button',
	EMAIL_SENDER_NAME_FIELD: 'email_sender_name_field',
	PROMOTE_MARKETING_CAMPAIGN: 'promote_marketing_campaign',
	PROMOTE_MARKETING_COLUMN_EDIT: 'promote_marketing_column_edit',
	PROMOTE_MARKETING_BULK_EDIT: 'promote_marketing_bulk_edit',
	SCHEDULE_EMAIL: 'schedule_email'
};

internal.coachmarksInstances = {};

/**
 * Initialize In-App Messaging client
 * @param {function} cb - a callback that will be run after IAM script is fetched
 */
internal.initialize = function(cb) {
	componentLoader
		.load('iam-client')
		.then((API) => {
			internal.API = API;
			internal.ready.resolve(API);

			if (cb) {
				return cb(API);
			}
		})
		.catch((err) => {
			logger.remote('error', 'Could not initialize iamClient', {
				stack: err.stack,
				cb: cb?.toString?.() ?? cb
			});
		});
};

const coachmarksHandlers = {};

internal.removeCoachmark = function(tag) {
	let instance = internal.coachmarksInstances[tag];

	if (instance && instance.remove) {
		instance.remove();
		instance = null;
	}
};

internal.closeCoachmark = function(tag) {
	let instance = internal.coachmarksInstances[tag];

	if (instance && instance.close) {
		instance.close();
		instance = null;
	}
};

internal.hideCoachmark = function(tag) {
	const instance = internal.coachmarksInstances[tag];

	if (instance && instance.unqueue) {
		instance.unqueue();
	}
};

internal.addCoachmark = function(tag, params, options) {
	return internal.ready.then((API) => {
		if (options && options.reset === true) {
			internal.removeCoachmark(tag);
		}

		const coachmark = coachmarksHandlers[tag](API, params, tag, options);

		internal.coachmarksInstances[tag] = coachmark;

		return coachmark;
	});
};

internal.hideAllCoachmarks = function() {
	if (internal.API) {
		internal.API.clearCoachmarksQueue();
	}
};

coachmarksHandlers[internal.coachmarks.ACTIVITY_LOOP_SINGLE_DEAL_ACTIVITY] = function(API, params) {
	const $icon = params.dealTile.$el.find('.icon');
	const activityCoachmark = new API.Coachmark({
		tag: internal.coachmarks.ACTIVITY_LOOP_SINGLE_DEAL_ACTIVITY,
		parent: $icon[0],
		content: _.gettext('Great start! Click on the icon to schedule a follow-up activity.'),
		appearance: {
			placement: 'bottom',
			zIndex: {
				above: '#pipelineContainer'
			}
		},
		onReady: function() {
			params.dealTile.$el.one('touchstart mousedown', () => {
				activityCoachmark && activityCoachmark.close();
			});
		},
		actions: [
			{
				label: _.gettext('Got it'),
				handler: function() {
					activityCoachmark.close();
				}
			}
		],
		detached: true
	});

	return activityCoachmark;
};

coachmarksHandlers[internal.coachmarks.ADD_DEAL_PROBABILITY_DETAILVIEW_COUCHMARK] = function(
	API,
	params
) {
	const setDealProbabilityDetailViewCoachmark = new API.Coachmark({
		tag: internal.coachmarks.ADD_DEAL_PROBABILITY_DETAILVIEW_COUCHMARK,
		parent: params.coachmarkPlaceholder[0],
		content: _.gettext('You can set a probability for the deal from here'),
		appearance: 'bottomLeft',
		onReady: function() {
			params.coachmarkPlaceholder.find('.iamClient__Coachmark').on('click', (event) => {
				setDealProbabilityDetailViewCoachmark.close();
				event.stopPropagation();
			});
		}
	});

	return setDealProbabilityDetailViewCoachmark;
};

coachmarksHandlers[internal.coachmarks.ACTIVITY_LOOP_DEAL_WON_LOST_OR_DELETED] = function(
	API,
	params
) {
	const dealWonLostOrDeletedCoachmark = new API.Coachmark({
		tag: internal.coachmarks.ACTIVITY_LOOP_DEAL_WON_LOST_OR_DELETED,
		parent: params.coachmarkPlaceholder,
		content: _.gettext('You can access won, lost and deleted deals through filters.'),
		appearance: 'bottomLeft',
		onReady: function() {
			params.$filterButton.one('click', () => {
				dealWonLostOrDeletedCoachmark && dealWonLostOrDeletedCoachmark.close();
			});
		},
		actions: [
			{
				label: _.gettext('Got it'),
				handler: function() {
					dealWonLostOrDeletedCoachmark.close();
				}
			}
		]
	});

	return dealWonLostOrDeletedCoachmark;
};

coachmarksHandlers[internal.coachmarks.ACTIVITY_INVITES_SEND_NOTIFICATIONS] = function(
	API,
	params
) {
	const sendNotificationsCoachmark = new API.Coachmark({
		tag: internal.coachmarks.ACTIVITY_INVITES_SEND_NOTIFICATIONS,
		parent: params.checkboxParent,
		content: _.gettext('New! Try activity invites'),
		appearance: 'topRight',
		onReady: function() {
			params.$checkbox.one('click', () => {
				sendNotificationsCoachmark && sendNotificationsCoachmark.close();
			});
		}
	});

	return sendNotificationsCoachmark;
};

coachmarksHandlers[internal.coachmarks.INVOICE_CREATE_NEW] = function(API, params) {
	const createInvoiceCoachmark = new API.Coachmark({
		tag: internal.coachmarks.INVOICE_CREATE_NEW,
		parent: params.coachmarkPlaceholder[0],
		content: _.gettext('Create your invoices here!'),
		appearance: 'top',
		onReady: function() {
			params.coachmarkPlaceholder.one('click', () => {
				createInvoiceCoachmark.close();
			});
		}
	});

	return createInvoiceCoachmark;
};

coachmarksHandlers[internal.coachmarks.NEW_DOCUMENTS_TAB] = function(API, params) {
	const createDocumentCoachmark = new API.Coachmark({
		tag: internal.coachmarks.NEW_DOCUMENTS_TAB,
		parent: params.coachmarkPlaceholder[0],
		appearance: {
			placement: 'top',
			width: 250,
			zIndex: 10
		},
		content: _.gettext(
			'Make light work of quotes, proposals and contracts, so you can close deals faster'
		),
		onReady: function() {
			params.coachmarkPlaceholder.one('click', () => {
				createDocumentCoachmark.close();
			});
		}
	});

	return createDocumentCoachmark;
};

coachmarksHandlers[internal.coachmarks.SMART_DOCS_NEW_FEATURE] = function(API, params) {
	const newFeatureCoachmark = new API.Coachmark({
		tag: internal.coachmarks.SMART_DOCS_NEW_FEATURE,
		parent: params.coachmarkPlaceholder[0],
		appearance: {
			placement: 'bottom',
			width: 315,
			zIndex: 10
		},
		content: _.gettext(
			'Upload PDFs directly from your device, or connect Google Drive, Microsoft OneDrive, or SharePoint. Share and sign documents using Smart Docs.'
		),
		onReady: function() {
			params.coachmarkPlaceholder.one('click', () => {
				newFeatureCoachmark.close();
			});
		}
	});

	return newFeatureCoachmark;
};

coachmarksHandlers[internal.coachmarks.GETTING_STARTED_CLOSED] = function(API) {
	return new API.Coachmark({
		tag: internal.coachmarks.GETTING_STARTED_CLOSED,
		parent: document.getElementsByClassName('contextSupport')[0],
		content: _.gettext('You can re-open the guide and find more help here.'),
		appearance: {
			placement: 'bottomLeft',
			zIndex: {
				above: 'nav'
			}
		}
	});
};

coachmarksHandlers[internal.coachmarks.NO_EXPECTED_CLOSE_DATE_PROMPT] = function(API, params) {
	return new API.Coachmark({
		tag: internal.coachmarks.NO_EXPECTED_CLOSE_DATE_PROMPT,
		parent: params.coachmarkPlaceholder[0],
		content: _.gettext(
			'Drag a deal into a time slot on the right side to set its expected close date'
		),
		appearance: {
			placement: 'right'
		}
	});
};

coachmarksHandlers[internal.coachmarks.SEARCH_FILTER_NARROW_RESULTS] = function(API, params) {
	return new API.Coachmark({
		tag: internal.coachmarks.SEARCH_FILTER_NARROW_RESULTS,
		parent: params,
		content: _.gettext('Try filters to narrow the results'),
		appearance: 'right',
		detached: true
	});
};

coachmarksHandlers[internal.coachmarks.SALES_PHONE_CAPABILITY] = function(API, params) {
	const salesPhoneCoachmark = new API.Coachmark({
		tag: internal.coachmarks.SALES_PHONE_CAPABILITY,
		parent: params,
		content: _.gettext('Less clicking, more closing! Try out Pipedrive in-app calling.'),
		appearance: {
			placement: 'topRight',
			zIndex: {
				min: 7
			}
		},
		actions: [
			{
				label: _.gettext('Got it'),
				handler: () => {
					salesPhoneCoachmark.close();
				}
			}
		]
	});

	return salesPhoneCoachmark;
};

coachmarksHandlers[internal.coachmarks.INSIGHTS_FEATURE_COACHMARK] = function(API, parentEl) {
	const insightsFeatureEnabled = User.companyFeatures.get('insights');

	if (!insightsFeatureEnabled) {
		return;
	}

	const insightsCoachmark = new API.Coachmark({
		tag: internal.coachmarks.INSIGHTS_FEATURE_COACHMARK,
		parent: parentEl[0],
		content: _.gettext(
			'Discover customizable reports to have a full overview of your progress'
		),
		appearance: {
			placement: 'right'
		},
		actions: [
			{
				label: _.gettext('Read more'),
				handler: () => {
					window.open(
						'https://support.pipedrive.com/hc/en-us/articles/360001930658-Insights-feature'
					);
					insightsCoachmark.close();
				}
			},
			{
				label: _.gettext('Got it'),
				handler: () => {
					insightsCoachmark.close();
				}
			}
		],
		onReady: function() {
			parentEl.one('click', () => {
				insightsCoachmark.close();
			});
		}
	});

	return insightsCoachmark;
};

coachmarksHandlers[internal.coachmarks.CUSTOM_FIELDS_POPOVER] = customFieldsModalHandler;

coachmarksHandlers[internal.coachmarks.GETTING_STARTED_V2_TOGGLE_BUTTON] = gettingStartedV2Handler;

coachmarksHandlers[internal.coachmarks.INSIGHTS_FEATURE_NOTIFICATION] = addMenuItemNotification;

coachmarksHandlers[internal.coachmarks.INSIGHTS_FEATURE_MESSAGE_MODAL] = addInsightsMessage;

coachmarksHandlers[internal.coachmarks.CALENDAR_SYNC_TEASER] = calendarSyncTeaser;

coachmarksHandlers[internal.coachmarks.MENTIONS_NOTES_COMPOSER] = notesComposer;

coachmarksHandlers[internal.coachmarks.MENTIONS_WYSIWYG] = wysiwyg;

coachmarksHandlers[internal.coachmarks.MENTIONS_COMMENTS_BUTTON] = commentsButton;

coachmarksHandlers[internal.coachmarks.EMAIL_SENDER_NAME_FIELD] = mailSettingsButton;

coachmarksHandlers[internal.coachmarks.PROMOTE_MARKETING_CAMPAIGN] = sendCampaignButton;
coachmarksHandlers[internal.coachmarks.PROMOTE_MARKETING_COLUMN_EDIT] = editMarketingColumn;
coachmarksHandlers[internal.coachmarks.PROMOTE_MARKETING_BULK_EDIT] = bulkEditMarketingStatus;

coachmarksHandlers[internal.coachmarks.SCHEDULE_EMAIL] = scheduleMailDropdown;

module.exports = internal;
