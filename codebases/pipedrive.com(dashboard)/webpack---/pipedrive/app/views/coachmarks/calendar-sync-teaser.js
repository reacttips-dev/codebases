const _ = require('lodash');
const Pipedrive = require('pipedrive');
const template = require('templates/coachmarks/calendar-sync-teaser.html');
const CalendarSyncTeaserAnalytics = require('utils/analytics/calendar-sync-teaser-analytics');

module.exports = Pipedrive.View.extend({
	template: _.template(template),
	coachmark: null,

	initialize: function(params) {
		this.coachmark = params.coachmark;
		this.parentType = params.parentType;
		this.adjustContentLocation = params.adjustContentLocation;
		this.$el = params.coachmarkContainer;
		this.$el.on('click', '.calendarSyncTeaser__close', this.closeCoachMark.bind(this));
		this.$el.on('click', '.calendarSyncTeaser__link', this.clickOnTeaser.bind(this));
	},

	closeCoachMark: function() {
		this.coachmark.close();

		CalendarSyncTeaserAnalytics.trackCalendarSyncTeaserClosed();

		this.remove();
		this.adjustContentLocation();
	},

	clickOnTeaser: function() {
		CalendarSyncTeaserAnalytics.trackCalendarSyncTeaserClicked();
	},

	afterRender: function() {
		this.adjustContentLocation();
	},

	selfRender: function() {
		const t = this.template();

		this.$el.html(t);
	}
});
