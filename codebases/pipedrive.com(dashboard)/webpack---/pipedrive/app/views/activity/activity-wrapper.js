const Pipedrive = require('pipedrive');
const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('lodash');
const $ = require('jquery');
const Logger = require('@pipedrive/logger-fe').default;
const activityWrapperTemplate = require('../../templates/activity/activity-wrapper.html');
const iamClient = require('utils/support/iam');
const CalendarSyncTeaser = require('views/coachmarks/calendar-sync-teaser');
const CalendarSyncUtils = require('utils/calendar-sync-utils');
const { addFlowCoachmark } = require('utils/support/interface-tour');
const componentLoader = require('webapp-component-loader');

const logger = new Logger('activity-wrapper');

const ActivityWrapperView = Pipedrive.View.extend({
	template: _.template(activityWrapperTemplate),

	stackable: true,

	initialize: function(options) {
		this.options = options || {};
		this.options.el = null;

		this.render();
		this.initActivityView();
		this.initCalendarSyncTeaser();

		addFlowCoachmark('closedeals_activity_add');

		return this;
	},

	templateHelpers: function() {
		return {};
	},

	initActivityView: async function() {
		const ActivityGlobalMessages = await componentLoader.load(
			'activities-components:activity-global-messages'
		);

		ReactDOM.render(<ActivityGlobalMessages />, this.$el.find('.activityNoticeBar')[0]);

		const ActivityView = this.options.activityView;

		this.activitySubView = new ActivityView(this.options);
		this.onBlur = this.activitySubView.onBlur.bind(this.activitySubView);
		this.addView('.activityPageWrapper__pageContent', this.activitySubView);

		this.onWindow('resize', _.throttle(this.adjustContentLocation.bind(this), 500));
	},

	initCalendarSyncTeaser: async function() {
		if (!CalendarSyncUtils.hasNylasOrFastisCalendarSyncEnabled()) {
			return;
		}

		try {
			const hasHadActiveCalendarSync = await CalendarSyncUtils.hasHadActiveCalendarSync();

			if (!hasHadActiveCalendarSync) {
				this.renderCalendarSyncTeaser();
			}
		} catch (e) {
			logger.logError(
				e,
				'Was not able to check if calendar sync had ever been activated',
				'warning'
			);
		}
	},

	renderCalendarSyncTeaser: function() {
		iamClient.initialize(() => {
			iamClient.addCoachmark(
				iamClient.coachmarks.CALENDAR_SYNC_TEASER,
				{
					view: CalendarSyncTeaser,
					coachmarkContainer: $('.calendarSyncTeaser'),
					adjustContentLocation: this.adjustContentLocation.bind(this)
				},
				{
					reset: true
				}
			);
		});
	},

	/* Firefox doesn't tolerate 'position: relative' while scrolling very wide lists, hence 'position: absolute' is used,
    and the styles are adjusted here in case of calendar authentication error warning: */
	adjustContentLocation: function() {
		const noticeHeight = this.$el.find('.activityNoticeBar').outerHeight();
		const teaserHeight = this.$el.find('.calendarSyncTeaser').outerHeight();

		$('.activityPageWrapper__pageContent').css({
			top: `${noticeHeight + teaserHeight}px`,
			height: `calc(100% - ${noticeHeight + teaserHeight}px)`
		});
	}
});

module.exports = ActivityWrapperView;
