const CollectionView = require('views/collectionview');
const _ = require('lodash');

module.exports = CollectionView.extend({
	initialize: function(options) {
		// eslint-disable-next-line prefer-rest-params
		CollectionView.prototype.initialize.apply(this, arguments);

		this.settings = options.settings;
		this.filesCountByDay = options.filesCountByDay || {};
		this.setCollectionViewLimit(this.settings.foldOn, this.settings.foldTo);
	},

	selfRender: function() {
		CollectionView.prototype.selfRender.call(this);

		this.setCollectionViewLimit(this.settings.foldOn, this.settings.foldTo);

		let day = '';

		if (this.collection.itemTimestamp) {
			day = this.collection.itemTimestamp.split(' ')[0];
		}

		const totalFilesForTheDay = this.filesCountByDay[day] || this.collection.length;

		if (totalFilesForTheDay > this.settings.foldOn) {
			const moreFilesCount = totalFilesForTheDay - this.settings.foldTo;
			const buttonText = this.settings.expanded
				? _.gettext('Show less')
				: _.gettext(
						_.ngettext('%s more file', '%s more files', moreFilesCount),
						moreFilesCount
				  );

			this.$el.append(`<div class="fileInfo show-more"><a>${buttonText}</a></div>`);
		}
	},

	afterRender: function() {
		this.$('.show-more').click(
			_.bind(function() {
				this.settings.expanded = !this.settings.expanded;

				this.setCollectionViewLimit(this.settings.foldOn, this.settings.foldTo);

				this.render();
			}, this)
		);
	},

	setCollectionViewLimit: function(foldOn, foldTo) {
		if (this.settings.expanded) {
			this.options.limit = 0;
		} else {
			this.options.limit = this.collection.length > foldOn ? foldTo : 0;
		}
	}
});
