const Pipedrive = require('pipedrive');
const _ = require('lodash');
const FollowersCollection = require('collections/followers');
const Company = require('collections/company');
const FollowerModel = require('models/follower');
const followersListTemplate = require('templates/shared/followers-list.html');
const followersNameFieldTemplate = require('templates/shared/followers-name-field.html');
const TableView = require('views/shared/table');
const helper = require('utils/helpers');
const $ = require('jquery');

let local;

('use strict');

const FollowersList = Pipedrive.View.extend(
	/** @lends views/DealFollowersList.prototype */ {
		/**
		 *Followers list view template
		 * @const {function}
		 * @default
		 */
		template: _.template(followersListTemplate),

		/**
		 * Custom template for followers name field
		 * @const {function}
		 * @default
		 */
		followersNameField: _.template(followersNameFieldTemplate),

		/**
		 * Followers Table View
		 *
		 * @class Followers Table View
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @param {Object} options Options to set for the Table view
		 * @returns {view/DealFollowersList} Returns itself for chaining
		 */
		initialize: function(options) {
			this.options = options || {};
			// Get related model.id from object or directly from parameter
			this.relatedModel = this.options.relatedModel;

			// Start followers collection
			this.followers = new FollowersCollection([], {
				relatedModel: this.relatedModel
			});

			this.followers.setComparator('user.name');

			this.followers.once('sort sync', local.userDropdownUpdate, this);

			this.initChildViews();

			if (_.isFunction(this.onInitialize)) {
				this.onInitialize(options);
			}

			return this;
		},

		/**
		 * Initialize TableView child view
		 */
		initChildViews: function() {
			const tableView = new TableView({
				collection: this.followers,
				columns: {
					name: 'Name'
				},
				hideHeader: true,
				style: 'plain',
				showActions: true,
				removeButtonTooltip: _.gettext('Disable sharing for this user'),
				customTemplate: _.bind(local.chooseTemplate, this),
				onModelRemove: _.bind(local.addUserToDropdown, this)
			});

			tableView.render();
			this.addView('.listContainer', tableView);
		},

		/**
		 * Render main template
		 */
		selfRender: function() {
			this.$el.html(
				this.template({
					modal: !!this.options.isModal
				})
			);

			const self = this;

			this.$('.addFollowerArea select').on('change', function() {
				self.addNewFollower(this.value);
			});
		},

		/**
		 * Adds new user to followers collection
		 * @param {module:Pipedrive.Model} model Selected user model
		 */
		addNewFollower: function(userId) {
			if (!userId) {
				return;
			}

			const newFollower = new FollowerModel();

			newFollower[this.relatedModel.relationKey] = this.relatedModel.id;
			newFollower.user = Company.getUserById(parseInt(userId, 10));

			local.removeUserFromDropdown(newFollower);
			this.followers.add(newFollower);

			newFollower.save({
				user_id: userId,
				strict_mode: true
			});
		}
	}
);

/**
 * Private methods of {@link views/FollowersList}
 * @memberOf views/DealParticipantsList.prototype
 * @type {Object}
 * @enum {function}
 * @private
 */
local = {
	/**
	 * Used to create a icon before to ‘name’ field
	 * in followers list.
	 * @param  {views/shared/Field} field Field to check
	 * @param  {String} defaultTemplate Default template provided from the
	 *                                  Field object
	 * @return {String} template        Returns template to use
	 */
	chooseTemplate: function(field, defaultTemplate) {
		if (field.key === 'name' && field.state === field.states.READ) {
			return this.followersNameField;
		} else {
			return defaultTemplate;
		}
	},

	/**
	 * Handles user dropdown changes
	 * @description if new follower is added or removed, user list must be updated
	 *              so user, who is already follower, will be romaved from there
	 * @param {module:Pipedrive.Model} model Model that was removed or added from/to a
	 *                                       collection
	 * @void
	 */
	userDropdownUpdate: function(followers) {
		if (helper.isCollection(followers)) {
			followers.each(function(model) {
				if (model.user) {
					$(`.addFollowerArea select option[value="${model.user.id}"]`).remove();
				}
			});
		}

		local.showMessage.call();
	},

	/**
	 * Add user back to dropdown
	 * @description if follower removed from a collection, user is added back to
	 *              select dropdown, alpabetically to right place
	 *
	 * @void
	 */
	addUserToDropdown: function(model) {
		if (!model.user) {
			return;
		}

		$('.addFollowerArea select').append(
			`<option value="${model.user.id}">${model.user.get('name')}</option>`
		);
		// sort select options if new user is added there
		const options = $('.addFollowerArea select option').sort(function(a, b) {
			if (a.text > b.text) {
				return 1;
			} else if (a.text < b.text) {
				return -1;
			} else {
				return 0;
			}
		});

		$('.addFollowerArea select').html(options);
		local.showMessage.call();
	},

	/**
	 * Remove user from dropdown
	 * @description if follower is added as follower, user is removed from
	 *              select dropdown, so you cant add same user twice
	 *
	 * @void
	 */
	removeUserFromDropdown: function(model) {
		if (model.user) {
			$(`.addFollowerArea select option[value="${model.user.id}"]`).remove();
			$('.addFollowerArea select[name="user_list"]').select2();

			local.showMessage.call();
		}
	},

	/**
	 * Show mesage, if all users all following
	 * @description if user is added or removed as follower
	 *              check if all the users are also fallowers or not
	 *
	 * @void
	 */
	showMessage: function() {
		if ($('.addFollowerArea select[name="user_list"] > option').length > 1) {
			$('.addFollowerArea select[name="user_list"]').prop('disabled', false);
			$('.followersList .message').slideUp();
		} else {
			$('.addFollowerArea select[name="user_list"]').prop('disabled', true);
			$('.followersList .message').slideDown();
		}
	}
};

module.exports = FollowersList;
