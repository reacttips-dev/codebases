const Pipedrive = require('pipedrive');
const _ = require('lodash');
const ModalView = require('views/ui/modal');
const modals = require('utils/modals');

module.exports = Pipedrive.View.extend({
	dialogTitle: '',

	backToListButton: _.gettext('Back'),

	getModalOptions: function() {
		const self = this;
		const reOpen = _.debounce(self.reOpen.bind(self));

		return {
			class: 'listDialog',
			title: self.dialogTitle,
			content: self.$el,
			exportTable: self.options.exportTable,
			spacing: self.options.spacing,

			onload: function() {
				self.view.render();

				app.global.bind('ui.modal.dealProducts.initialize', (eventData) => {
					eventData.modal.options.action = _.form.button({
						action: reOpen,
						text: _.gettext('Close')
					});

					self.onClose();
				});

				app.global.bind('ui.modal.dealLost.initialize', (eventData) => {
					eventData.modal.onClose = reOpen;

					self.onClose();
				});

				app.global.bind('ui.modal.dataExport.initialize', (eventData) => {
					eventData.modal.options.reOpen = reOpen;

					self.onClose();
				});
			},

			onclose: self.onClose
		};
	},

	reOpen: function() {
		const view = new this.constructor({
			dialog: ModalView,
			params: this.options
		});

		ModalView.renderView(view);

		modals.reOpen();
	},

	onClose: function() {
		app.global.unbind('ui.modal.dealProducts.initialize');
		app.global.unbind('ui.modal.dealLost.initialize');
		app.global.unbind('ui.modal.dataExport.initialize');
		this.$el.empty().remove();
	}
});
