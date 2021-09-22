const Pipedrive = require('pipedrive');
const BulkEditHelper = require('utils/bulk-edit-helper');

module.exports = Pipedrive.Model.extend(BulkEditHelper).extend({
	type: null,

	endpoints: {
		deal: '/deals',
		person: '/persons',
		organization: '/organizations',
		activity: '/activities',
		product: '/products',
		mailThread: '/mailbox/mailThreads'
	},

	initialize: function(data, options) {
		this.options = options || {};
		this.type = this.options.type || this.options.collection.type;
	},

	url: function() {
		return app.config.api + this.endpoints[this.type];
	},

	isNew: function() {
		return false;
	},

	/**
	 * Overwrite destroy not to delete bulkedit model
	 * @param  {Object} options Data needed for delete request and success callback
	 * @void
	 */
	destroy: function(options) {
		const model = new Pipedrive.Model({
			id: this.cid
		});

		model.destroy({
			url: this.url(),
			ids: options.ids,
			success: options.success
		});
	}
});
