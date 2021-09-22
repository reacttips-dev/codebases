const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');
const User = require('models/user');
const WebappApi = require('webapp-api/index');

module.exports = ServiceLoader.extend({
	component: 'labels-management-assets:label-dropmenu',
	serviceName: 'labels-management',

	template: _.template('<div></div>'),

	initialize: function(options) {
		ServiceLoader.prototype.initialize.apply(this);

		this.scrollContainerRef = options.scrollContainerRef;
		this.isButtonVisible = options.isButtonVisible;
		this.fieldKey = options.fieldKey;
		this.fieldModel = options.fieldModel;
		this.entityModel = options.entityModel;
		this.onOpen = options.onOpen;
		this.onClose = options.onClose;

		this.updateStore = this.updateStore.bind(this);
		this.onUnload = this.onUnload.bind(this);

		this.fieldModel.on('change', this.updateStore);
		this.entityModel.on(`change:${this.fieldKey}`, this.updateStore);
	},

	getLabels: function() {
		return this.fieldModel.get('options');
	},

	getSelectedLabelId: function() {
		return Number(this.entityModel.get(this.fieldKey));
	},

	renderPage: function(Dropmenu) {
		this.dropmenu = new Dropmenu({
			api: new WebappApi(),
			el: this.$el.get(0),
			scrollContainerRef: this.scrollContainerRef,
			popoverPortalRef: document.body,
			zIndex: 1000,
			onSelect: this.onLabelSelect.bind(this),
			onUpdate: this.onLabelsUpdate.bind(this),
			isButtonVisible: this.isButtonVisible,
			onOpen: this.onOpen,
			onClose: this.onClose,
			trackingData: {
				objectType: this.entityModel.type
			}
		});

		this.updateStore();
		this.dropmenu.render();
	},

	onLabelSelect: function(labelId) {
		const attributes = {};

		attributes[this.fieldKey] = labelId || '';

		this.entityModel.save(attributes, {
			error: function() {
				this.entityModel.set(this.entityModel.previousAttributes());
			}.bind(this)
		});
	},

	onLabelsUpdate: function(labels) {
		this.fieldModel.save(
			{ options: labels },
			{
				error: function() {
					this.fieldModel.set(this.fieldModel.previousAttributes());
				}.bind(this)
			}
		);
	},

	updateStore: function() {
		if (this.dropmenu) {
			this.dropmenu.updateStore({
				labels: this.getLabels(),
				selectedId: this.getSelectedLabelId(),
				canEdit: User.get('is_admin') || User.settings.get('can_modify_labels')
			});
		}
	},

	onUnload: function() {
		if (this.dropmenu) {
			this.dropmenu.destroy();
		}

		this.fieldModel.off('change', this.updateStore);
		this.entityModel.off(`change:${this.fieldKey}`, this.updateStore);
	}
});
