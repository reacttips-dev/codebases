const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const l10n = require('l10n');
const $ = require('jquery');
const logger = new Pipedrive.Logger('notification');
const notificationHideTimeout = 4000;
const NotificationStack = (function() {
	const messageQueue = [];
	const messageStack = {};
	const messageTimeout = notificationHideTimeout;
	const maxMessages = 3;
	const stackContainer = $('<div class="globalNotificationsContainer">').appendTo('body');
	/* eslint-disable no-use-before-define */
	const removeItemFromStack = function(item) {
		if (messageStack[item.cid]) {
			delete messageStack[item.cid];
		} else {
			const i = _.indexOf(messageQueue, item);

			messageQueue.splice(i, 1);
		}

		showNext();
	};
	const removeItem = function(item, hasTimedOut) {
		if (hasTimedOut) {
			item.$el.animate(
				{
					marginBottom: `${-item.$el.outerHeight()}px`
				},
				100
			);
		}

		if (item.blocker) {
			stackContainer.find('.blockerBackdrop').fadeOut(function() {
				$(this).remove();
			});
		}

		// If message was not displayed yet, but was removed
		if (!messageStack[item.cid]) {
			removeItemFromStack(item);
		}

		item.destroy();
	};
	const showNext = function() {
		// Do not display message when on screen stack is full
		if (_.keys(messageStack).length >= maxMessages || messageQueue.length === 0) {
			return;
		}

		const item = messageQueue.shift();

		messageStack[item.cid] = item;

		item.on('destroy', removeItemFromStack);
		item.$el.prependTo(stackContainer);

		// If alert is blocker (for example switch company alert), create a backdrop
		if (item.blocker && !stackContainer.find('.blockerBackdrop').length) {
			const $blocker = $('<div class="blockerBackdrop">').insertBefore(item.$el);

			item.$el.css('zIndex', $blocker.css('zIndex') + 1);
		}

		item.show();

		if (!item.permanent) {
			item.timer = setTimeout(() => {
				removeItem(item, true);
			}, messageTimeout);
		}
	};
	/* eslint-enable no-use-before-define */
	const findItem = (itemKey) => {
		// Check if message is in queue
		let item = _.filter(messageQueue, (message) => {
			return (
				message.model &&
				message.model.get('_meta') &&
				message.model.get('_meta').routingKey === itemKey
			);
		});

		if (item.length === 1) {
			return item[0];
		}

		// Check if message is on screen
		item = _.filter(messageStack, (message) => {
			return (
				message.model &&
				message.model.get('_meta') &&
				message.model.get('_meta').routingKey === itemKey
			);
		});

		return item.length === 1 ? item[0] : false;
	};
	const resetTimer = function(item) {
		if (item.timer) {
			clearTimeout(item.timer);
		}

		if (!item.permanent && messageStack[item.cid]) {
			item.timer = setTimeout(() => {
				removeItem(item, true);
			}, messageTimeout);
		}
	};

	return {
		push: function(item) {
			messageQueue.push(item);
			showNext();
		},
		remove: function(item) {
			removeItem(item);
		},
		findItem: function(itemKey) {
			return findItem(itemKey);
		},
		resetTimer: function(item) {
			resetTimer(item);
		}
	};
})();
const NotificationView = Pipedrive.View.extend({
	tagName: 'div',
	className: 'globalNotification',
	clickable: false,
	stickyTemplate: _.template(
		'<div style="text-align: center"><%= message %><br /><%= ok %></div>'
	),

	events: {
		click: 'clicked'
	},

	initialize: function() {
		// check for notifications support
		// you can omit the 'window' keyword
		if ('Notification' in window) {
			if (window.Notification.permission === 'granted') {
				// 0 is PERMISSION_ALLOWED
				this.nativeNotifications = true;
				logger.log('Use native notification');
			}
		}
	},

	/* eslint-disable complexity */
	render: function(existing) {
		const self = this;

		let message = this.model.get('message');
		let templateData;
		let nativeDisabled;

		if (message === false) {
			return NotificationStack.remove(this);
		}

		// Show message if other user has updated currently viewed/edited filter
		if (
			this.model.get('alert_action') === 'updated' &&
			this.model.get('alert_type') === 'filter' &&
			Number(this.model.get('_meta').user_id) !== User.id
		) {
			const currentUrl = location.href;
			const currentUrlArray = currentUrl.split('/');

			let currentFilterEdit = false;
			let currentFilter;
			let currentFilterId;

			for (let i = 0; i < currentUrlArray.length; i++) {
				if (currentUrlArray[i] === 'filter') {
					currentFilter = currentUrlArray[i];
					currentFilterId = currentUrlArray[i + 1];
					currentFilterEdit = currentUrlArray[i + 2] === 'edit' ? true : false;
				}
			}

			if (
				currentFilter === 'filter' &&
				Number(currentFilterId) === this.model.get('_meta').id
			) {
				logger.log('Preparing filter sticky');
				templateData = {
					message: currentFilterEdit
						? l10n.gettext('Currently edited filter has been updated')
						: l10n.gettext('Currently viewed filter has been updated')
				};

				templateData.ok = _.form.button({
					text: l10n.gettext('Reload'),
					color: 'green',
					size: 'small',
					action: function() {
						NotificationStack.remove(self);
						// eslint-disable-next-line
						location.href = location.href;
					}
				});

				this.permanent = true;
				nativeDisabled = true; // do not show native message below
			}
		}

		if (this.model.get('alert_type') === 'sticky' || this.model.get('alert_type') === 'state') {
			this.permanent = true;
			nativeDisabled = true;
		}

		if (this.nativeNotifications && nativeDisabled !== true) {
			logger.log(
				'Showing native notification for',
				this.model.get('alert_type'),
				this.model.toJSON()
			);

			switch (this.model.get('alert_type')) {
				case 'deal':
				case 'person':
				case 'organization':
					this.clickable = true;
			}

			const notification = new window.Notification('Pipedrive', {
				body: this.model.get('message'),
				icon: `${app.config.static}/images/icons/pipedrive_48x48.png`
			});

			notification.onclick = function(event) {
				// Focus on web-app
				window.focus();
				self.clicked(event);
			};

			this.setTimeout(() => {
				if (_.isFunction(notification.close)) {
					notification.close();
				} else {
					notification.cancel();
				}
			}, notificationHideTimeout);

			return;
		}

		// Stickies
		if (this.permanent) {
			logger.log('Preparing sticky');
			this.blocker = this.model.get('blocker') || false;

			if (!_.isObject(templateData)) {
				templateData = {
					message
				};

				if (this.model.get('reload')) {
					templateData.ok = _.form.button({
						text: this.model.get('reload'),
						color: 'green',
						size: 'small',
						action: function() {
							NotificationStack.remove(self);
							// eslint-disable-next-line
							location.href = location.href;
						}
					});
				} else {
					templateData.ok = _.form.button({
						text: this.model.get('button') || l10n.gettext('Ok'),
						color: 'green',
						size: 'small',
						action: function() {
							NotificationStack.remove(self);
						}
					});
				}
			}

			message = this.stickyTemplate(templateData);
		}

		this.$el.html(message);

		logger.log('Rendering', this.model.get('alert_type'));

		switch (this.model.get('alert_type')) {
			case 'deal':
			case 'person':
			case 'organization':
				this.clickable = true;
				this.$el.addClass('clickable');
				break;
		}

		this.permanent = this.permanent === true || this.model.get('alert_type') === 'sticky';

		if (existing) {
			NotificationStack.resetTimer(this);
		} else {
			NotificationStack.push(this);
		}
	},
	/* eslint-enable complexity */

	clicked: function() {
		if (this.clickable) {
			switch (this.model.get('alert_type')) {
				case 'deal':
					location.href = `${app.config.baseurl}/deal/${this.model.get('_meta').id}`;
					break;
				case 'person':
					location.href = `${app.config.baseurl}/person/${this.model.get('_meta').id}`;
					break;
				case 'organization':
					location.href = `${app.config.baseurl}/organization/${
						this.model.get('_meta').id
					}`;
					break;
			}

			if (!this.nativeNotifications) {
				this.destroy();
			}
		}
	},

	show: function(callback) {
		this.$el.fadeIn(100, () => {
			if (_.isFunction(callback)) {
				return callback();
			}
		});
	},

	/* eslint-disable consistent-this */
	destroy: function(callback) {
		const self = this;

		this.$el
			.fadeOut()
			.promise()
			.done(function() {
				const that = this;
				const then = () => {
					that.remove();
				};

				self.trigger('destroy', self);

				if (_.isFunction(callback)) {
					return callback(then);
				} else {
					then();
				}
			});
	}
	/* eslint-enable consistent-this */
});
const Notifications = Pipedrive.View.extend(
	/** @lends views/ui/Notifications.prototype */ {
		/**
		 * Notifications class for displaying alerts in the webapp. Binds to
		 * `api.`, `state.`, `alert.` messages. Publisher can be of any source
		 * that has event handling (usual `.on('eventname', callback, context)`).
		 *
		 * @example
		 * <caption>app.js example of how to enable Notifications</caption>
		 * // Connect to web socket
		 *
		 * // Enable notifications
		 * new Notifications(SocketHandler);
		 *
		 * @classdesc Popup notifications generator
		 * @class Notifications
		 * @constructs
		 * @augments {module:Pipedrive.View}
		 *
		 * @param {Publisher} Publisher Message publisher class, most commonly
		 *                              {@link models/SocketHandler}.
		 * @void
		 */
		initialize: function(Publisher, options) {
			this.allMessages = !!options.allMessages;

			Publisher.on('api. state. alert.', this.renderItem, this);
		},

		/**
     * Puts a new message to the notifications stack or updates existing
     * message (identified by routing key)
     *
     * @param {Object} data        Message data to render
     * @param {String} data.alert_type   Type of notification to render
     * @param {String} data.alert_action Action type of the message
     *                                   (updated, created, ...)
     * @param {String} data.message      Main body of the notification
     * @param {String} [data.button]     Button text of the notification

     * @param {Object} data._meta  Meta data for configuring some types of
     *                             messages
     * @param {String} [data._meta.id]         ID of object of data.alert_type
     * @param {String} [data._meta.user_id]    User ID of the event creator
     * @param {String} [data._meta.routingKey] Message routing key
     */
		renderItem: function(data) {
			let alert, existing;

			// There is no message - nothing to show
			if (!data.message) {
				return;
			}

			// Don’t show notificatoin when allMessages is false
			if (!this.allMessages && data._meta.routingKey.match(/^api./)) {
				return;
			}

			// Try to replace messages with exact routing key
			if (
				data._meta &&
				data._meta.routingKey &&
				(alert = NotificationStack.findItem(data._meta.routingKey)) !== false
			) {
				alert.model.set(data);
				existing = true;
			} else {
				alert = new NotificationView({
					model: new Pipedrive.Model(data)
				});
			}

			alert.render(existing);
		}
	}
);

module.exports = Notifications;
