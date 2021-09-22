const Pipedrive = require('pipedrive');
const User = require('models/user');
const _ = require('lodash');
const PinnedNotesCollection = require('collections/pinnednotes');
const PinnedNoteView = require('views/shared/pinnednote');

module.exports = Pipedrive.View.extend({
	views: null,

	initialize: function(options) {
		this.relatedModel = options.relatedModel;

		this.collection = new PinnedNotesCollection(null, {
			relatedModel: this.relatedModel
		});
		this.collection.on('sort add remove', this.renderViews, this);

		const queryParams = User.companyFeatures.get('comments')
			? {
					include_comments_summary: true
			  }
			: {};

		this.collection.pull({
			data: queryParams
		});

		this.views = [];
	},

	renderViews: function() {
		const self = this;

		this.$el.empty();

		this.collection.each((model) => {
			const view = new PinnedNoteView({
				model,
				relatedModel: self.relatedModel
			});

			self.views.push(view);
			self.$el.prepend(view.$el);
		});
	},

	onDestroy: function() {
		_.forEach(this.views, function(view) {
			view.off();
			view.destroy();
		});
	}
});
