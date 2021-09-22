const Pipedrive = require('pipedrive');
const _ = require('lodash');

module.exports = Pipedrive.Model.extend({
	type: null,

	url: `${app.config.api}/mailbox/mailThreads`,

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};
		this.collection = this.options.collection;
	},

	/**
	 * Needed to force PUT request on this.save()
	 * Otherwise it will try to create a new model into the BE via POST request
	 * @return {Boolean}
	 */
	isNew: function() {
		return false;
	},

	editThreads: function(ids, key, newValue, toRemove, callback) {
		const data = {};

		data[key] = newValue;

		// resets the model attributes so they don't influence next save requests
		this.clear();
		this.save(
			{
				data,
				ids
			},
			{
				success: function() {
					if (toRemove) {
						this.removeThreads(ids);

						return;
					}

					const updatedModels = this.collection.filter((model) => {
						return _.includes(ids, model.get('id'));
					});

					_.forEach(updatedModels, (model) => {
						model.set(key, newValue);
					});

					if (_.isFunction(callback)) {
						return callback();
					}
				}.bind(this)
			}
		);
	},

	markAllAsRead: function(folder, callback) {
		this.clear();
		this.save(
			{
				folder
			},
			{
				url: `${app.config.api}/mailbox/mailThreads/markAllAsRead`,
				success: _.bind(() => {
					if (_.isFunction(callback)) {
						callback();

						return;
					}
				})
			}
		);
	},

	/**
	 * Will bulk delete all selected threads
	 * @param  {Object} ids selected threads ID-s
	 * @void
	 */
	deleteThreads: function(ids, callbacks) {
		this.clear();
		this.destroy({
			// This format needed for DELETE request
			ids: JSON.stringify({
				ids
			}),
			success: this.removeThreads.bind(this, ids, callbacks)
		});
	},

	removeThreads: function(ids, callbacks) {
		const models = this.collection.filter((model) => {
			return _.includes(ids, model.get('id'));
		});

		_.forEach(models, (model) => {
			this.collection.removeThread(model.get('id'));
		});

		if (callbacks && _.isFunction(callbacks.success)) {
			callbacks.success();
		}
	}
});
