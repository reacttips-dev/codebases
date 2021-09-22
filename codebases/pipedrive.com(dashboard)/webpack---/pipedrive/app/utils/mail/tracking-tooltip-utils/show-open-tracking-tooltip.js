'use strict';

const EventsCollections = require('collections/mail/tracking-events');
const _ = require('lodash');
const Helpers = require('utils/helpers');
const ShowTrackingTooltip = require('./show-tracking-tooltip');
const trackingTooltipUtils = function(options) {
	this.options = options;
	this.$target = options.$target;
};

_.assignIn(trackingTooltipUtils.prototype, {
	showTooltip: function() {
		if (this.eventsCollection && !this.eventsCollection.pulling()) {
			ShowTrackingTooltip.showEventsTooltip(this.getEventsTooltipOpts());
		} else {
			this.showSpinnerTooltip();

			if (!this.eventsCollection) {
				const collectionsOpts = _.assignIn(
					{ eventType: 'message.opened' },
					this.options.collectionOpts
				);

				this.eventsCollection = new EventsCollections(null, collectionsOpts);

				this.eventsCollection.pull({
					success: this.onEventsPulled.bind(this)
				});
			}
		}
	},

	getEventsTooltipOpts: function() {
		return {
			$target: this.$target,
			eventModels: this.eventsCollection.models.slice(),
			getHeaderText: function(eventsCount) {
				return _.gettext(
					_.ngettext('Opened %d time', 'Opened %d times', eventsCount),
					eventsCount
				);
			},
			getShowMoreText: function(collapsedEventsCount) {
				return _.gettext(
					_.ngettext('%d more open', '%d more opens', collapsedEventsCount),
					collapsedEventsCount
				);
			}
		};
	},

	onEventsPulled: function() {
		ShowTrackingTooltip.showEventsTooltip(this.getEventsTooltipOpts());
	},

	showSpinnerTooltip: function() {
		const spinner = Helpers.spinner('s');
		const spinnerContHtml = `<div class="spinnerCont">${spinner}</div>`;

		this.$target.tooltip({
			tipHtml: spinnerContHtml,
			addClass: ['mailTrackingEvents'],
			position: 'bottom',
			showOnInit: true,
			removeOnClose: true,
			preDelay: 0,
			postDelay: 0
		});
	}
});

module.exports = trackingTooltipUtils;
