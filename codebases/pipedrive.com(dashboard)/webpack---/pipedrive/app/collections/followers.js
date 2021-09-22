'use strict';

const Pipedrive = require('pipedrive');
const FollowerModel = require('models/follower');

module.exports = Pipedrive.Collection.extend(
	/** @lends collections/Followers.prototype */ {
		/**
		 * Follower model, container for Person model
		 * @type {models/Follower}
		 */
		model: FollowerModel,

		pullLimit: 500,

		/**
		 * @class Followers collection
		 * @augments module:Pipedrive.Collection
		 * @constructs
		 * @param {Object} options Options needed to get followers from the
		 *                         API. Requires `relatedModel`
		 */
		initialize: function(data, options) {
			this.options = options || {};
			this.relatedModel = this.options.relatedModel;

			if (!this.relatedModel) {
				throw new Pipedrive.CollectionException('CollectionView: Missing relatedModel');
			}

			this.bindListeners();
		},

		/**
		 * Build an API endpoint based on deal_id provided with options
		 * @return {String} API endpoint for followers
		 */
		url: function() {
			return `${app.config.api}/${this.relatedModel.type}s/${this.relatedModel.id}/followers`;
		},

		bindListeners: function() {
			app.global.bind(
				`${this.relatedModel.type}Follower.model.*.add`,
				this.onFollowerUpdate,
				this
			);
			app.global.bind(
				`${this.relatedModel.type}Follower.model.*.update`,
				this.onFollowerUpdate,
				this
			);
			app.global.bind(
				`${this.relatedModel.type}Follower.model.*.delete`,
				this.onFollowerDelete,
				this
			);
		},

		onFollowerUpdate: function(model) {
			const isFollowerInCollection = this.find({ id: model.id });
			const isRelated = model.get(this.relatedModel.relationKey) === this.relatedModel.id;

			if (!isRelated) {
				return;
			}

			if (!isFollowerInCollection) {
				const newFollower = new FollowerModel(model.toJSON());

				this.add(newFollower);
			}
		},

		onFollowerDelete: function(modelId) {
			const followerInCollection = this.find({ id: modelId });

			if (followerInCollection) {
				this.remove(followerInCollection);
			}
		},

		/**
		 * Separates usable data for collections from API
		 * @param  {Object} response Response object and data (whole API response)
		 * @return {Object}          Data part of the API response
		 */
		parse: function(response) {
			return response.data;
		}
	}
);
