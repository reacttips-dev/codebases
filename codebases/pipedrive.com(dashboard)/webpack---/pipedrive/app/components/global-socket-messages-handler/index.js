const _ = require('lodash');

('use strict');

/**
 * A class that handles global socket messages.
 *
 * @class components/global-socket-message-handler/GlobalSocketMessagesHandler
 */
const GlobalSocketMessagesHandler = {
	initialize: function(SocketHandler) {
		SocketHandler.on('global.', this.handleMessage, this);
	},

	handleMessage: function(data) {
		const action = _.isObject(data) && _.isObject(data.meta) && data.meta.action;

		if (action && _.isFunction(this[action])) {
			this[action]();
		} else {
			throw new Error('Unknown global socket message action:', action);
		}
	},

	/**
	 * Global socket message with action "deploy" indicates that there was a new webapp frontend deployment
	 * and the app should be fully reloaded.
	 *
	 * @void
	 */
	deploy: function() {
		// Do prevent all the app page reloads from happening at the same time, we trigger it at a random time between
		// 1 second and 5 minutes.
		const min = 1000;
		const max = 300000;
		const time = Math.floor(Math.random() * (max - min + 1)) + min;

		window.setTimeout(function() {
			app.router.setFlag('pageReloadNeeded', true);
		}, time);
	}
};

module.exports = GlobalSocketMessagesHandler;
