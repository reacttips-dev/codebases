const { Collection } = require('@pipedrive/webapp-core');
const CustomViewModel = require('models/custom-view');

/**
 * Collection of custom views (that store table view colums and sorting)
 *
 * @param  {Object}
 * @class collections/CustomViews
 * @augments module:Collection
 */
module.exports = Collection.extend(
	/** @lends collections/CustomViews.prototype */ {
		model: CustomViewModel,
		url: null,

		/**
		 * Returns custom_view of a specific type
		 * @param  {String} type Type of view to return (possible values: product, person, organization, deal, activity, user)
		 * @param {String} key Key of the custom view (optional)
		 * @return {models/CustomView}
		 */
		getView: function(type, key) {
			key = key || 'default';

			return this.find(function(customView) {
				return (
					customView.get('view_type') === type &&
					customView.get('view_key') === key &&
					!customView.get('filter_id')
				);
			});
		},

		set: function(models, options) {
			return Collection.prototype.set.call(this, models, {
				...options,
				User: this.User
			});
		},

		setUser: function(User) {
			this.User = User;

			this.models.forEach((model) => model.setUser(User));
		}
	}
);
