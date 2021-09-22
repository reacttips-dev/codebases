const CollectionView = require('views/collectionview');
const _ = require('lodash');
const mailGroupTemplate = require('./mail-group.html');
const $ = require('jquery');

module.exports = CollectionView.extend({
	/**
	 * Template for hidden email groupings
	 * @type {Function}
	 */
	mailGroupTemplate: _.template(mailGroupTemplate),

	/**
	 * Used to store email groups
	 * {
	 * 		'groupID' : '[array of mailViews]'
	 * 		'groupID' : '[array of mailViews]'
	 * 		'groupID' : '[array of mailViews]'
	 * 		...
	 * }
	 * If email group is opened by user, then group is deleted from this Object
	 * @type {Object}
	 */
	mailGroups: null,

	events: {
		'click div.mailGroup > div': 'onMailGroupClicked'
	},

	afterRender: function() {
		if (!_.isEmpty(this.mailGroups)) {
			this.hideGroupedMails();
		}
	},

	/**
	 * Groups all the thread messages and hides them into groups
	 * @void
	 */
	groupMailMessages: function() {
		this.removeMailGroups();

		if (this.collection.length < 3) {
			return;
		}

		this.declareMailGroups();
		this.hideGroupedMails();
	},

	/**
	 * Loops through all of the mail messages and divides them into groups if possible
	 * Rules for grouping:
	 * - first / last message is not included to group
	 * - unread messages are not included to group
	 * - to form a group it must have 2 or more consecutive mail messages
	 * @void
	 */
	declareMailGroups: function() {
		// this is used as a cursor, so every time a single group is finished new ID(+1) is assigned
		let mailGroupID = 1;

		const mailMessageViews = this.getMailMessageViews();

		this.mailGroups = {};

		_.forEach(
			mailMessageViews,
			_.bind(function(mailView, index) {
				const isUnread = !mailView.model.get('read_flag');
				const isFirstItem = index === 0;
				const isLastItem = index === mailMessageViews.length - 1;

				if (isFirstItem) {
					return;
				} else if (isUnread || isLastItem) {
					mailGroupID = this.tryToFinishGroup(mailGroupID);

					return;
				}

				this.addMailViewToGroup(mailGroupID, mailView);
			}, this)
		);
	},

	/**
	 * Gets all message views
	 * Views are in the same order as are related models in this.collection
	 * @return {Array}
	 */
	getMailMessageViews: function() {
		const views = [];

		this.collection.each(
			_.bind(function(model) {
				const selector = `${this.viewOptions.tagName}[data-cid=${model.cid}]`;
				const messageView = this.views[selector];

				views.push(messageView);
			}, this)
		);

		return views;
	},

	/**
	 * Tries to finish a specific group by:
	 * - deleting it if group has less than 2 mails in them
	 * OR
	 * - returning a new group ID for the caller
	 * @param  {Number} mailGroupID ID of the group that is being closed
	 * @return {Number} ID (same that was given as a @param or @param+1 if current group was successfully finished)
	 */
	tryToFinishGroup: function(mailGroupID) {
		if (this.mailGroups[mailGroupID]) {
			if (this.mailGroups[mailGroupID].length < 2) {
				delete this.mailGroups[mailGroupID];
			} else {
				mailGroupID++;
			}
		}

		return mailGroupID;
	},

	/**
	 * Adds a mail view to a specific group. Creates a new group first, if group doesn't exist yet.
	 * @param {Number} mailGroupID
	 * @param {module:Pipedrive.View} mailView
	 * @void
	 */
	addMailViewToGroup: function(mailGroupID, mailView) {
		if (!this.mailGroups[mailGroupID]) {
			this.mailGroups[mailGroupID] = [];
		}

		this.mailGroups[mailGroupID].push(mailView);
	},

	/**
	 * Hides the messages that belong to a specific group
	 * Replaces messages with group template
	 * @void
	 */
	hideGroupedMails: function() {
		_.forEach(
			this.mailGroups,
			_.bind(function(mailGroup, key) {
				const $groupElement = $(
					this.mailGroupTemplate({
						key,
						mailCount: mailGroup.length
					})
				);

				_.last(mailGroup).$el.before($groupElement);

				_.forEach(mailGroup, function(mailView) {
					mailView.$el.hide();
				});

				$groupElement.find('.mailCount, .separatorLine').tooltip({
					tip: _.gettext('%s older messages', mailGroup.length),
					position: 'bottom',
					clickCloses: true
				});
			}, this)
		);
	},

	removeMailGroups: function() {
		_.forEach(
			this.mailGroups,
			function(mailGroup, i) {
				const $groupElement = this.$el.find(`.mailGroup[group-id=${i}]`);

				$groupElement.remove();

				_.forEach(mailGroup, function(mailView) {
					mailView.$el.show();
				});

				delete this.mailGroups[i];
			}.bind(this)
		);
	},

	/**
	 * When user clicks on the mailgroup element, it reveals the hidden messages
	 * @param  {Object} event
	 * @void
	 */
	onMailGroupClicked: function(event) {
		const $groupElement = $(event.currentTarget.parentElement);
		const groupID = Number($groupElement.attr('group-id'));

		this.openMailGroup(groupID);
	},

	/**
	 * Reveals the hidden messages under specific group element
	 * Opened mail group will be deleted from mailGroups Object
	 * @param  {Number} groupID ID of the group to be opened
	 * @void
	 */
	openMailGroup: function(groupID) {
		const $groupElement = this.$el.find(`.mailGroup[group-id=${groupID}]`);

		_.forEach(this.mailGroups[groupID], function(mailView) {
			mailView.$el.show();
		});

		$groupElement.remove();
		delete this.mailGroups[groupID];
	},

	/**
	 * Collapses all messages' content (except the last/newest one)
	 * @void
	 */
	collapseAll: function() {
		const mailMessageViews = this.getMailMessageViews();

		_.forEach(mailMessageViews, function(mailMessageView, index) {
			// the last message will stay expanded
			if (index === mailMessageViews.length - 1) {
				return;
			}

			mailMessageView.toggleCollapse(true, true);
		});

		this.trigger('allMessagesCollapsed');
	},

	/**
	 * Opens all existing mail-groups and expands all messages' content
	 * @void
	 */
	expandAll: function() {
		const mailMessageViews = this.getMailMessageViews();

		_.forEach(
			this.mailGroups,
			_.bind(function(mailGroup, key) {
				this.openMailGroup(key);
			}, this)
		);

		_.forEach(mailMessageViews, function(mailMessageView) {
			mailMessageView.toggleCollapse(false, true);
		});

		this.trigger('allMessagesExpanded');
	},

	expandLastMailMessage: function() {
		const mailMessageViews = this.getMailMessageViews();
		const lastMessageView = mailMessageViews[mailMessageViews.length - 1];

		lastMessageView.toggleCollapse(false, true);
	},

	/**
	 * Checks whether this collection-view has any collapsed messages.
	 * @return {Boolean}
	 */
	hasCollapsedMessages: function() {
		const mailMessageViews = this.getMailMessageViews();

		let hasCollapsedMessages = false;

		_.forEach(mailMessageViews, function(mailMessageView) {
			if (mailMessageView.isCollapsed()) {
				hasCollapsedMessages = true;
			}
		});

		return hasCollapsedMessages;
	}
});
