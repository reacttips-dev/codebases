const request = require('@pipedrive/fetch');
const _ = require('lodash');
const ActivityModel = require('models/activity');

const pageTriggers = {
	RouteChange: {
		deal_details_opened: {
			route: /^deal$/,
			urlPath: /deal/
		},
		lost_deals_report_opened: {
			path: /insights/,
			previousPath: /progress\/insights\/report\/new\/stats_last_two_weeks_lost/
		},
		won_deals_report_opened: {
			path: /insights/,
			previousPath: /progress\/insights\/report\/new\/stats_last_two_weeks_won/
		},
		invites_opened: {
			route: /^settings$/,
			urlPath: /settings\/invite/
		},
		settings_opened: {
			route: /^settings$/
		},
		settings_email_sync: {
			path: /settings\/email-sync$/
		},
		settings_automation: {
			path: /settings\/automation$/
		},
		settings_teams: {
			path: /settings\/teams$/
		},
		settings_visibility_groups: {
			path: /settings\/visibility-groups$/
		},
		mail_tab_opened: {
			route: /^mail$/
		},
		mail_tab_closed: {
			lastRoute: /^mail$/
		},
		pipeline_opened: {
			route: /^pipeline$/
		},
		contacts_person_opened: {
			route: /^persons$/,
			urlPath: /list/
		},
		contacts_organization_opened: {
			route: /^organizations$/,
			urlPath: /list/
		}
	},
	ModalOpen: {
		deal_add_modal_opened: { route: /^deal\/add$/ },
		person_add_modal_opened: { route: /^person\/add$/ },
		organizations_add_modal_opened: { route: /^organization\/add$/ }
	}
};

const usageTriggers = {
	deal_added_no_shortcuts: {
		component_code: 'deal',
		action_code: 'added',
		source: 'add-deal',
		view_code: /^deal_pipeline_view$|^deal_list_view$|^deal_forecast_view$/
	},

	deal_added_with_shortcuts: {
		component_code: 'deal',
		action_code: 'added',
		source: 'quick-add-shortcuts'
	},

	deal_added_with_activity_type_email: {
		component_code: 'deal',
		action_code: 'added',
		customCheck: (eventData) => eventData.activity_type === 'email'
	},

	person_added_no_shortcuts: {
		component_code: 'person',
		action_code: 'added',
		source: 'add-person',
		view_code: 'person_list_view'
	},

	person_added_with_shortcuts: {
		component_code: 'person',
		action_code: 'added',
		source: 'quick-add-shortcuts'
	},

	organization_added_no_shortcuts: {
		component_code: 'organization',
		action_code: 'added',
		source: 'add-organization',
		view_code: 'organization_list_view'
	},

	organization_added_with_shortcuts: {
		component_code: 'organization',
		action_code: 'added',
		source: 'quick-add-shortcuts'
	},

	activity_added_no_shortcuts: {
		component_code: 'activity',
		action_code: 'added',
		source: 'add-activity',
		view_code: 'activity_list_view'
	},

	activity_added_with_shortcuts: {
		component_code: 'activity',
		action_code: 'added',
		source: 'quick-add-shortcuts'
	},

	shortcuts_help_opened: {
		component_code: 'quick-add-shortcuts',
		action_code: 'keyboard-shortcut',
		keyUsed: 'help'
	},

	deals_list_view_opened: {
		component_code: 'deal_list',
		view_code: 'deal_list_view',
		action_code: 'opened',
		customCheck: (eventData) => eventData.deal_count >= 100
	},

	activities_list_view_opened: {
		component_code: 'activity_list',
		view_code: 'activity_list_view',
		action_code: 'opened',
		customCheck: (eventData) => eventData.activity_count >= 100
	},

	persons_list_view_opened: {
		component_code: 'person_list',
		view_code: 'person_list_view',
		action_code: 'opened',
		customCheck: (eventData) => eventData.person_count >= 100
	},

	organizations_list_view_opened: {
		component_code: 'organization_list',
		view_code: 'organization_list_view',
		action_code: 'opened',
		customCheck: (eventData) => eventData.organization_count >= 100
	},

	products_list_view_opened: {
		component_code: 'product_list',
		view_code: 'products_list_view',
		action_code: 'opened',
		customCheck: (eventData) => eventData.product_count >= 100
	},

	deal_with_meeting_starting_within_24h_opened: {
		component_code: 'deal_details',
		view_code: 'deal_detail_view',
		action_code: 'opened',
		customCheck: (eventData) => eventData.has_meeting_starting_within_24h
	},

	activity_opened: {
		component_code: /^activity$/g,
		action_code: 'opened'
	},

	meeting_starting_within_24h_opened: {
		component_code: /^activity$/g,
		action_code: 'opened',
		customCheck: (eventData) => {
			if (eventData.activity_type !== 'meeting') {
				return false;
			}

			const activity = new ActivityModel(eventData);

			return !!(activity.isStartingWithin24h && activity.isStartingWithin24h());
		}
	}
};

function isTriggered(eventData, conditions) {
	// eslint-disable-next-line no-unused-vars
	for (const field in conditions) {
		if (!conditions.hasOwnProperty(field) || field === 'customCheck') {
			continue;
		}

		if (_.isUndefined(eventData[field])) {
			return false;
		}

		if (eventData[field].match(conditions[field]) === null) {
			return false;
		}
	}

	if (conditions.customCheck && !conditions.customCheck(eventData)) {
		return false;
	}

	return true;
}

function findTriggers(triggers, eventData) {
	return _.filter(_.toPairs(triggers), ([, trigger]) =>
		isTriggered(eventData, trigger)
	).map(([triggerKey]) => ({ triggerType: triggerKey }));
}

exports.postPageEventTrigger = function(eventName, eventData) {
	if (eventName === 'route_change') {
		eventName = 'RouteChange';
	}

	const triggers = findTriggers(pageTriggers[eventName], eventData);

	if (triggers && triggers.length > 0) {
		request.post('/proactive-cards-service/api/v1/triggers', triggers);
	}
};

exports.postUsageEventTrigger = function(eventName, eventData) {
	const triggers = findTriggers(usageTriggers, eventData);

	if (triggers && triggers.length > 0) {
		request.post('/proactive-cards-service/api/v1/triggers', triggers);
	}
};
