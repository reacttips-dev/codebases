const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const FollowerModel = require('models/follower');
const CollectionView = require('views/collectionview');
const ListItemView = require('views/shared/persons-list-item');
const Template = require('templates/shared/persons-list.html');

module.exports = Pipedrive.View.extend(
	/** @lends views/PersonsListView.prototype */ {
		template: _.template(Template.replace(/>\s+</g, '><')),
		saving: false,

		/**
		 * Default settings, override these in constructor options. <br> Use this as example what to pass into constructor
		 * @const {Object}
		 * @enum {string}
		 */
		defaultOptions: {
			headerTemplate: null,
			collection: null,
			maxVisiblePersons: 11,
			visiblePersons: 10,
			addNewHandler: null,
			viewDetailsHandler: null,
			model: null,
			callCollectionPull: false
		},

		visiblePersonsCount: 10,
		hiddenPersonsCount: 0,

		/**
		 * Persons List view class
		 *
		 * @class PersonsListView view class
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @example
		 * this.followersView = new PersonsListView({
		 *		collection: this.followersCollection,
		 *		model: this.model,
		 *		headerTemplate: FollowersTemplate,
		 *		emptyText: _.gettext('There are no followers to this person'),
		 *		addNewHandler: function(ev) {
		 *  		ev.preventDefault();
		 *			app.router.go(null, '#dialog/followers', false , false, {addNew: true, model: this.model });
		 *		},
		 *		viewDetailsHandler: function(ev) {
		 *  		ev.preventDefault();
		 *			app.router.go(null, '#dialog/followers', false , false, {model: this.model });
		 *		}
		 *	});
		 *
		 * @param {object} options options object
		 * @param {object} options.collection followers/persons/participants collection
		 * @param {object} options.model related model
		 * @param {function} options.addNewHandler function to handle add new button
		 * @param {function} options.viewDetailsHandler function to handle view details button
		 * @param {template} options.headerTemplate custom header template
		 */
		initialize: function(options) {
			this.options = _.assignIn({}, this.defaultOptions, options);

			this.collection = this.options.collection;
			this.type = this.collection.getCollectionModelType();

			if (this.options.headerTemplate) {
				this.headerTemplate = _.template(this.options.headerTemplate);
			}

			this.setPersonCounts();
			this.initSubViews();
			this.render();

			this.collection.once('sort', this.collectionReady, this);
			this.collection.on('sort remove', this.collectionUpdate, this);
			this.model.onChange(`${this.type}s_count`, this.render, this);
		},

		/**
		 * Initialize subviews
		 * @void
		 */
		initSubViews: function() {
			this.collectionView = new CollectionView(
				{
					collection: this.collection,
					childView: ListItemView,
					tagName: 'ul',
					limit: this.visiblePersonsCount,
					callCollectionPull: this.options.callCollectionPull
				},
				{
					tagName: 'li',
					className: 'listItem'
				}
			);

			this.collectionView.render();

			this.addView('.listContainer', this.collectionView);
		},

		/**
		 * Returns custom header template function
		 * @return {string} returns custom template string.
		 */
		getHeader: function() {
			if (_.isFunction(this.headerTemplate)) {
				const organizationOwner = this.model.relatedObjects
					? _.has(this.model.relatedObjects.user, User.get('id'))
					: false;

				return this.headerTemplate(
					_.assignIn(this, {
						canEditFollowers:
							User.get('is_admin') ||
							User.settings.get('can_see_other_users') ||
							organizationOwner
					})
				);
			}

			return '';
		},

		collectionReady: function() {
			this.collection.on(
				'add',
				function() {
					if (this.type === 'person') {
						this.model.set('people_count', this.model.get('people_count') + 1);
					}

					this.collectionUpdate();
				},
				this
			);

			this.collection.on(
				'remove',
				function() {
					if (this.type === 'person') {
						this.model.set('people_count', this.model.get('people_count') - 1);
					}

					this.collectionUpdate();
				},
				this
			);
		},

		/**
		 * Updates Collection view and sets visible persons count if options.limit is present.
		 * Renders PersonsListView
		 * @void
		 */
		collectionUpdate: function() {
			this.setPersonCounts();

			if (this.collectionView.options.limit !== this.visiblePersonsCount) {
				this.collectionView.options.limit = this.visiblePersonsCount;
				this.collectionView.render();
			}

			this.render();
		},

		/**
		 * Will set visible persons count and hidden persons count
		 * @void
		 */
		setPersonCounts: function() {
			const totalPersons = this.model.get(
				`${this.type === 'person' ? 'people' : `${this.type}s`}_count`
			);

			if (totalPersons <= this.options.maxVisiblePersons) {
				this.visiblePersonsCount = this.options.maxVisiblePersons;
			} else {
				this.visiblePersonsCount = this.options.visiblePersons;
			}

			this.hiddenPersonsCount = Math.max(totalPersons - this.visiblePersonsCount, 0);
		},

		/**
		 * Returns if current user is following
		 * @return {object} returns current follower object
		 */
		getCurrentFollowingUser: function() {
			return this.collection.find({ user_id: User.get('id') });
		},

		/**
		 * Adds current user to followers list
		 * @void
		 */
		startFollowing: function() {
			const self = this;
			const newFollower = new FollowerModel({
				user_id: User.get('id')
			});

			this.saving = true;
			self.collection.add(newFollower);

			newFollower.save(null, {
				success: function() {
					self.saving = false;
					self.render();
				}
			});
		},

		/**
		 * Removes current user from followers list
		 * @void
		 */
		stopFollowing: function() {
			const self = this;

			this.saving = true;
			this.render();

			const currentFollowingUser = this.getCurrentFollowingUser();

			currentFollowingUser.destroy({
				success: function() {
					self.saving = false;
					self.render();
				}
			});
		},

		bindEvents: function() {
			this.$('.addNew').on('click', _.bind(this.options.addNewHandler, this));
			this.$('[data-action="viewPersons"]').on(
				'click',
				_.bind(this.options.viewDetailsHandler, this)
			);

			if (this.type === 'follower') {
				this.$('[data-action="stopFollowing"]').on(
					'click.stopFollowing',
					_.bind(this.stopFollowing, this)
				);
				this.$('[data-action="startFollowing"]').on(
					'click.startFollowing',
					_.bind(this.startFollowing, this)
				);
			}
		},

		selfRender: function() {
			this.$el.html(
				this.template(
					_.assignIn(this, {
						canEditFollowers:
							User.get('is_admin') || User.settings.get('can_see_other_users')
					})
				)
			);

			this.bindEvents();
		}
	}
);
