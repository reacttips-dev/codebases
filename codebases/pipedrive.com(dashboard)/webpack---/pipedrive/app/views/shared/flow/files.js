'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const CollectionView = require('views/shared/flow/files-collection-view');
const FileView = require('views/shared/flow/file');
const GoogleFiles = require('utils/google-files');
const Template = require('templates/shared/flow/files.html');
const $ = require('jquery');
const PDMetrics = require('utils/pd-metrics');

module.exports = Pipedrive.View.extend({
	template: _.template(Template),
	templateHelpers: {},

	collection: null,

	relatedModel: null,

	settings: {
		foldOn: 5,
		foldTo: 3,
		expanded: false
	},

	initialize: function(options) {
		this.options = options;
		this.relatedModel = options.relatedModel;
		this.filters = this.options.flowItemModel.collection.filters;
		this.filters.on('change', this.render, this);
		this.additionalData = options.collection.additionalData;
		// flow-item passes as model
		this.collection = this.model;

		this.initSubViews();

		this.render();
	},

	initSubViews: function() {
		this.filesView = new CollectionView(
			{
				collection: this.collection,
				childView: FileView,
				settings: this.settings,
				filesCountByDay: this.additionalData.filesCountByDay
			},
			{
				relatedModel: this.relatedModel
			}
		);

		this.filesView.render();

		this.addView('.filesGroup', this.filesView);
	},
	trackFileOpened: function(ev) {
		const id = $(ev.target)
			.closest('.fileInfo')
			.data('id');
		const type = $(ev.target).data('file-type');

		PDMetrics.trackUsage(null, 'file', 'opened', { id, type, source: 'flow_item' });
	},
	imageFancybox: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		$.fancybox(this.$('.img'), {
			index: this.$('.img').index(ev.target),
			minWidth: 40,
			minHeight: 40,
			openEffect: 'none',
			closeEffect: 'none',
			type: 'image',
			helpers: {
				buttons: {},
				title: {
					type: 'float'
				}
			}
		});
	},

	googleFancybox: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		GoogleFiles.openFile($(ev.target).data('file-type'), ev.target, ev.target.href);
	},

	afterRender: function() {
		this.$el.on('click', '.fileDescription a', _.bind(this.trackFileOpened, this));
		this.$el.on('click', '.fileDescription a.img', _.bind(this.imageFancybox, this));
		this.$el.on(
			'click',
			'.fileDescription a.gslides, .fileDescription a.gform, .fileDescription a.gdraw, ' +
				'.fileDescription a.gsheet, .fileDescription a.gdoc',
			_.bind(this.googleFancybox, this)
		);
	}
});
