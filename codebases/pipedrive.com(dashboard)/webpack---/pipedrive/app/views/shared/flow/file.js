const Pipedrive = require('pipedrive');
const _ = require('lodash');
const RelatedItemsView = require('views/shared/relateditems');
const DropMenu = require('views/ui/dropmenu');
const Template = require('templates/shared/flow/file.html');
const User = require('models/user');
const modals = require('utils/modals');
const $ = require('jquery');

require('fancybox');
require('fancybox.resize');

module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	initialize: function(options) {
		this.model = options.model;
		this.relatedModel = options.relatedModel;

		this.initSubViews();

		this.model.on('sync', this.render, this);
	},

	initSubViews: function() {
		if (this.relatedModel) {
			this.relatedItems = new RelatedItemsView({
				model: this.model,
				relatedModel: this.relatedModel,
				containerClassName: 'flowItemDetails'
			});

			this.addView('.relatedItems', this.relatedItems);
		}
	},

	templateHelpers: function() {
		const templateHelpers = {
			model: this.model,
			hasDescription: this.getFileModelClasses(this.model)
		};

		return templateHelpers;
	},

	getFileModelClasses: function(model) {
		const fileInfoClasses = [];

		if (model.get('description')) {
			fileInfoClasses.push('hasDescription');
		}

		return fileInfoClasses;
	},

	showTooltips: function() {
		this.$('.actionButtons span').each(
			function(key, el) {
				$(el).tooltip({
					tip: $(el).data('tooltip'),
					preDelay: 0,
					postDelay: 0,
					zIndex: 20000,
					fadeOutSpeed: 100,
					position: 'top'
				});
			}.bind(this)
		);
	},

	afterRender: function() {
		const dropmenuData = [];
		const hasDescription = this.$('.fileInfo').hasClass('hasDescription');
		const url = this.model.getUrl();
		const downloadUrl = url + (url.indexOf('direct_download') > -1 ? '' : '&direct_download=1');
		const canDelete = User.get('is_admin') || this.model.get('user_id') === User.get('id');
		const self = this;

		dropmenuData.push({
			title: hasDescription ? _.gettext('Edit description') : _.gettext('Add description'),
			className: 'description',
			click: function() {
				modals.open('webapp:modal', {
					modal: 'file/description',
					params: {
						model: self.model
					}
				});
			}
		});

		dropmenuData.push({
			title: _.gettext('Download'),
			className: 'download',
			click: function() {
				window.open(downloadUrl, '_self');
			}
		});

		if (canDelete) {
			dropmenuData.push({
				title: _.gettext('Delete'),
				className: 'delete',
				click: function() {
					self.deleteFile();
				}
			});
		}

		new DropMenu({
			target: this.$el.find('.selectSettingsButton[data-type=file]'),
			ui: 'arrowDropmenu',
			alignRight: true,
			data: dropmenuData,
			activeOnClick: false
		});

		this.showTooltips();
	},

	deleteFile: function() {
		this.model.destroy();
	}
});
