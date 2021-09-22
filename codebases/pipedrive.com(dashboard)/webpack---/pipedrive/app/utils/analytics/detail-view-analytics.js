const ActivityModel = require('models/activity');
const User = require('models/user');
const moment = require('moment');
const PDMetrics = require('utils/pd-metrics');
const { MentionsPlugin } = require('@pipedrive/pd-wysiwyg');

function getItemDuration(itemAddTime) {
	const addTime = moment(itemAddTime, 'YYYY-MM-DD');
	const today = moment.utc().startOf('day');

	return Math.floor(moment.duration(today.diff(addTime)).asDays());
}

function getDetailViewEventMetricsData(model) {
	const type = model.type;
	const addTime = model.get('add_time');
	const baseMetrics = {
		open_deal_count: model.get('open_deals_count'),
		closed_deal_count: model.get('closed_deals_count'),
		activity_count: model.get('activities_count'),
		note_count: model.get('notes_count'),
		email_count: model.get('email_messages_count'),
		file_count: model.get('files_count'),
		self_owned: model.get('owner_id') === User.get('id'),
		done_activity_count: model.get('done_activities_count'),
		planned_activity_count: model.get('undone_activities_count'),
		is_deleted: !model.get('active_flag'),
		is_label_applied: !!model.get('label')
	};

	if (type === 'person') {
		return {
			...baseMetrics,
			person_id: model ? parseInt(model.id, 10) : null,
			is_organization_linked: !!model.get('org_id'),
			person_age_days: getItemDuration(addTime)
		};
	} else if (type === 'organization') {
		return {
			...baseMetrics,
			org_id: model ? parseInt(model.id, 10) : null,
			linked_person_count: model.get('people_count'),
			org_age_days: getItemDuration(addTime)
		};
	}

	return {};
}

module.exports = {
	trackDetailViewEvent: function(component, action, model, extraData = {}) {
		const detailViewEventMetricsData = getDetailViewEventMetricsData(model);

		PDMetrics.trackUsage(null, component, action, {
			...detailViewEventMetricsData,
			...extraData
		});
	},

	/**
	 * This method is used to determine whether a deal has a meeting starting in the next 24 hours.
	 *
	 * This is used for a proactive frontend trigger: deal_with_meeting_starting_within_24h_opened
	 *
	 * see more: https://pipedrive.atlassian.net/browse/MISS-290
	 */
	hasMeetingWithin24h: (flowItems) => {
		return flowItems.some((flowItem) => {
			if (flowItem.get('object') !== 'activity' || !flowItem.get('data')) {
				return false;
			}

			const activity = new ActivityModel(flowItem.get('data'));

			return activity.get('type') === 'meeting' && activity.isStartingWithin24h();
		});
	},

	isSelfMentionedVisible: (flowItems = [], pinnedNotes = []) => {
		return [...flowItems, ...pinnedNotes].some((model) => {
			const userIds = [];

			// Pinned Notes
			if (model.get('content')) {
				const { mentionings } = MentionsPlugin.getMentions(model.get('content'));
				const mentionedUserIds = mentionings.map((obj) => obj.to);

				userIds.push(...mentionedUserIds);
			}

			// Flow Item for note
			if (model.get('object') === 'note') {
				const note = model.get('data');
				const { mentionings } = MentionsPlugin.getMentions(note.content);
				const mentionedUserIds = mentionings.map((obj) => obj.to);

				userIds.push(...mentionedUserIds);
			}

			return userIds.includes(User.get('id'));
		});
	},

	isFromNotications: () => {
		const urlParams = new URLSearchParams(window.location.search);
		const objectType = urlParams.get('objectType');
		const comment = urlParams.get('comment');

		if (comment && objectType) {
			return [objectType, 'comment'];
		}

		return [objectType];
	},

	trackDealDetailViewEvent: function(component, action, model, extraData) {
		const addTime = model.get('add_time');

		const metricsData = {
			deal_id: model ? parseInt(model.id, 10) : null,
			stage_id: model.get('stage_id'),
			pipeline_id: model.get('pipeline_id'),
			deal_age_days: getItemDuration(addTime),
			deal_status: model.get('status'),
			is_person_linked: !!model.get('person_id'),
			is_organization_linked: !!model.get('org_id'),
			is_self_owned: model.get('creator_user_id') === User.get('id'),
			is_rotten: !!model.get('rotten_time'),
			is_probability_set: !!model.get('probability'),
			is_expected_close_date_filled: !!model.get('expected_close_date'),
			done_activity_count: model.get('done_activities_count'),
			planned_activity_count: model.get('undone_activities_count'),
			note_count: model.get('notes_count'),
			email_count: model.get('email_messages_count'),
			file_count: model.get('files_count'),
			product_count: model.get('products_count'),
			value: model.get('value'),
			currency: model.get('currency'),
			// see hasMeetingWithin24h above
			has_meeting_starting_within_24h: false,
			...extraData
		};

		PDMetrics.trackUsage(null, component, action, metricsData);
	}
};
