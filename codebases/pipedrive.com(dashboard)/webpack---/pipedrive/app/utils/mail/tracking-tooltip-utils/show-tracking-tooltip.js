'use strict';

const moment = require('moment');
const _ = require('lodash');

module.exports = {
	showEventsTooltip: function(options) {
		const eventsCount = options.eventModels.length;
		const maxEventsToShow = 10;

		if (eventsCount <= maxEventsToShow) {
			this.showTooltipRegular(options);
		} else {
			this.showTooltipWithCollapsed(options);
		}
	},

	createTooltipHeaderHtml: function(options) {
		const eventsCount = options.eventModels.length;

		return `<div class="tooltipHeaderText">${options.getHeaderText(eventsCount)}</div>`;
	},

	createEventRow: function(eventModel) {
		const eventTimeLocal = moment.utc(eventModel.get('event_time')).local();

		return `<div class="eventRow">${eventTimeLocal.format('LLL')}</div>`;
	},

	showTooltipRegular: function(options) {
		const eventsCount = options.eventModels.length;

		let tipHtml = this.createTooltipHeaderHtml(options);

		for (let i = eventsCount; i > 0; i--) {
			tipHtml += this.createEventRow(options.eventModels[i - 1]);
		}

		options.$target.tooltip({
			tipHtml,
			addClass: ['mailTrackingEvents'],
			position: this.getTooltipPosition(options),
			showOnInit: true,
			removeOnClose: true,
			preDelay: 0,
			postDelay: 0
		});
	},

	showTooltipWithCollapsed: function(options) {
		const maxEventsToShow = 8;
		const eventsInDescOrder = options.eventModels.reverse();

		let tipHtml = this.createTooltipHeaderHtml(options);

		for (let i = 0; i < maxEventsToShow; i++) {
			tipHtml += this.createEventRow(eventsInDescOrder[i]);
		}

		const eventsToCollapse = options.eventModels.length - maxEventsToShow - 1;
		const hiddenEventsText = options.getShowMoreText(eventsToCollapse);

		tipHtml += `<div class="moreEvents">${hiddenEventsText}</div>`;

		const lastModel = eventsInDescOrder[eventsInDescOrder.length - 1];

		tipHtml += this.createEventRow(lastModel);

		options.$target.tooltip({
			tipHtml,
			addClass: ['mailTrackingEvents'],
			position: this.getTooltipPosition(options),
			showOnInit: true,
			removeOnClose: true,
			preDelay: 0,
			postDelay: 0,
			onShow: this.bindShowMoreClick.bind(this, eventsInDescOrder)
		});
	},

	getTooltipPosition: function(options) {
		const eventsCount = options.eventModels.length;

		let position = 'bottom';
		let tooltipHeight;

		const heightUnderTarget = window.innerHeight - options.$target.offset().top - 20;

		if (eventsCount <= 10) {
			tooltipHeight = eventsCount * 16 + 32;
		} else {
			tooltipHeight = 188;
		}

		if (heightUnderTarget < tooltipHeight + 16) {
			position = 'top';
		}

		return position;
	},

	bindShowMoreClick: function(eventModels, $tooltip) {
		const firstVisibleEventsCount = 8;
		const collapsedEventsCount = eventModels.length - firstVisibleEventsCount - 1;
		const collapsedEvents = eventModels.slice(
			firstVisibleEventsCount,
			firstVisibleEventsCount + collapsedEventsCount
		);

		let tipHtml = '';

		_.forEach(
			collapsedEvents,
			function(eventModel) {
				tipHtml += this.createEventRow(eventModel);
			}.bind(this)
		);

		const $moreEventsEl = $tooltip.find('.moreEvents');

		$moreEventsEl.on('click', function() {
			$moreEventsEl.replaceWith(tipHtml);
		});
	}
};
