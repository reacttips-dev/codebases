const Pipedrive = require('pipedrive');
const _ = require('lodash');

/**
 * Get href created by browser.
 * Used for creating proper hrefs, eg. https://www.pipedrive.com should semantically end with a slash https://www.pipedrive.com/
 * https://en.wikipedia.org/wiki/URL
 * @param {String} url - should start with protocol if external url is used
 */
function getUrl(url) {
	if (!url) {
		return url;
	}

	const el = document.createElement('a');

	el.href = url;

	return el.href;
}

module.exports = Pipedrive.Collection.extend({
	type: 'mailTrackingEvents',

	model: Pipedrive.Model,

	comparator: 'event_time',

	url: function() {
		if (this.messageId) {
			return `${app.config.api}/mailbox/mailMessage/mailTracking/${this.messageId}?event_type=${this.eventType}`;
		}

		if (this.threadId) {
			return `${app.config.api}/mailbox/mailTracking/${this.threadId}/lastTrackedMessage?event_type=${this.eventType}`;
		}
	},

	initialize: function(models, options) {
		if (options.messageId) {
			this.messageId = options.messageId;
		} else if (options.threadId) {
			this.threadId = options.threadId;
		}

		this.eventType = options.eventType;
		this.bindEvents();
	},

	bindEvents: function() {
		if (this.messageId) {
			app.global.bind('mailTracking.model.*.add', this.addEventModel, this);
		}
	},

	addEventModel: function(eventModel) {
		const messageIdMatch = eventModel.get('mail_message_id') === this.messageId;
		const eventTypeMatch = eventModel.get('event_type') === this.eventType;
		const alreadyInCollection = this.where({ id: eventModel.get('id') }).length > 0;

		if (messageIdMatch && eventTypeMatch && !alreadyInCollection) {
			this.add(eventModel);
		}
	},

	filterLinkClickEvents: function(url, index) {
		return this.filter((model) => {
			const originalUrl = _.get(model.get('event_type_data'), 'original_link');
			const urlIndex = parseInt(_.get(model.get('event_type_data'), 'link_index'), 10);

			return getUrl(originalUrl) === getUrl(url) && index === urlIndex;
		});
	}
});
